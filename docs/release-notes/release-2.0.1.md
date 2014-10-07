% Enyo 2.0.1 Release Notes

Welcome to Enyo 2.0.1.  The following items have changes since the Enyo 2.0
release.  (Note that this list is not comprehensive; see the commit history in
GitHub for a complete list of changes.)

## Enyo

* Added `enyo.load()` API for loading files/packages at runtime.
* Added `enyo.singleton()` API, which implements a singleton design pattern.
* In `enyo.Ajax`, fixed issue causing failures when accessing file URLs via
    query string on Android.  Also added optional `mimeType` property, which
    allows the MIME-Type of the XHR to be overridden.
* In `enyo.Async`, made `timeout` a published property and added documentation
    for it.
* In `enyo.OwnerProxy`, fixed issue affecting event bubbling for nested event
    handlers in a Repeater.
* In `enyo.Popup`, added down event tracking to fix oddities in window dismissal
    behavior.  Also added a listener for `dragstart` event to hide the popup if
    `autoDismiss` is true and the drag is outside the popup or its children.
* In `enyo.Scrim`, added basic documentation.
* In `enyo.UiComponent`, when adding a child component, you can now specify the
    position within the components list where it will be added.
* Moved DOM measurement code from `enyo.FittableLayout` into `enyo.dom` to
    facilitate reuse.
* In `enyo.gesture`, added code to improve behavior in IE8.
* In `enyo.platform`, added `chrome` and `androidChrome` properties, referring
    to major version number of desktop Chrome browser and Android Chrome
    browser, respectively.
* In 'enyo.kind', fixed error checking to detect errors using undefined kinds, and
    added error checking to detect not using `new` to call generated constructors.
* Added a workaround for tap detection problems in the current Chrome for Android.  The bug
    caused controls to be misidentified.

## Onyx

* Fixed issue causing `onyx.Button` controls to not be styled correctly when
    contained within an `onyx.Toolbar`.
* In `onyx.Drawer`, fixed issue causing nested drawers to not open fully.
* In `onyx.Icon`, added a disabled state (with associated styling); modified
    `onyx.IconButton` to work properly with it.
* In `onyx.InputDecorator`, added `alwaysLooksFocused` property.
* In `onyx.Menu`, added automatic scrolling when menu contains more items than
    can be displayed on screen at one time.  Also fixed an issue that could
    cause menus to be cut off on the left side.
* In `onyx.MoreToolbar`, added `clientLayoutKind` property, which specifies
    layout scheme for client components.  (Default is `"FittableColumnsLayout"`.)
    Also added temporary fix for issues with the "more" button (i.e., the
    ellipsized popup).
* Changed picker kinds (`onyx.Picker`, `onyx.FlyweightPicker`,
    `onyx.PickerButton`, `onyx.PickerDecorator`) to communicate via `onChange`
    events instead of `onSelect` events.
* In `onyx.ToggleButton`, fixed issue causing multiple `onChange` events to be
    fired while dragging the toggle to change the value.
* In `onyx.css`, added `"onyx-dark"` class for buttons.  Also added styles to
    make progress animations Opera-compatible, and a style for ToggleButton
    opacity in IE8.

## Layout

* In `enyo.Arranger`, made sure that `reflow()` is called to set up bounds data
    structures before the arranger is accessed.
* In `enyo.FlyweightRepeater`, added `clientClasses` and `clientStyle`
    properties to enable styling of wrapper component.
* In `enyo.LeftRightArranger`, replaced use of opacity with support for z-index
    management.
* In `enyo.Panels`, made `isScreenNarrow()` method public; also corrected name
    of property changed method for `narrowFit` property.

## Bootplate

* Added quotes around paths so that paths containing whitespace won't break
    deployment.

## Samples

* Added ability to inspect each sample in the console.
* Removed deprecated samples.
* Added `Slideable` sample to Sampler app.
* Added workaround for tap recognition issues with Sampler app in Chrome mobile
    browser.
* Fixed issue causing improper formatting of Sampler app source code when viewed
    in IE8.
* Fixed possible infinite loop in `GridArranger`, which could cause
    "ArrangerSample" to freeze.
* In "CanvasBallsSample", disabled propagation of drag events for the Input
    control where the number of balls is set.
* In "CheckboxSample", fixed code for initializing checkbox state.
* In "InputSample", added an `onChange` event handler to update the result field.
* In "ListPulldownSample", removed ability to search on empty string.
* In "ProgressSample", added examples of colored `ProgressBar` and `Slider`
    controls.
* In "ScrollerSample", disabled panel dragging.

## Tools

* Updated API Viewer to show published properties as top-level items in kinds.
* Added build/version information to API Viewer.
* Fixed issue with minifier script's adding space when concatenating URLs.

## Documentation

* Throughout the framework, added documentation for numerous events, published
    properties, and public methods that had not been previously documented.
