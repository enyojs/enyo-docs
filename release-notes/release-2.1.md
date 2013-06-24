# Enyo 2.1 Release Notes

Welcome to Enyo 2.1.  The following items have changes since the Enyo 2.0.1
release. (Note that this list is not comprehensive; see the commit history in
GitHub for a complete list of changes.)

## Enyo

* Made numerous changes to Enyo core for compatibility with Google Chrome
    Packaged Apps.
* In `Control.js`, made fix restoring the ability to add components directly to
    an `enyo.Scroller` by calling its `createComponent` method.
* In `Button.js`, fixed issue that could cause disabled buttons to receive (and
    respond to) certain events.
* In `Scroller.js`, fixed issue that could cause scrolling to not work in Chrome
    and Firefox browsers on Android.
* In `animation.js`, added workaround for issue causing animations to not work
    properly on iOS 6.  Also moved `animation.js` from `kernel` package to `dom`
    package.
* In `gesture.js`, made changes to improve drag event handling on open webOS
    platform.
* In `touch.js`, made changes to fix behavior of tap events in environments
    where mouse and touch inputs co-exist (e.g., Windows 7 devices with
    touchscreen).  Also worked around issue in which Android Chrome could
    erroneously register single-taps as double-taps.
* In `Ajax.js`, added CORS handling for IE8 and IE9; also improved timeout
    support by canceling XHR after timeout fires.
* In `jsonp.js`, removed unnecessary call to `removeScriptElement()`.
* In `xhr.js`, fixed issue that could cause sync requests to fail in IE8.
* In `loader.js`, fixed error when loading from a package directory whose name
    ends in `"js"` or `"css"`.

## Onyx

* Overhauled Onyx's handling of CSS, adding support for dynamic stylesheets
    (via LESS).
* Added new `DatePicker` and `TimePicker` controls, both of which support
    localization.  Also added `RangeSlider` and `ToggleIconButton`.
* In `Drawer.js`, added `"animated"` property, used to temporarily disable
    animation when changing drawer status.
* In `Menu.js`, fixed issue that could cause menus to be cut off on the
    left-hand side, along with an issue that could cause menus to be positioned
    off-screen.
* In `ToggleButton.js`, fixed issue causing `onChange` event to fire on app
    startup without any user interaction.
* In `onyx.css`, fixed style controlling toggle button appearance in IE8.

## Layout

* Added new `AroundList` control, a list that may have content around its rows.
    Also added new `ImageView` and `ImageCarousel` kinds.
* In `List.js` and `FlyweightRepeater.js`, added new `noSelect` property.  When
    set to `true`, list items are not automatically re-rendered when tapped.
* In `Panels.js`, fixed issue preventing deletion of panels when wrapping is
    enabled.  Also addressed positioning issues when transitioning from
    two-panel state to one-panel state, along with potential layout problems
    related to browser scroll events.
* In `List.css`, fixed issue with `"enyo-list-port"` style, which was causing
    display problems in Firefox.

## Globalization/Localization

* Added new `g11n` library for globalization/localization.

## Bootplate

* Fixed issue that could cause Bootplate-based apps to open in "IE7 document
    mode" in IE9.
* In `deploy` script, added ability to specify the directory that files are
    deployed to.

## Samples

* Added samples for new `g11n` library and new controls.  Also added
    "GestureSample" and "PlatformSample".
* In "Sampler" app, fixed issue causing odd scroll bar behavior in Chrome.
* In "ListContactsSample", fixed issues surrounding deletion of list items.
* In "ListPulldownSample", fixed problem causing "Pull down to refresh..." text
    to not appear in Android Chrome browser.
* In "FlyweightRepeaterSample", made changes to improve layout on phone-sized
    screens.
* In "PanelsFlickrSample", added check to avoid re-loading images that have
    already been loaded; this could cause problems on iOS 6.
* In "PickerSample", corrected visual alignment issues.
* In "TreeSample", fixed overlapping text in Android Chrome browser.

## Tools

* Fixed issue causing API Viewer to not load properly in IE9.
* Fixed various API Viewer glitches caused by inconsistent application of
    `"public"` and `"protected"` tags across the framework.
* In `minify.js`, implemented more robust parsing of options with `nopt` npm
    package; also shimmed the `path.relative` function for old versions of Node.

## Documentation

* Added documentation for UI Theming.
* Added documentation for new `g11n` library.
* In Panels document, added information on which arrangers support wrapping.
* Added warning to avoid renaming `package.js` files.
