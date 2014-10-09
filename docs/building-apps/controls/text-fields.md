% Text Fields

## enyo.Input

[enyo.Input](../../../index.html#/kind/enyo.Input) is an
[enyo.Control](../../../index.html#/kind/enyo.Control) that implements an HTML
`<input>` element with cross-platform support for change events.

You can listen for the `oninput` and `onchange` DOM events to know when the text
inside an Input has been modified.  `oninput` fires immediately, while
`onchange` fires when the text has changed and the input loses focus.

        components: [
            {kind: "enyo.Input", name: "myInput", placeholder: "Enter some text...",
                oninput: "inputChanged"}
        ],
        inputChanged: function(inSender, inEvent) {
            // retrieve new input value
            newInputValue = this.$.myInput.get("value");

            // do something in response
        }

![_enyo.Input_](../../assets/enyo-input.png)

As illustrated above, you may use the `placeholder` property to specify text to
be displayed when the input is empty.

Also, in the event handler method, you may access the value of the input by
calling `get("value")` (or `set("value", <new value>)`).

To create an input suitable for password entry, set the `type` property to
`"password"`.

Finally, two other properties of `enyo.Input` deserve mention.  By setting the
`disabled` property to `true`, you can prevent the user from entering anything
into the input (presumably on a temporary basis).  And by setting `defaultFocus`
to `true`, you can make the input take focus when rendered.  (Note that you
should only do this for one input.)

## moon.Input

[moon.Input](../../../index.html#/kind/moon.Input) derives from `enyo.Input` and
provides the same functionality with added visual styling.

Typically, a `moon.Input` is placed inside a
[moon.InputDecorator](../../../index.html#/kind/moon.InputDecorator), e.g.:

        {kind: "moon.InputDecorator", components: [
            {kind: "moon.Input", type: "password", placeholder: "Enter password",
                oninput: "inputChanged"}
        ]}

![_moon.Input_](../../assets/input.png)

## moon.ExpandableInput

[moon.ExpandableInput](../../../index.html#/kind/moon.ExpandableInput) is a
[moon.ExpandableListItem](../../../index.html#/kind/moon.ExpandableListItem)
that contains a `moon.Input` within its drop-down content area.

In its collapsed state, the ExpandableInput displays its `content` and `value`.
In the expanded state, the text input appears, giving the user the opportunity
to change the `value`.

        {kind: "moon.ExpandableInput", oninput: "inputChanging", onChange: "inputChanged",
            content: "Input with Value", value: "Initial value"}

![_moon.ExpandableInput (Collapsed)_](../../assets/expandable-input-collapsed.png)

![_moon.ExpandableInput (Expanded)_](../../assets/expandable-input-expanded.png)

## enyo.TextArea

[enyo.TextArea](../../../index.html#/kind/enyo.TextArea) is an `enyo.Input` that
implements an HTML `<textarea>` element with cross-platform support for change
events.

`enyo.TextArea` is functionally equivalent to `enyo.Input`; one interacts with
it through the same events (`oninput`, `onchange`) and properties (`value`,
`placeholder`, `type`, `disabled`, `defaultFocus`).

A TextArea differs from an Input mainly in that the text field it displays spans
multiple lines.

        {kind: "enyo.TextArea", placeholder: "Enter some text...", oninput: "inputChanged"}

![_enyo.TextArea_](../../assets/enyo-text-area.png)

## moon.TextArea

[moon.TextArea](../../../index.html#/kind/moon.TextArea) is a Moonstone-styled
TextArea control, derived from `enyo.TextArea`. Typically, a `moon.TextArea` is
placed inside a `moon.InputDecorator`, which provides styling, e.g.:

        {kind: "moon.InputDecorator", components: [
            {kind: "moon.TextArea", oninput: "inputChanged"}
        ]}

![_moon.TextArea_](../../assets/text-area.png)

## enyo.RichText

[enyo.RichText](../../../index.html#/kind/enyo.RichText) is a multi-line
`enyo.Input` that supports rich formatting, such as bold, italics, and
underlining.

        {kind: "enyo.RichText",
            value: "<b>Boldly</b> going where <i>no one</i> has gone before",
            style: "width: 250px;", defaultFocus: true, oninput: "inputChanged"}

![_enyo.RichText_](../../assets/enyo-rich-text.png)

As with Input and TextArea, the text displayed in a RichText may be accessed at
runtime via `get("value")` and `set("value", <new value>)`.

RichText also has `disabled` and `defaultFocus` properties that function just
like their counterparts in Input and TextArea.

`enyo.RichText` differs from Input and TextArea in having an `allowHtml`
property.  This is `true` by default, enabling HTML-based rich formatting.  Note
that the default setting allows *any* HTML to be inserted into the RichText,
including `<iframe>` and `<script>` tags.  Since this can be a security concern
in some situations, you have the option of setting `allowHtml` to `false`, in
which case any inserted HTML will be escaped.

RichText also differs from Input and TextArea by offering methods for
manipulating the current selection and the cursor position.  The selection
operations and `insertAtCursor()` method use the [HTML Editing
APIs](https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#selections).

In addition, RichText requires explicit sizing for width.

Note that RichText is not supported on Android < 3.

## moon.RichText

[moon.RichText](../../../index.html#/kind/moon.RichText) is a multi-line text
input that supports rich formatting, such as bold, italics, and underlining.  It
is derived directly from `enyo.RichText`.

The content displayed in a RichText may be accessed at runtime via the `value`
property.

        {kind: "moon.InputDecorator", components: [
            {kind: "moon.RichText", oninput: "handleInput", onchange: "handleChange",
                value: "<b>Boldly</b> going where <i>no one</i> has gone before"}
        ]}

![_moon.RichText_](../../assets/rich-text.png)
