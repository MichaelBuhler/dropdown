function dropdown(settings) {

    var container = document.getElementById(settings.container);

    var field = document.createElement('input');
    container.appendChild(field);
    var options = document.createElement('div');
    container.appendChild(options);

    var opts = [];

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

    field.addEventListener('focus', function () {
        options.style.display = 'block';
    });

    field.addEventListener('click', function () {
        options.style.display = 'block';
    });

    var selecting = false;
    field.addEventListener('blur', function () {
        if (!selecting) options.style.display = 'none';
    });

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
            options.style.top = '-' + ( options.clientHeight + 3 ) + 'px';
        }
    });

    function select(selection) {
        field.value = selection[settings.label];
        if (settings.onSelect) settings.onSelect(selection);
        options.style.display = 'none';
    }
}