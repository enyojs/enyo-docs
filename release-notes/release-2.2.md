# Enyo 2.2 Release Notes

Welcome to Enyo 2.2.  The following items have changes since the Enyo 2.1.1
release. (Note that this list is not comprehensive; see the commit history in
GitHub for a complete list of changes.)

## Enyo

* Added support for building applications for PCs and tablets running Windows 8,
    to be deployed via the Windows Store.  Also improved compatibility with
    Windows Phone 8 (see "Known Issues and Limitations" below).

* Added new `enyo.TransitionScrollStrategy` helper kind, which extends and
    optimizes `enyo.TouchScrollStrategy` for environments in which scrolling
    works best when implemented using CSS transitions.  This currently supports
    iOS 5 and later.  To use this in your own code, in your Scroller or List
    definition, declare the `strategyKind` property as follows:

        strategyKind: (enyo.platform.ios >= 5) ? "TransitionScrollStrategy" : undefined

    This will leave `strategyKind` undefined except on iOS 5+.

    In the future, we expect that `TransitionScrollStrategy` will become the
    default scroll strategy for iOS 5+ devices.

* Added new `enyo.FormData` kind, used to send `multipart/form-data` Ajax
    requests.

* In `Oop.js`, error thrown by `enyo.kind()` now indicates whether the
    problematic kind is undefined or unknown.

* In `lang.js`, added `enyo.isTrue()` method, which returns false if the
    passed-in argument is equal to the string "false", Boolean false, 0, or
    undefined.

* In `Checkbox.js`, added ability to accept strings "true" and "false" as
    values, in addition to Boolean true and false.

* In `boot.js`, fixed issue causing `enyo.machine.script` events not to fire.

* In `loader.js`, added ability to use other path resolvers besides `enyo.path`.
    Also, changed static check for `"http:"` in `getPathPrefix()` to regex test
    that supports mixed-case variants and https, and added associated unit tests.

* In `Ajax.js` and `xhr.js`, added support for disabling `"cache-control"` header
    for services that do not support it.  Also modified accompanying unit tests.

* In `Node.js`, added `"collapsible"` property to complement the existing
    `"expandable"` property.

* In `Control.js`, added check that the control has been generated before calling
    `rendered()` on it.  Also restored old behavior of `getBounds()` and added
    a corresponding unit test.

* In `dispatcher.js`, added code to dispatch a tap event when the spacebar is
    pressed while a button has focus.

* In `dom.css`, added `calcViewportPositionForNode()`, helper function for
    locating nodes within the viewport.  Also fixed issue causing Enyo and Onyx
    buttons to be rendered differently in Firefox as compared to WebKit-based
    browsers.

* In `Ajax.js`, addressed issue causing Ajax requests with a method type of
    `POST` to not send post data when not using the `postBody` parameter.

* In `TouchScrollStrategy.js`, fixed issue causing a Scroller's thumbs to remain
    visible when its `vertical` or `horizontal` property is set to `"hidden"`.

* In `Checkbox.js`, modified dragging behavior to allow drag events to
    propagate, so dragging a checkbox no longer moves the whole viewport.

* In `Input.js`, made change to allow propagation of drag events when the input
    is not focused.

* In `Input.js` and `Select.js`, addressed issue with `onchange` events' not
    firing in IE8.

* In `source/boot/enyo.js`, fixed issue that could cause index overflow when
    loading scripts while running minified version of `enyo.js` on IE.
    
* In `touch.js`, modified mouse handling logic to accommodate mixed touch and
    mouse input on devices having both touchscreen and mouse.

* In multiple files, replaced direct calls to `console` object log functions
    (`log`, `warn`, `error`) with calls to their `enyo` counterparts.

## Onyx

* Added new `onyx.ContextualPopup` and `onyx.IntegerPicker` controls.

* In `MenuItem.js`, added `onItemContentChange` event, fired when the menu
    item's content changes.

* In `Drawer.js`, made change to preserve value of `client.domCssText` through
    page re-rendering.

* In `Item.js`, removed reference to non-existent "guide lines" in API comments.

* In `RangeSlider.js`, improved behavior when sliding one knob past the position
    of the other knob.

* In `FlyweightPicker.js`, fixed issue causing `enyo.Picker` to not set its
    `selected` property at creation time.

* In `Toolbar.less`, fixed issue that could cause a menu inside a toolbar to
    appear cut-off.

* Moved `increment` property from `onyx.RangeSlider` to its superkind,
    `onyx.Slider`.  Also made related changes to `onyx.ProgressBar` and updated
    "SliderSample" app.

* Updated `README.md` with instructions on handling changes to CSS with respect
    to `.less` and `.css` files.

## Layout

* Added support for swipeable and user-reorderable items in Lists.

* Added new `enyo.DockRightArranger` kind.

* In `CollapsingArranger.js`, added `peekWidth` property, as previously seen in
    Enyo 1; also fixed behavior when using hidden panels.

## Globalization/Localization

* In `datetime.js`, fixed issue causing
    `enyo.g11n.DateFmt.prototype.getFirstDayOfWeek()` to always return `undefined`.

* Marked Address-related functionality as "work-in-progress".

## Bootplate

* Modified the Bootplate application code to be of more practical value.

## Samples

* Added samples for reorderable Lists, new `onyx.ContextualPopup` and
    `onyx.IntegerPicker` controls, and new `enyo.DockRightArranger` kind.

* In "PopupSample", added example demonstrating `showPopupAtEvent()` method.

* Fixed styling issues affecting single-page samples when Sampler app is loaded
    from nightly.enyojs.com, as well as styling glitches affecting Onyx widgets.

* In "PanelsFlickrSample", fixed image sizing.

* In "TimePickerSample", changed label to clarify that the time shown is the
    localized time.

## Tools

* In `minify.js`, modified script to not convert external links to relative
    paths when processing url strings; also fixed an issue affecting deployment
    of `.less` files.

## Known Issues and Limitations

### Windows 8

Developers should be aware of the possibility for unexpected behavior related to
Windows 8's lack of support for JSONP and the fact that the Bootplate app must
be in its minified state to run properly on this platform.

### Windows Phone 8

While compatibility with Windows Phone 8 has been improved over previous
Enyo releases, we have encountered some notable (non-Enyo-related) obstacles
while developing for this platform.  Specifically:

* Debugging is difficult.  There is no `console.log()` for Visual Studio Express
    for Windows Phone 8.  To do logging, you must pass console messages from
    your JavaScript to a C# function that then produces output.  In addition, we
    sometimes received unexpected log data for things like objects.

* App caching can be a hindrance.  When you make a code change and redeploy your
    app, you won't always see new results from the app.  In order to see the
    results of our code changes, we have sometimes had to quit and restart
    Visual Studio, create a new project, or reboot a device.  

* The viewport is somewhat odd, in that you can move your app around.  Setting
    specific pixel dimensions for the viewport and setting
    `-ms-touch-action: none;` (which is done in the `enyo-no-touch-action`
    class) seem to aid usability.

### Kindle Fire HD

We have noticed several issues with how swipeable/reorderable lists are handled
by the Web browser on Kindle Fire HD.  Currently, this browser lacks a mode in
which it can be full-screen without reacting to scrolls that cause the URL bar
to be shown or hidden.  As a result, operations that involve dragging often
fail.  This may be addressed by Amazon in a future browser update.
