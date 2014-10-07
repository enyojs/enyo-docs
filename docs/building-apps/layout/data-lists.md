% Data Lists

In addition to the basic list kinds (List, Repeater, and GridList), Enyo and
Moonstone offer a separate set of data list kinds, which feature built-in
support for data binding.  If you've designed your app to use Enyo's data layer,
you'll find these controls to be both convenient and powerful.

(**Note:** The following discussion assumes familiarity with the concepts
presented in [Building Data-Driven Apps](../managing-data/building-data-driven-apps.html);
if you haven't read that article, it may be worthwhile to do so now.)

## enyo.DataRepeater

[enyo.DataRepeater](../../api.html#enyo.DataRepeater) is an
[enyo.Control](../../api.html#enyo.Control) that iterates over the items in
an [enyo.Collection](../../api.html#enyo.Collection), repeatedly rendering and
synchronizing data records (instances of [enyo.Model](../../api.html#enyo.Model))
with properties on its own child components.

For each record in the collection, a corresponding child control is rendered in
the DataRepeater.  If the appropriate data bindings exist, child controls will
automatically update when properties on the underlying records are modified; if
a record is destroyed, the corresponding child will also be destroyed.

## enyo.DataList

[enyo.DataList](../../api.html#enyo.DataList) is an `enyo.DataRepeater` that
employs a paginated scrolling scheme to enhance performance with larger data
sets.  The data is provided to the DataList by the `enyo.Collection` set as the
value of the DataList's `collection` property.

Be careful when deciding how to lay out the list's children.  When there are a
large number of child elements, the layout process can be taxing for the
browser.  Avoid dynamically-updated layouts that require lots of calculations
each time the data in the view is updated.  Try to use CSS whenever possible.

While paging through data, `enyo.DataList` emits the `paging` event, which you
may handle to make updates on a per-page basis, as necessary.  You may register
for this event by calling `addListener()` and specifying the event, along with a
callback method.

The callback method receives a reference to the `enyo.DataList`, the name of the
event (`paging`), and a hash with the properties `start`, `end`, and `action`,
referring, respectively, to the lowest active index in the data set, the highest
active index, and the action that triggered the paging.  The value of `action`
may be either `"scroll"` or `"reset"`.

## enyo.DataGridList

[enyo.DataGridList](../../api.html#enyo.DataGridList) is a paginated
`enyo.DataList` designed to lay out its children in a grid pattern.  As in the
DataList, the child controls in a DataGridList are directly linked to underlying
records in an `enyo.Collection`.

DataGridList is flexible in its handling of layout, so the spacing of its
children must be set using the kind's available API (e.g., the `spacing`,
`minWidth`, and `minHeight` properties).  Note that a DataGridList will attempt
to grow or shrink the size of its children in order to keep them evenly spaced.

## moon.DataList and moon.DataGridList

Moonstone offers its own variants of DataList and DataGridList--namely,
[moon.DataList](../../api.html#moon.DataList) and
[moon.DataGridList](../../api.html#moon.DataGridList).  Aside from the addition
of Moonstone visual styling and support for focus management using Spotlight,
these Moonstone kinds are essentially the same as the Enyo kinds they are
derived from.

For an example of how `moon.DataGridList` may be used in an application, see the
[Moonstone App Tutorial](../../getting-started/moonstone-app-tutorial.html).
