function dropdown(settings) {

	var container = ( typeof settings.container === 'string' ) ? document.getElementById(settings.container) : settings.container;
	container.innerHTML = '';
	addClass(container, 'dropdown');

	var field = document.createElement('input');
	field.className = 'field';
	field.placeholder = settings.placeholder || 'Type to filter...';
	container.appendChild(field);
	var options = document.createElement('div');
	options.id = 'options';
	options.className = 'options';
	container.appendChild(options);

	settings.min = settings.min || 1;

	var opts = [];
	var selecting = false;
	var visibleCount = 0;
	var highlightIndex = 0;
	var highlighted = null;
	var selected = null;

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
		settings.remote.delay = settings.remote.delay || 150;
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
				if ( e.keyCode !== 9 ) { // tab
					highlightIndex = 0;
					performSearch(show);
				}
				break;
		}
	}

	function performSearch(callback) {
		if(settings.remote !== undefined){
			performRemoteSearch(callback);
		}else{
			callback();
		}
	}

	function performRemoteSearch(callback){
		if(typeof superagent === 'function'){
			superagent
				.get(settings.remote.url + '?' + settings.remote.q + '=')
				//.set('Authentication', 'Basic Z2FnOmNhbG9nZ2Vybw==')
				.end(function(err, res){

					if(err){
						console.error(err);
						alert('Si sono verificati errori di connessione.');
					}else{

						if(res.type == 'text/html'){
							res.body = JSON.parse(res.text);
						}

						console.log(res.body);

						data = res.body.home_recent.items;

						[].slice.call(RecentStories.getElementsByClassName('row')).forEach(renderSection);

					}

				});
		}
	}

	function show () {
		if(field.value.length >= settings.min){
			options.style.display = 'block';
			render();
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
