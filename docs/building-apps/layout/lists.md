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
[enyo.Repeater](../../api.html#enyo.Repeater) should be used.  When an
application needs a large number of relatively simple items (into the millions),
an [enyo.List](../../api.html#enyo.List) should be used.

### enyo.Repeater

[enyo.Repeater](../../api.html#enyo.Repeater) is a simple control for
making lists of items.  A repeater does just what its name implies--it repeats
the set of controls that are contained within it.  The components of a repeater
are copied for each item created, and are	wrapped	in a control that keeps the
state of the item index.  Any control may be placed inside a repeater, and
applications may interact with these controls normally.

The `count` property specifies the number of times the item controls are
repeated; for each repetition, the `onSetupItem` event is fired.  You may handle
this event to customize the settings for individual rows, e.g.:

        {kind: "Repeater", count: 2, onSetupItem: "setImageSource", components: [
            {kind: "Image"}
        ]},

        ...

        setImageSource: function(inSender, inEvent) {
            var index = inEvent.index;
            var item = inEvent.item;
            item.$.image.setSrc(this.imageSources[index]);
            return true;
        }

Be sure to return `true` from your `onSetupItem` handler to prevent other event
handlers further up the tree from trying to modify your item control.

The repeater will always be rebuilt after a call to `setCount`, even if the
count didn't change.  This behavior differs from that of most properties, for
which no action happens when a set-value call doesn't modify the value.	 This is
done to accommodate potential changes to the data model for the repeater, which
may or may not have the same item count as before.

(**Note:** If the contents of a repeater should scroll, then the repeater should
be placed inside an [enyo.Scroller](../../api.html#enyo.Scroller).)

### enyo.List

[enyo.List](../../api.html#enyo.List) is a control that displays a scrolling
list of rows.  It is designed to render a very large number of rows efficiently,
having been optimized such that only a small portion of the list is rendered at
any given time.  This is done using a [flyweight
pattern](http://en.wikipedia.org/wiki/Flyweight_pattern), in which controls
placed inside the list are created once, but rendered for each list item.  For
this reason, it's best to use only simple controls in a List, such as
[enyo.Control](../../api.html#enyo.Control) and
[enyo.Image](../../api.html#enyo.Image).

(Note that `enyo.List` includes a scroller; therefore, it should *not* be placed
inside an `enyo.Scroller`.)

A List's `components` block contains the controls to be used for a single row.
This set of controls will be rendered for each row.	 You may customize the row
rendering by handling the `onSetupItem` event.  For example, given the following
list...

        components: [
            {kind: "List", fit: true, count: 100, onSetupItem: "setupItem", components: [
                {classes: "item", ontap: "itemTap", components: [
                    {name: "name"},
                    {name: "index", style: "float: right;"}
                ]}
            ]}
        ]

...one might write event handlers like so:

        setupItem: function(inSender, inEvent) {
            // given some available data.
            var data = this.data[inEvent.index];
            // setup the controls for this item.
            this.$.name.setContent(data.name);
            this.$.index.setContent(inEvent.index);
        },
        itemTap: function(inSender, inEvent) {
            alert("You tapped on row: " + inEvent.index);
        }

As this example illustrates, the identity of the row from which the event
originated is available to us in the event's `index` property (i.e.,
`inEvent.index`).

It is possible to alter the contents of a row in an `enyo.List`, but in order to
do so effectively, one must understand the implications of the flyweight pattern
used in lists.

### moon.List

[moon.List](../../api.html#moon.List) inherits from `enyo.List`, adding support
for 5-way focus (Spotlight) and pagination buttons.

Currently, `moon.List` requires a value of `"TouchScrollStrategy"` (or a
subkind of `"TouchScrollStrategy"`) for the `strategyKind` property.

## enyo.GridList

[enyo.GridList](../../api.html#enyo.GridList) extends `enyo.List`,
providing a grid in which you may display multiple items per row (depending on
the available container width). Three rendering modes are supported:
"fixed-size", "fluid-width", and "variable-size" (with or without normalization
of rows).

In `fixedSize` mode--i.e., when `itemFixedSize` is set to `true`--all items are
of the same size, which may be configured by setting the `itemWidth` and
`itemHeight` properties at creation time.

In `fluidWidth` mode--when `itemFluidWidth` is set to `true`--all items are of
the same size, but that size may grow or shrink to fit the available container
width, while respecting the minimum value specified in `itemMinWidth`.

When `itemWidth` and `itemHeight` are not known at creation time, you may set
`normalizeRows` to `true` and handle the `sizeupItem` event to set each item's
dimensions at runtime.

## moon.GridList

[moon.GridList](../../api.html#moon.GridList) extends `enyo.GridList`, adding
Moonstone-specific configuration, styling, decorators, and Spotlight/focus-state
management.

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
`event.index` and `event.flyweight`).  The list's `prepareRow(inIndex)` method
can be used to assign the list's controls to a specific list row, allowing
persistent interactivity with that row.  When the interaction is complete, the
list's `lockRow()` method should be called.
