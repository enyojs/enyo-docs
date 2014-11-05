% Enyo 2.5.1-pre.6 Release Notes

Welcome to the `pre.6` preview release of Enyo 2.5.1.  The items listed below
have changed since the `2.5.1-pre.5` release.  (Note that this list is not
comprehensive; see the commit history in GitHub for a complete list of changes.)

Please note that we are currently transitioning to use JSDoc-style commenting
for all APIs in Enyo and its related libraries.  The final 2.5.1 release will
include an API Reference with more features and better performance than the
previous API Viewer.  In the meantime, we appreciate your patience, as the API
Viewer functionality will be temporarily unavailable.

## Detailed Release Notes

### enyo

* Added new kind `enyo.MediaSource`, which serves as the `defaultKind` of
    `enyo.Video`.

* In `enyo.Component`, modified `dispatchEvent()` to correct issue with
    delegated function handling.

* In `enyo.Control` and `gesture.js`, added support for double-tap events, which
    may be enabled at the control level or at the framework level. While the use
    of double-taps is not a preferred UX pattern, there are some specific use
    cases in which the functionality is needed.
    
    Also added double-tap example to "GestureSample".

* Modified `enyo.Scroller` to use TranslateScrollStrategy for Android 4.3 and
    higher.

* In `enyo.ScrollMath`, modified `scrollTo()` so that passed-in coordinates are
    checked against current coordinates before `endX` and `endY` are set, not
    after.  This fixes jerky movement seen on first scroll.

    Also made update to prevent final animation step correction if
    currently overscrolling, and removed ineffective clamping methods.

* In `VerticalDelegate.js`, modified `refresh()` to fix routine for updating
    page indices.

* In `enyo.Video`, added support for setting video sources via the `components`
    block.  Also, modified `updateSource()` so that child components added via
    the `components` block are not removed at object creation time.

### moonstone

* In `moon.Calendar`, added code to specify `'locale'` value when creating
    `ilib.Date` objects to determine the names of the days of the week.  This
    fixes an issue causing the wrong day of the week to be displayed.

    Also made related updates to "CalendarSample".

* In `moon.DataList`, addressed issue in which, when new records are added while
    focus is on the last row of the last page of the list, the new records
    cannot be reached via 5-way down keypress.

* In `moon.DataRepeater`, broke out code from `modelsRemoved()` into new
    `deselectRemovedModels()` method.  This allows the subkind `moon.DataList`
    to execute the logic for deselecting removed models without also making an
    unnecessary call to `refresh()`.

* In `moon.DatePicker`, updated (and simplified) logic related to calculation of
    maximum number of days in a given month.

* In `moon.ExpandableInput`, removed unnecessary `freeze()/unfreeze()` routine.

* In `moon.Header`, added support for displaying subtitle when using small
    version of header.

* In `moon.HighlightText`, fixed incorrect highlighting behavior after a content
    change when HighlightText is used in conjunction with Marquee.  Also, added
    related example to "HighlightTextSample".

* Modified `moon.IconButton` to address redundant firing of `onActivate` events.

* Updated `moon.Input` so that "focused" styling is not applied in response to
    Enter keypress.

* Refactored `moon.IntegerPicker` and `moon.SimpleIntegerPicker` to use
    FlyweightRepeater to avoid unnecessary rendering.  Also, renamed the `'list'`
    CSS class used by these two kinds as `'moon-scroll-picker-repeater'` to
    avoid potential class name collisions.

* Updated `moon.IntegerPicker` to validate incoming values for `step` property,
    and to fix formatting of negative values.

* In `moon.MarqueeItem`, set `translateZ` to `'-0.1px'` to address issue with
    random blurring.

* In `moon.MeridiemPicker`, enabled wrapping of picker values.

* In `moon.PagingControl`, decreased value of `maxDelta` to avoid display of
    blank page when rapidly scrolling downward through a DataList.

* In `moon.Panel`, fixed issue in which, in a two-panel scenario, a left arrow
    keypress will not change the panel index to the previous index if the second
    panel has no spottable components.

* In `moon.Popup`, fixed incorrect font size.

* In `moon.Tooltip`, improved logic for positioning tooltip with respect to
    disabled activating control, and made related updates to "TooltipSample".
    Also, adjusted CSS to address issue with marquee text displaying on top of
    tooltip.

* Updated `moon.VideoPlayer` to set `sources` property to `null` when video is
    unloaded.

* Moved timing function for marquee text into `.animate-marquee` CSS rule to
    address non-linear scrolling speed.

* In "DrawerSample", fixed path issue causing image assets to not appear.

### layout

* Removed source code and samples associated with abandoned `enyo.FlexLayout`
    kind.

* In "SlideableSample", modified `populate()`, replacing `for...in` loop with
    incrementing counter loop to iterate through array.

### spotlight

_No changes._

### onyx

* Updated several places where the `onyx.TabBarItem` kind was being referenced
    by its old name, `onyx.TabBar.Item`.

### enyo-ilib

_No changes._

### enyo-webos

* In `version.js`, restored double-quotes around version string for
    compatibility with automated build script.

### bootplate-moonstone

* Bumped versions of submodules.
