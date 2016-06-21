function dropdown(settings) {

    var container = document.getElementById(settings.container);
    addClass(container, 'dropdown');

    var field = document.createElement('input');
    field.className = 'field';
    container.appendChild(field);
    var options = document.createElement('div');
    options.id = 'options';
    options.className = 'options';
    container.appendChild(options);

    var opts = [];
    var selecting = false;
    var visibleCount = 0;
    var highlightIndex = 0;
    var highlighted = null;

    settings.options.forEach(function (option) {
        var div = document.createElement('div');
        div.innerHTML = option[settings.label];
        div.className = 'option';
        div.addEventListener('click', function () {
            select(option);
        });
        options.appendChild(div);
        opts.push({
            obj: option,
            div: div
        })
    });



    field.addEventListener('blur', function () { if (!selecting) hide(); });

    options.addEventListener('mousedown', function () { selecting = true; });

    options.addEventListener('mouseup', function () { selecting = false; });

    field.addEventListener('keyup', function (e) {
        if ( e.keyCode === 9) {
            return;
        } else if ( e.keyCode === 13 ) {
            select(highlighted);
            return;
        } else if ( e.keyCode === 38 ) {
            if ( highlightIndex > 0 ) highlightIndex--;
        } else if ( e.keyCode === 40 ) {
            if ( highlightIndex < visibleCount - 1 ) highlightIndex++;
        } else {
            highlightIndex = 0;
        }
        show();
    });

    function show () { options.style.display = 'block'; render();  }

    function hide () { options.style.display = 'none'; }

    function render () {
        visibleCount = 0;
        var regexes = [];
        field.value.split(' ').forEach(function (word) {
            var alphanumeric = word.match(/[0-9a-z]/gi);
            if (alphanumeric) regexes.push(new RegExp(alphanumeric.join('.*'),'i'));
        });

        opts.forEach(function (opt) {
            removeClass(opt.div, 'highlight');
            if (
                regexes.every(function (regex) {
                    return regex.test(opt.obj[settings.label]);
                })
            ) {
                opt.div.style.display = 'block';
                if ( visibleCount++ === highlightIndex ) {
                    addClass(opt.div, 'highlight');
                    highlighted = opt.obj;
                }
            } else {
                opt.div.style.display = 'none';
            }
        });

        if (settings.up) {
            options.style.top = '-' + ( options.clientHeight + 3 ) + 'px';
        } else {
            options.style.top = ( field.clientHeight + 1 ) + 'px';
        }
    }

    function select (selection) {
        field.value = selection[settings.label];
        if (settings.onSelect) settings.onSelect(selection);
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
}