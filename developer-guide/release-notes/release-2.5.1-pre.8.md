% Enyo 2.5.1-pre.8 Release Notes

Welcome to the `pre.8` preview release of Enyo 2.5.1.  The items listed below
have changed since the `2.5.1-pre.7` release.  (Note that this list is not
comprehensive; see the commit history in GitHub for a complete list of changes.)

Please note that we are currently transitioning to use JSDoc-style commenting
for all APIs in Enyo and its related libraries.  The final 2.5.1 release will
include an API Reference with more features and better performance than the
previous API Viewer.  In the meantime, we appreciate your patience, as the API
Viewer functionality will be temporarily unavailable.

## Detailed Release Notes

### enyo

* In `enyo.Component`, fixed issue in which having a named event delegate with
    the same name as an auto-generated event bubbler would result in unexpected
    event payload contents.

* Modified `enyo.Popup` so that centered floating popups are centered with
    respect to the full viewport instead of the popup instance owner.

* In `enyo.SpriteAnimation`, added new `start()`, `stop()`, and `pause()`
    API methods, along with new `paused` and `stopAtEnd` properties.

* Updated build scripts `deploy.js` and `minify.js` to support non-standard
    locations for the Enyo framework core and libraries.

### moonstone

* In `moon.Button`, reordered CSS to give `spotlight` rule precedence over
    `active`.  Also, corrected color of disabled state.

* In `moon.Calendar`, improved bounds checking for year picker.

* In `moon.CheckboxItem`, modified `rendered()` to call `srcChanged()` and
    `iconChanged()` on initial render when `src` and `icon` are set to empty
    string.

* In `moon.Clock`, added fallback code to handle time formatting when `enyo-ilib`
    is unavailable.

* In `moon.DatePicker`, fixed issues causing improper handling of locale
    changes.  Also, corrected picker behavior for locales using non-Gregorian
    calendars.

* Updated `moon.DateTimePickerBase` to display day-of-week in date picker, to
    match design spec.

* Updated `moon.Divider` to handle capitalization of strings in JavaScript, not
    CSS, to match behavior of other Moonstone controls.

* In `moon.Drawers`, added call to `this.updateActivator()` to `create()`.

* In `moon.ExpandablePicker`, removed calls to `silence()` and `unsilence()`
    from `selectedChanged()`, as they could interfere with the proper
    functioning of `setSelectedIndex()`.

    Also, made modification so that tapping the CheckboxItem results in the same
    behavior as calling `setSelectedIndex()` directly.
    
* Modified `moon.Header` and `moon.Panel` to address issues with small header.

* In `moon.IconButton`, corrected positioning of image assets inside of spotted
    elements.

* In `moon.Input`, modified `onKeyUp()` to not call `unspot()` if we are not
    currently in pointer mode, as this could result in unexpected loss of focus.

* Addressed issue that could cause `moon.IntegerPicker` objects to become
    misaligned with each other.

* Modified `moon.ListActions` to add ability to differentiate between events
    coming from an open/close state change and those from a post-rendering
    routine (i.e., `rendered()`).  In the former case, Spotlight should be
    invoked to spot the next control, but in the latter case, it should not be.

* Modified `moon.MarqueeSupport` and `moon.MarqueeItem` to apply the full
    animation definition as a style.  This fixes an issue that could result in
    non-linear Marquee speed.

* Made several updates to `moon.Panels`:

    + Added optional third parameter to `pushPanels()`.  This accepts an
        `options` object, which may be used to specify an index to switch to
        after the panels have been added.  Another option allows you to skip the
        transition and jump directly to the target panel.

    + Made change to allow panel handle to be spottable when "always viewing"
        pattern is in use.

    + In code for hiding panels, added check for existence of current spotted
        control before attempting to call a method on it.

* In `moon.Popup`, fixed issue causing popups to become unfocusable when above
    an active scroller.  Also, addressed issue that could cause popup to close
    unexpectedly in response to directional arrow keypress.

* Modified `moon.RichText` to use superkind's blur handler.

* In `moon.ScrollStrategy`, changed `requestSetupBounds()` to base conditional
    statement on value of `this.generated` instead of `this.hasNode()`, since
    the latter will never be `true`.  Also, fixed issue that could result in
    dual focus on paging controls.

* In `moon.SelectableItem`, added `handleTapEvent` flag.  If SelectableItem is
    used as the base control within a `moon.DataRepeater`, the flag should be
    set to `false` to give the DataRepeater exclusive access to handle tap
    events and selection state.  (Default is `true`.)

* In `moon.Spinner`, added `-webkit` prefix to names of transforms.  This fixes
    issues with centering the Spinner within its container.

* In `moon.TimePicker`, fixed issue that could cause day to change when meridiem
    value is updated.  Also fixed handling of hour value when using 24-hour
    clock.

* Modified `moon.Tooltip` and `moon.TooltipDecorator` to fix issue in which
    tooltip would not hide properly when focus leaves a disabled activator.

* In `moon.VideoTransportSlider`, added missing call to `enyo.Spotlight.unfreeze()`
    to `dragfinish()`.

* In `CSS/.less` files, converted CSS-style commenting to LESS-style commenting.

* Updated font files to latest versions, while also updating CSS font definitions.

* In "Sample" (the app for viewing Moonstone samples), fixed code for enabling
    and disabling stylesheets.

* In "ButtonSample", fixed incorrect CSS class name.

* In "CalendarSample", restored "fa-IR" locale.

* Applied `'enyo-unselectable'` CSS class to "DataGridListSample", as the text
    in the sample should not be selectable.

* Modified "ExpandablePickerSample" to include `enyo-ilib`, which had been
    unintentionally omitted.

* In "HighlightTextSample", restored filtering functionality, using
    ProgressiveFilter for implementation.

* In "IntegerPickerSample", addressed issue causing picker width to fluctuate
    when selected value changes.

* In "SliderSample", added call to `parseInt()` when retrieving input values, to
    avoid problems caused by treating values as strings instead of numbers.

### layout

* In `moon.List`, fixed missing quotes in `hideReorderingRow()`.

* Corrected quotation marks in `deploy.json` (single quotes are illegal in JSON
    files).

* Fixed kind name in "FittableAppLayout1".

### spotlight

* In `enyo.Spotlight`, addressed issue that could cause popups to close
    unexpectedly.  Also, made change to ignore `keyup` event if `keydown` event
    for same key was ignored.

### onyx

* Modified CSS in light of the fact that Onyx buttons no longer have forced
    line-height.

### enyo-ilib

* Updated `iLib` to version `20140918-build-8.0-002`.

### enyo-webos

_No updates._

### bootplate-moonstone

* Bumped versions of submodules.
