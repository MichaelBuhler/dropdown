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
    
    settings.highlight = settings.highlight || false;

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

    settings.options.forEach(function (option) {
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
        if ( option === settings.selected ) {
            setSelection(opt);
        }
    });

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

    field.addEventListener('keyup', function (e) {
        if ( e.keyCode === 13 ) {
            if ( options.style.display === 'block' ) select(highlighted);
        } else if ( e.keyCode === 27 ) {
            setSelection(selected);
            hide();
        } else if ( e.keyCode === 38 ) {
            if ( highlightIndex > 0 ) highlightIndex--;
            show();
            if ( highlighted && highlighted.div.offsetTop - options.scrollTop < options.clientHeight / 4 ) {
                options.scrollTop = highlighted.div.offsetTop - options.clientHeight / 4;
            }
        } else if ( e.keyCode === 40 ) {
            if ( highlightIndex < visibleCount - 1 ) highlightIndex++;
            show();
            if ( highlighted && highlighted.div.offsetTop > options.clientHeight * 3 / 4 ) {
                options.scrollTop = highlighted.div.offsetTop - options.clientHeight * 3 / 4;
            }
        } else if ( e.keyCode !== 9 ) {
            highlightIndex = 0;
            show();
        }
    });

    function show () { options.style.display = 'block'; render();  }

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

    function setSelection (selection) {
        selected = selection;
        field.value = (selected && selected.obj) ? selected.obj[settings.label] : '';
    }

    function select (selection) {
        setSelection(selection);
        if (settings.onSelect) settings.onSelect(selection.obj);
        hide();
    }

    function unique (classes) {
        var newClasses = [];
        classes.forEach(function (oldVal) {
            if (
                oldVal !== '' &&
                !newClasses.some(function (newVal) { return newVal === oldVal; })
            ) {
                newClasses.push(oldVal);
            }
        });
        return newClasses;
    }

    function addClass (element, clazz) {
        var classes = element.className.split(' ');
        classes.push(clazz);
        element.className = unique(classes).join(' ');
    }

    function removeClass (element, clazz) {
        var oldClassNames = element.className.split(' ');
        var newClassNames = [];
        oldClassNames.forEach(function (oldClassName) {
            if ( oldClassName !== clazz ) newClassNames.push(oldClassName);
        });
        element.className = newClassNames.join(' ');
    }
    
    function highlightSubstring(o, str){
		o.div.innerHTML = o.div.innerHTML.replace(new RegExp('(' + str + '+)', 'gi'), '<b>$1</b>');
		return o;
	}
    
    function unHighlightSubstring(o){
		o.div.innerHTML = o.div.textContent || o.div.innerText || '';
		return o;
	}

}
