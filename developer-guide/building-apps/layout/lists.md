% Lists

Most applications need to display a list of items of one kind or another.
Sometimes the items in the list are very simple, like the name of a contact,
while other times they are complex, like a drawer containing prompts and
buttons.

The Enyo framework and Moonstone library offer a robust set of tools for
building lists in your applications.

## Behavior

Before we examine the technical aspects of working with Lists, let's take a
moment to consider how lists behave in Enyo:

* The contents of a List may scroll either vertically or horizontally.

* Lists scroll within a defined area.

* Lists are paginated based on the number of visible items.

* In a typical list, the focus starts (by default) on the topmost item in the
    list.  As you go down the list, the focus moves, but the list content is
    static until the last fully visible item is in focus.  Then the list starts
    to move, with the focus stepping through the list one item per press.

## List Items

Each item in a list may contain a text string, an image, or both.  The Moonstone
library offers kinds that implement these basic types of list items, as well as
some with more advanced features.  For details, see the separate documentation
for [List Items](../controls/list-items.html).

## List Kinds

It's quite a challenge to create a `List` control supporting a large number of
items that can be rendered and scrolled with good performance across the range
of devices that Enyo supports.  For this reason, Enyo has two broad strategies
for dealing with lists of data.  When an application needs a relatively small
number of items (up to ~100) that are relatively complex, an
[enyo/Repeater]($api/#/kind/enyo/Repeater/Repeater) should be used.  When an
application needs a large number of relatively simple items (into the millions),
a [layout/List]($api/#/kind/layout/List/List) should be used.

### enyo/Repeater

[enyo/Repeater]($api/#/kind/enyo/Repeater/Repeater) is a simple control for
making lists of items.  A repeater does just what its name implies--it repeats
the set of controls that are contained within it.  The components of a repeater
are copied for each item created, and are	wrapped	in a control that keeps the
state of the item index.  Any control may be placed inside a repeater, and
applications may interact with these controls normally.

The `count` property specifies the number of times the item controls are
repeated; for each repetition, the `onSetupItem` event is fired.  You may handle
this event to customize the settings for individual rows, e.g.:

```javascript
    var
        Repeater = require('enyo/Repeater'),
        Image = require('enyo/Image');

    ...

    {kind: Repeater, count: 2, onSetupItem: 'setImageSource', components: [
        {kind: Image}
    ]},

    ...

    setImageSource: function (sender, ev) {
        var index = ev.index;
        var item = ev.item;
        item.$.image.setSrc(this.imageSources[index]);
        return true;
    }
```

Be sure to return `true` from your `onSetupItem` handler to prevent other event
handlers further up the tree from trying to modify your item control.

The repeater will always be rebuilt after a call to `setCount()`, even if the
count didn't change.  This behavior differs from that of most properties, for
which no action happens when a set-value call doesn't modify the value.	 This is
done to accommodate potential changes to the data model for the repeater, which
may or may not have the same item count as before.

(**Note:** If the contents of a repeater should scroll, then the repeater should
be placed inside an [enyo/Scroller]($api/#/kind/enyo/Scroller/Scroller).)

### layout/List

[layout/List]($api/#/kind/layout/List/List) is a control that displays a
scrolling list of rows.  It is designed to render a very large number of rows
efficiently, having been optimized such that only a small portion of the list is
rendered at any given time.  This is done using a [flyweight
pattern](http://en.wikipedia.org/wiki/Flyweight_pattern), in which controls
placed inside the list are created once, but rendered for each list item.  For
this reason, it's best to use only simple controls in a List, such as
[enyo/Control]($api/#/kind/enyo/Control/Control) and
[enyo/Image]($api/#/kind/enyo/Image/Image).

(Note that `layout/List` includes a scroller; therefore, it should *not* be placed
inside an `enyo/Scroller`.)

A List's `components` block contains the controls to be used for a single row.
This set of controls will be rendered for each row.	 You may customize the row
rendering by handling the `onSetupItem` event.  For example, given the following
list...

```javascript
    var
        List = require('layout/List');

    ...

    components: [
        {kind: List, fit: true, count: 100, onSetupItem: 'setupItem', components: [
            {classes: 'item', ontap: 'itemTap', components: [
                {name: 'name'},
                {name: 'index', style: 'float: right;'}
            ]}
        ]}
    ]
```

...one might write event handlers like so:

```javascript
    setupItem: function (sender, ev) {
        // given some available data.
        var data = this.data[ev.index];
        // setup the controls for this item.
        this.$.name.set('content', data.name);
        this.$.index.set('content', ev.index);
    },
    itemTap: function (sender, ev) {
        alert('You tapped on row: ' + ev.index);
    }
```

As this example illustrates, the identity of the row from which the event
originated is available to us in the event's `index` property (i.e.,
`ev.index`).

It is possible to alter the contents of a row in a `layout/List`, but in order
to do so effectively, one must understand the implications of the flyweight
pattern used in lists.

## More on Flyweight

Any time a list row is rendered, the `onSetupItem` event is fired.  An
application can therefore control the rendering of the controls in a row by
calling methods on those controls within this event's handler.  An application
can update a specific row by forcing it to render using the list's
`renderRow(inIndex)` method.

In addition, it is possible to create controls with more complex interactions
that are specifically tailored to function correctly in a flyweight context.
Events for controls in a list will be decorated with both the index of the row
being interacted with and the flyweight controller for the control (i.e.,
`ev.index` and `ev.flyweight`).  The list's `prepareRow(inIndex)` method
can be used to assign the list's controls to a specific list row, allowing
persistent interactivity with that row.  When the interaction is complete, the
list's `lockRow()` method should be called.
