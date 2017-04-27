# dropdown

A lighter alternative to [angular-ui/ui-select](https://github.com/angular-ui/ui-select),
[select2/select2](https://github.com/select2/select2), and
[jaridmargolin/selectize.js](https://github.com/jaridmargolin/selectize.js).
`dropdown` is less than 200 lines of vanilla JavaScript.

A textbox can be used to filter a dropdown (or 'dropup') of options. Arrow keys or mouse may be used
intuitively to make a selection. `dropdown` does not suffer from the negative performance aspects of
angular scopes that comes with `ui-select`. (I have this with 1300 options in production,
an instance where `ui-select` was positively unusable.) `dropdown` does not have a dependency
on [jquery/jquery](https://github.com/jquery/jquery) like `select2` and `selectize.js` do.

`dropdown` lacks advanced features such as server-side data or infinite scrolling. All options
must be already client-side.

A simple `onSelect()` callback means that `dropdown` can be easily integrated into whatever framework(s)
you may be using.

## Usage

```
<head>
    <link rel="stylesheet" type="text/css" href="dropdown.css"/>
    <script type="text/javascript" src="dropdown.js"></script>
</head>
```

```
<div id="myDropdown"></div>
<script type="text/javascript">
    var myOptions = [];                    // An array of JavaScript objects

    dropdown({
        container: 'myDropdown',           // The `id` of an element to render to
        placeholder: 'Type to filter...',  // The placeholder of text input
        highlight: false,                  // Highlight found substring in resultset
        min: 1,                            // Minimum length of string to start search
        options: myOptions,                // An array of selectable objects
        selected: myOptions[6],            // One of those object to be initially selected
        label: 'name',                     // Which option field to show and filter on
        up: false,                         // Whether to drop up or down
        onSelect: function (selection) {}  // A callback
    });
</script>
```

## Settings

All settings are passed in a hash as the first parameter to the globally exposed `dropdown()`
initialization function. Simply call this function multiple times to set up multiple
dropdowns on the same page.

### `container | required | HTMLElement or string`

`container` should be either an `HTMLElement` to render the text field and options in,
or `string` of the `id` of an `HTMLElement`. You cannot pass a jQuery object here; jQuery
objects are array-like objects and not actual elements. You would want to do some like this
`dropdown({ container: $('#myDropdown')[0], ... });`.

### `options | required | Object[]`

An `Array` of JavaScript objects. Can hold or reference any values that you would like,
but each option should have a field of type `string` with the name/label of the option,
and in each option the **name** of the field should be the same. This field is also used
to search/filter the options.

### `selected | optional | Object`

The option that is initially selected. This must be the exact same (`===`) JavaScript object
as the one in the `options`; no deep/shallow value comparison is performed. Default value:
`null`

### `label | required | string`

This is the name of the key in each of the `options` that holds the `string` that will be
shown to the user and filtered on.

### `up | optional | boolean`

A `boolean` choosing whether to drop up or not. If `true` the options will be rendered above
the text field on the page. This is useful if the field will be at or near the bottom of the
page/screen. Default value: `false`

### `onSelect | optional | Function`

A `function` to be called every time the user makes a selection. The function will be passed a
single argument equal to the object that was selected. This will be the actual object, not
a copy or a key or the name/label that the user sees. In this way, you may pass any data
(even functions) into this callback by attaching it to the option itself. Technically, it is
optional, but then you wouldn't know when anything is selected!
