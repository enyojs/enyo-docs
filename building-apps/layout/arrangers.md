# Arrangers

[enyo.Arranger](http://enyojs.com/api/#enyo.Arranger) is an
[enyo.Layout](http://enyojs.com/api/#enyo.Layout) that considers one of its
controls to be active.  The other controls are placed relative to the active one
as makes sense for the layout.

Arranger supports dynamic layouts, meaning it's possible to transition between
its layouts via animation. Typically, arrangers should lay out controls using
CSS transforms, since these are optimized for animation. To support this, the
controls in an Arranger are absolutely positioned, and the Arranger kind has an
`accelerated` property, which marks controls for CSS compositing. The default
setting of `"auto"` ensures that this will occur if enabled by the platform.

Subkinds of Arranger (e.g.,
[CardArranger](http://enyojs.com/api/#enyo.CardArranger),
[CarouselArranger](http://enyojs.com/api/#enyo.CarouselArranger)) are
typically used as layouts for instances of
[enyo.Panels](http://enyojs.com/api/#enyo.Panels), which uses the Arranger API
to implement transitions between layouts.  Implement the `size()` method to size
controls and perform other expensive layout operations that are only required
when the layout reflows.  Implement the `start()` and `finish()` methods to
specify behavior that should occur when a transition begins and ends.  The
`start()` method can set the `transitionPoints` array on the layout container.
`transitionPoints` contains the arrangements between which the layout should
transition.

Implement the `arrange()` method to position controls relative to each other.
This method is where the real layout work occurs.  An arranger only needs to
specify the layout for each active position; it does not have to concern itself
with intermediate layouts.  Instead of directly applying styling to controls in
the `arrange()` method, do this by calling `arrangeControl(inControl, inArrangement)`.
The `inArrangement` argument is an object with settings that are later applied
to the control via the `flowControl(inControl, inArrangement)` method.  By
default, the `flowControl()` method will process arrangement settings	for
`left`, `top`, and `opacity`, and this method should only be implemented to
style the control in other ways.

Arranger also supports dragging between active states.  The arranger must specify
how dragging will affect the layout.  The properties `dragProp`, `canDragProp`,
and `dragDirectionProp` are used to indicate which direction of drag is
relevant. The `calcArrangementDifference(inI0, inA0, inI1, inA1)` method should
be implemented to return the difference in pixels between the arrangement `inA0`
for layout setting `inI0` and arrangement `inA1` for layout	setting `inI1`.
This data is used to calculate the percentage that a drag should move the layout
between two active states.