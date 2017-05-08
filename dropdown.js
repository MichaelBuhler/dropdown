function dropdown(settings) {

	var container = ( typeof settings.container === 'string' ) ? document.getElementById(settings.container) : settings.container;
	container.innerHTML = '';
	addClass(container, 'dropdown');

	var field = document.createElement('input');
	field.className = settings.classname || 'field';
	field.placeholder = settings.placeholder || 'Type to filter...';
	container.appendChild(field);
	var options = document.createElement('div');
	options.id = 'options';
	options.className = 'options';
	container.appendChild(options);

	settings.min = settings.min || 1;
	settings.delay = settings.delay || 150;

	var opts = [];
	var selecting = false;
	var visibleCount = 0;
	var highlightIndex = 0;
	var highlighted = null;
	var selected = null;
	var delayTimer;

	var none = document.createElement('div');
	none.innerHTML = '- No Selection -';
	none.className = 'option disabled';
	var nothing = {
		obj: null,
		div: none
	};
	none.addEventListener('click', function () {
		select(nothing);
	});
	options.appendChild(none);

	if(settings.remote !== undefined){
		settings.remote.url = settings.remote.url || '/';
		settings.remote.q = settings.remote.q || 'q';
	}

	if(settings.options !== undefined && settings.options.length) settings.options.forEach(prepareOption);

	var empty = document.createElement('div');
	empty.innerHTML = '- No Results -';
	empty.className = 'option disabled';
	empty.style.display = 'none';
	empty.style.cursor = 'default';
	options.appendChild(empty);

	field.addEventListener('blur', function () {
		if (!selecting) {
			hide();
			setSelection(selected);
		}
	});

	options.addEventListener('mousedown', function () { selecting = true; });

	options.addEventListener('mouseup', function () { selecting = false; });

	field.addEventListener('keyup', onKeyUp);

	function prepareOption(option){
		var div = document.createElement('div');
		div.innerHTML = option[settings.label];
		div.className = 'option';
		var opt = {
			obj: option,
			div: div
		};
		div.addEventListener('click', function () {
			select(opt);
		});
		options.appendChild(div);
		opts.push(opt);
		if ( JSON.stringify(option) === JSON.stringify(settings.selected) ) {
			setSelection(opt);
		}
	}

	function onKeyUp(e){
		switch(e.keyCode){
			case 13: // enter
				if ( options.style.display === 'block' ) select(highlighted);
				break;
			case 27: // esc
				setSelection(selected);
				hide();
				break;
			case 38: // up arrow
				if ( highlightIndex > 0 ) highlightIndex--;
				break;
			case 40: // down arrow
				if ( highlightIndex < visibleCount - 1 ) highlightIndex++;
				break;
			default:
				if ( e.keyCode === 8 || e.keyCode === 32 || e.keyCode > 46 ) {
					highlightIndex = 0;
					show();
				}
				break;
		}
	}

	function performSearch(callback) {
		if(settings.remote !== undefined){
			resetOptionsList();
			performRemoteSearch(callback);
		}else{
			callback();
		}
	}

	var request = new XMLHttpRequest();

	function performRemoteSearch(callback){
		request.abort();

		request.open('GET', settings.remote.url + '?' + settings.remote.q + '=' + field.value.toLowerCase(), true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				var data = JSON.parse(request.responseText);

				data.forEach(prepareOption);

				callback();
			} else {
				console.error('Connection error.');
			}
		};

		request.onerror = function() {
			console.error('Connection error.');
		};

		request.send();
	}

	function show () {
		if(field.value.length >= settings.min){
			options.style.display = 'block';

			clearTimeout(delayTimer);

			delayTimer = setTimeout(function() {
				performSearch(render);
			}, settings.delay);
		}else{
			hide();
		}
	}

	function hide () { options.style.display = 'none'; }

	function render () {
		visibleCount = 0;

		removeClass(none, 'highlight');
		if ( field.value === '' ) {
			none.style.display = 'block';
			if ( visibleCount++ === highlightIndex ) {
				addClass(none, 'highlight');
				highlighted = nothing;
			}
		} else {
			none.style.display = 'none';
		}

		opts.forEach(function (opt) {
			removeClass(opt.div, 'highlight');
			if (settings.highlight) opt = unHighlightSubstring(opt);
			if (
				opt.obj[settings.label].toLowerCase().indexOf(field.value.toLowerCase()) > -1
			) {
				if (settings.highlight) opt = highlightSubstring(opt, field.value);
				opt.div.style.display = 'block';
				if ( visibleCount++ === highlightIndex ) {
					addClass(opt.div, 'highlight');
					highlighted = opt;
				}
			} else {
				opt.div.style.display = 'none';
			}
		});

		empty.style.display = ( visibleCount === 0 ) ? 'block' :'none';

		if (settings.up) {
			options.style.top = '-' + ( options.clientHeight + 3 ) + 'px';
		} else {
			options.style.top = ( field.clientHeight + 1 ) + 'px';
		}
	}

	function highlightSubstring(o, str){
		o.div.innerHTML = o.div.innerHTML.replace(new RegExp('(' + str + '+)', 'gi'), '<b>$1</b>');
		return o;
	}

	function unHighlightSubstring(o){
		o.div.innerHTML = o.div.textContent || o.div.innerText || '';
		return o;
	}

	function resetOptionsList(){
		var _opts = [].slice.call(options.getElementsByClassName('option'));

		if(_opts.length > 1){
			_opts.shift();

			_opts.forEach(function(el, i){
				el.parentNode.removeChild(el);
			});
		}
	}

	function setSelection (selection) {
		selected = selection;
		field.value = (selected && selected.obj) ? selected.obj[settings.label] : '';
	}

	function select (selection) {
		setSelection(selection);
		if (settings.onSelect) settings.onSelect(selection.obj);
		hide();
	}

	function addClass (element, clazz) {
		element.classList.add(clazz);
	}

	function removeClass (element, clazz) {
		element.classList.remove(clazz);
	}

}
