% Enyo 2.5.1-pre.7 Release Notes

Welcome to the `pre.7` preview release of Enyo 2.5.1.  The items listed below
have changed since the `2.5.1-pre.6` release.  (Note that this list is not
comprehensive; see the commit history in GitHub for a complete list of changes.)

Please note that we are currently transitioning to use JSDoc-style commenting
for all APIs in Enyo and its related libraries.  The final 2.5.1 release will
include an API Reference with more features and better performance than the
previous API Viewer.  In the meantime, we appreciate your patience, as the API
Viewer functionality will be temporarily unavailable.

## Detailed Release Notes

### enyo

* In `enyo.DataList`, modified `childForIndex()` to check that `generated` flag
    is `true` before calling `this.delegate.childForIndex()`.

* In `enyo.Group`, updated `activeChanged()` to check that component has not
    already been destroyed before executing destruction logic. 

* Modified `enyo.Image` to allow the `src` property to be cleared while the
    `sizing` property is in use.

* In `enyo.OwnerProxy`, corrected superkind to `enyo.Control` (instead of
    `enyo.Component`).

* In `enyo.Popup`, added code to properly tear down rendered floating popups,
    removing the node from the floating layer.

* In `enyo.SpriteAnimation`, fixed issues with `offsetTop` and `offsetLeft`
    properties, and with background sizing.

* Performed general code cleanup throughout Enyo core.

### moonstone

* Added `moon.ProgressButton`, an animated button displaying the progress of an
    associated process.  Also added related sample, "ProgressButtonSample".

* Added `moon.ExpandableDataPicker`, a subkind of `moon.ExpandablePicker` with
    support for handling dynamic data via the Enyo data layer.  Also added
    related sample, "ExpandableDataPickerSample".

* Updated `moon.Button` to make disabled buttons receive mouse events, so that
    tooltips and marquees may be displayed on hover.  Also, added visual styling
    to differentiate selected/focused state from pressed state.

* Modified `moon.Checkbox` so that, at render time, the checkbox's DOM node is
    updated to reflect the value of the control's `checked` property. 

* In `moon.CheckboxItem`, added `handleTapEvent` flag.  When the checkbox item
    is used as a base kind in a DataList (or subkind of DataList), the flag
    should be set to `true` to allow selection support to be synchronized with
    the item's checked state.  (Default is `false`.)

* Updated `moon.Clock` to match the webOS system clock in design and
    functionality.

* In `moon.DateTimePickerBase`, updated `refresh()` to check that `this.value`
    is non-null before using it to create an `ilib.Date` instance.

* In `moon.Drawers`, fixed issue that could result in simultaneous focus on
    handle and text in "dresser" area.  Also fixed issue causing corrupted icon
    to appear in handle.

* Modified `moon.Icon` so that the `icon` property supports HTML entity
    references in addition to Moonstone icon names.

* In `moon.IconButton`, added distinct visual styling for state in which button
    is both selected and focused.

* In `moon.IntegerPicker`, specified `direction: ltr` in CSS to ensure that
    minus sign appears to the left of the integer value when in right-to-left
    mode.

* In `moon.ListActions`, adjusted z-position of drawer so it won't be covered by
    a `moon.Scroller` that it should float over.

* In `moon.Slider`, updated `animatorComplete()` to pass `sender` parameter when
    calling `doAnimateFinish()`.  This fixes an issue in which using a 5-way
    controller to change the slider value would cause an undefined (not a
    number) value to be displayed.

    Also, addressed issue that could result in appearance of 1-pixel gap around
    slider when used in VideoPlayer.

* In `moon.Spinner`, added new properties `center` and `middle`, which provide
    an easy way to center the spinner within its containing control.  To center
    horizontally, set `center: true`; to center vertically, set `middle: true`.

* Modified `moon.Tooltip` so the direction of the tooltip is updated, if
    necessary, when the position of the tooltip decorator changes.

* Removed redundant font assignments in non-Latin CSS classes.

* Modified `package.js` to ensure that `moon.IntegerPicker` is loaded before
    `moon.SimpleIntegerPicker`.

* Updated Moonstone samples so that paths to image assets are specified relative
    to `$lib/moonstone/samples` instead of current directory.

* In "CalendarSample", fixed unexpected behavior when Set Date button is
    clicked.

* Fixed spacing issues in "HeaderSample".

* Modified "ListActionsSample" to allow 5-way navigation to rightmost item in
    list action menu when right-to-left mode is active.

### layout

_No updates._

### spotlight

* In `enyo.Spotlight`, modified `this.freeze()` to give a warning (instead of
    throwing an exception) when it is not possible to enter frozen mode because
    nothing is currently spotted.

* In `enyo.Spotlight.NearestNeighbor`, fixed issue causing focus problems in
    ListActions controls.  Also, adjusted precedence calculation to include all
    elements in the half plane.

### onyx

_No updates._

### enyo-ilib

* Updated `iLib` to version `20140825-build-7.0-003`.

### enyo-webos

_No updates._

### bootplate-moonstone

* Bumped versions of submodules.
