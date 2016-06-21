function dropdown(settings) {

    var container = document.getElementById(settings.container);
    container.className = container.className.trim() + ' dropdown';

    var field = document.createElement('input');
    field.className = 'field';
    container.appendChild(field);
    var options = document.createElement('div');
    options.id = 'options';
    options.className = 'options';
    container.appendChild(options);

    var opts = [];
    var selecting = false;

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

    field.addEventListener('focus', function () { show(); });

    field.addEventListener('click', function () { show(); });

    field.addEventListener('blur', function () { if (!selecting) hide(); });

    options.addEventListener('mousedown', function () {
        selecting = true;
    });

    options.addEventListener('mouseup', function () {
        selecting = false;
    });

    field.addEventListener('keyup', function (e) {
        if ( e.keyCode === 13 ) {
            //pressed enter, select something
        } else {
            render();
        }
    });

    function show () {
        options.style.display = 'block';
        render();
    }

    function hide () {
        options.style.display = 'none';
    }

    function render () {
        var regexes = [];
        field.value.split(' ').forEach(function (word) {
            var alphanumeric = word.match(/[0-9a-z]/gi);
            if (alphanumeric) regexes.push(new RegExp(alphanumeric.join('.*'),'i'));
        });
        opts.forEach(function (opt) {
            if (
                regexes.every(function (regex) {
                    return regex.test(opt.obj[settings.label]);
                })
            ) {
                opt.div.style.display = 'block';
            } else {
                opt.div.style.display = 'none';
            }
        });
        if (settings.up) {
            options.style.top = '-' + ( options.clientHeight + 3 ) + 'px';
        }
    }

    function select (selection) {
        field.value = selection[settings.label];
        if (settings.onSelect) settings.onSelect(selection);
        hide();
    }
}