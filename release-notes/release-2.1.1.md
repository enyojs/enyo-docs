% Enyo 2.1.1 Release Notes

Welcome to Enyo 2.1.1.  The following items have changes since the Enyo 2.1
release.  (Note that this list is not comprehensive; see the commit history in
GitHub for a complete list of changes.)

## Enyo

* In `msevents.js`, rewrote event handling for IE10 to exclusively use new
    `MSPointer` events.

* In `platform.js` and `touch.js`, added detection for Silk browser to fix
    compatibility issues with Kindle Fire HD.

* In `platform.js`, added `blackberry` property, referring to major version
    number of BlackBerry OS; in `Control.js` and `Scroller.js`, made change to
    use JavaScript scroller instead of `-webkit-overflow-scrolling:touch` on
    BlackBerry platform.

* In `Button.js`, explicitly set the `enyo.Button` type to `"button"`, since the
    default type (`"submit"`) could cause unintentional form submission.

* Addressed multiple issues relating to `Ajax.js`:

    * Added `xhrResponse` property to preserve status, header, and body data in
        case the request fails and is canceled.

    * Fixed issue causing bad `"Content-Type"` header to be sent when the
        request body is a FormData object.

    * Fixed issue that could cause parameters passed to `go()` to not be added
        to the query string.

    * Fixed new CORS problems in IE.

## Onyx

* Modified `DatePicker.js` and `TimePicker.js` to use `"en_us"` as default
    locale if `g11n` library isn't loaded.

* In `PickerButton.js`, added check for undefined content before call to
    `setContent`.

* Added `"onyx-menu-label"` CSS class for `onyx.Menu` objects.

* Removed focused inner-border style for `onyx.Button` objects in Firefox on
    Windows.

## Layout

* Added new `ImageViewPin` control, which may be used to display non-zoomable
    content ("pins") inside a zoomable `ImageView` control.

* In `Arranger.js`, added workaround for click target issues when using CSS
    transforms to position panels in IE10.

* In `Panels.js`, added code to skip `removeComponent` transition logic when a
    Panels object is destroyed, to prevent transition events from being sent to
    the application.

## Samples

* Fixed "GestureSample" to properly handle being relaunched.

## Tools

* Added new file `deploy.js`, a Node-based cross-platform app deployment script
    that supersedes the existing `deploy.sh` and `deploy.bat`.  The latter two
    scripts continue to be available, although they are now simply wrappers for
    `deploy.js`.  Updated Bootplate template to use `deploy.js`, while moving
    `deploy.sh` and `deploy.bat` to `bootplate/tools` directory.  

    Note: The `tools/deploy.sh` and `tools/deploy.bat` scripts must now be run
    from the root of the bootplate project (prior to 2.1.1 they were run from
    within the `tools` folder).

## Documentation

* Fixed display issues with API documentation for `enyo.ImageView`.