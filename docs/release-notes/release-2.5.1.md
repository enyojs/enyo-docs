% Enyo 2.5.1 Release Notes

Welcome to Enyo 2.5.1.  The items listed below have changed since the 2.5.0
release.  (Note that this list is not comprehensive; see the commit history in
GitHub for a complete list of changes.)

Please note that, for the 2.5.1 release, we have transitioned to using
JSDoc-style commenting for all APIs in Enyo and its related libraries.
Furthermore, we have leveraged the new commenting scheme to create a new API
Reference, which we are pleased to make available with this release.  While we
are confident that the new API viewer represents a significant upgrade over the
old one, we will continue to add functionality and improve performance over the
next several release cycles.

## Detailed Release Notes

### enyo

* Added new kind `enyo.MediaSource`, which serves as the `defaultKind` of
    `enyo.Video`.

* Moved scrim kind into Enyo core as `enyo.Scrim`; also moved scrim-handling
    logic into `enyo.Popup`.

* Added implementation of abstract filter kind, `enyo.ProgressiveFilter`.

* In `enyo.Async`, modified `accumulate()` to correctly handle input from Luna
    send.

* Updated `enyo.Binding` to fix issue in which the source or target of a global
    binding specified as a string (beginning with `^`) would be incorrectly
    resolved.  Also added a related unit test.

* Updated `enyo.Binding`, `enyo.ObserverChain`, and `enyo.ObserverChainNode` to
    address issue causing bindings to report false-positive for ready-state and
    to auto-synchronize inappropriately.

* In `enyo.bindings`, corrected variable name in `ready()`.

* In `enyo.Collection`, updated `empty()` to send proper notifications when
    `length` property changes.

* In `enyo.Component`, modified `dispatchEvent()` to correct issue with
    delegated function handling. Also, fixed issue in which having a named event
    delegate with the same name as an auto-generated event bubbler would result
    in unexpected event payload contents.

* Updated `enyo.Component` and `enyo.UiComponent` to improve event bubbling by
    caching the bubble target.

* In `enyo.Control`, made several updates:

    + Added `retainNode()` API method.  This is used internally to temporarily
        retain a DOM node after teardown if there is a string of touch events
        emanating from the node.  Although this a public method, you probably
        won't need to call it directly from application code.

    + Updated `detectTextDirectionality()` to accept an optional string
        parameter.  If present, the passed-in string will be tested to determine
        directionality instead of `this.content`.

    + Modified regular in expression in `applyStyle()` so that all instances of
        a property are removed when removing properties before a DOM node is
        attached.

    + Fixed issue in which calling `setShowing(false)` after `setShowing(null)`
        would make a control visible.

* In `enyo.Control` and `gesture.js`, added support for double-tap events, which
    may be enabled at the control level or at the framework level. While the use
    of double-taps is not a preferred UX pattern, there are some specific use
    cases in which the functionality is needed.

    Also added double-tap example to "GestureSample".

* Made several changes to `enyo.DataList`:

    + Made the `controlsPerPage` property configurable by the user, also making
        related changes to the vertical delegate
        `(enyo.DataList.delegates.vertical)`.

    + The internal `absoluteShowing` properly is now properly initialized at
        render time.

    + Selection state is now updated immediately when models are removed from
        the underlying collection while the list is hidden.

    + Modified `childForIndex()` to check that `generated` flag is `true` before
        calling `this.delegate.childForIndex()`.

* In `enyo.DataRepeater`, added support for group selection via new
    `groupSelection` flag.  If set to `true`, only one child may be selected at
    a time, and once a selection is made, it may not be deselected via
    user input.  (It may still be deselected by calling the selection API
    methods.)

* In `dom.js`, modified `addBodyClass()` to check whether `enyo.roots` is a
    zero-length array before assuming that rendering has occurred.  This fixes
    an issue in which right-to-left styling was not being properly applied.

* In `gesture.js`, modified `touchstart()` and `touchend()` to fix uncaught
    TypeError on mobile devices.

* In `enyo.Group`, added support for new `onActiveChanged` event, which fires
    when the active control in the group is changed.

* Modified `enyo.Image` to allow the `src` property to be cleared while the
    `sizing` property is in use.

* In `enyo.JsonpRequest`, updated `bodyArgsFromParams()` to work properly when
    `params` is `null`.

* Updated `enyo.Media` and `enyo.Video` to mix in playback-related properties
    with the bubbled `onratechange` event.

* Updated `enyo.Media`, `enyo.Video`, and `enyo.TranslateScrollStrategy` to
    avoid passing shared event object references when firing custom events.

* In `MixinSupport.js`, restored ability for mixins to apply other mixins.

* In `enyo.Model`, updated `set()` to avoid inadvertent combining of changesets.

* In `enyo.OwnerProxy`, corrected superkind to `enyo.Control` (instead of
    `enyo.Component`).

* In `platform.js`, updated regular expression for detecting `'webos'` platform
    to detect Netcast apps.

* In `enyo.Popup`, added code to properly tear down rendered floating popups,
    removing the node from the floating layer. Also, modified kind so that
    centered floating popups are centered with respect to the full viewport
    instead of the popup instance owner.

* In `enyo.Repeater`, re-implemented legacy method `setCount()` for
    compatibility with older versions of the framework.

* In `enyo.RichText`, addressed issue that could cause content to overflow the
    control's bounds if the RichText is explicitly sized.

* Updated `enyo.Router` to check its owner for route methods.  Also, updated
    `create()` so that `triggerOnStart` behavior is executed asynchronously,
    rather than immediately on router creation, so that the parent object can
    complete initialization.

* Modified `enyo.Scroller` to use TranslateScrollStrategy for Android 4.3 and
    higher.

* Made several updates to `enyo.ScrollMath`:

    + Updated `scrollTo()` so that `start()` is only called when scroll position
        has actually changed.  Also updated `scrollTo()` so that passed-in
        coordinates are checked against current coordinates before `endX` and
        `endY` are set, not after.  This fixes jerky movement seen on first scroll.

    + Made update to prevent final animation step correction if currently
        overscrolling.

* In `enyo.SpriteAnimation`, added new `start()`, `stop()`, and `pause()`
    API methods, along with new `paused` and `stopAtEnd` properties.  Also,
    fixed issues with `offsetTop` and `offsetLeft` properties, and with
    background sizing.

* In `touch.js`, fixed issue in which, in a multitouch environment, simultaneous
    touches by two different fingers would be interpreted as a drag gesture.

* In `enyo.TouchScrollStrategy`, added `inFireEvent` parameter to `stop()`
    method, to suppress redundant `onScrollStop` events when stopping previous
    scroll behavior.

* In `VerticalDelegate.js`, modified `refresh()` to fix routine for updating
    page indices.  Also, updated `controlsPerPage()` and `setScrollThreshold()`
    to call `sizeProp` method on local scope, rather than global scope.

* In `enyo.Video`, added support for setting video sources via the `components`
    block.  Also, modified `updateSource()` so that child components added via
    the `components` block are not removed at object creation time.

* Performed general code cleanup throughout Enyo core.

* In `dom.css`, removed CSS rule causing Chrome to display highlighted text as
    transparent.

* Updated build scripts `deploy.js` and `minify.js` to support non-standard
    locations for the Enyo framework core and libraries.

### moonstone

* Added `moon.ProgressButton`, an animated button displaying the progress of an
    associated process.  Also added related sample, "ProgressButtonSample".

* Added `moon.ExpandableDataPicker`, a subkind of `moon.ExpandablePicker` with
    support for handling dynamic data via the Enyo data layer.  Also added
    related sample, "ExpandableDataPickerSample".

* Made changes to numerous kinds to standardize and simplify usage of z-plane
    transforms.

* Deprecated `moon.ToggleText`.  Developers should use `moon.ToggleButton` and
    `moon.ToggleItem` instead.

    Meanwhile, in the current implentation of ToggleText, marked the `src` and
    `icon` properties (inherited from `moon.Checkbox`) as private, since they
    are not supported by ToggleText, and suppressed the change handlers for
    these properties.

* Made several updates to `moon.Button`:

    * Made disabled buttons receive mouse events, so that tooltips and marquees
        may be displayed on hover.

    * Added visual styling to differentiate selected/focused state from pressed
        state.

    * Reordered CSS to give `spotlight` rule precedence over `active`.

    * Corrected color of disabled state.

* In `moon.Calendar`, added code to specify `'locale'` value when creating
    `ilib.Date` objects to determine the names of the days of the week.  This
    fixes an issue causing the wrong day of the week to be displayed.  Also
    made related updates to "CalendarSample".

    In addition, improved bounds checking for year picker.

* Added support for Persian calendar to calendar and date pickers (in
    `moon.Calendar` and `moon.DatePicker`, respectively). As part of this work,
    added new `moon.SimpleMonthPicker` kind, used to handle month selection in
    `moon.Calendar`.  Also added Persian calendar example to "CalendarSample".

* Modified `moon.Checkbox` so that, at render time, the checkbox's DOM node is
    updated to reflect the value of the control's `checked` property.

* Modified `moon.Checkbox` and `moon.CheckboxItem`, adding API for changing
    checkmark icon.  Also made related updates to the Checkbox subkinds
    `moon.ToggleItem` and `moon.ToggleSwitch`.

* Updated styling in `moon.Checkbox` and `moon.CheckboxItem` to resolve issues
    with sizing and positioning.

* In `moon.CheckboxItem`, made various updates:

    + Added `handleTapEvent` flag.  When the checkbox item is used as a base
        kind in a DataList (or subkind of DataList), the flag should be set to
        `true` to allow selection support to be synchronized with the item's
        checked state.  (Default is `false`.)

    + Added support for setting custom checkmark icons when inside a
        DataGridList.

    + Modified `rendered()` to call `srcChanged()` and `iconChanged()` on
        initial render when `src` and `icon` are set to empty string.

* Updated `moon.Clock` to match the webOS system clock in design and
    functionality.  Also, added fallback code to handle time formatting when
    `enyo-ilib` is unavailable.

* Made several updates to `moon.ContextualPopup`:

    + Added support for setting preferred direction of popup (with respect to
        activating control), also adding related example to
        "ContextualPopupSample".

    + Added check to avoid working with uncreated DOM node.

    + Made optimization to prevent repeated calculation of popup bounds.

    + Added code to set `popupActivated` flag to `false` when Spotlight focus
        leaves the popup.

* In `moon.ContextualPopup` and `moon.ContextualPopupDecorator`, corrected
    spelling of `popupActivated` property.

* In `moon.DataList`, updated `getFirstVisibleChild()`, replacing `for...in`
    loop with incremented `for` loop.

    Also, addressed issue in which, when new records are added while focus is on
    the last row of the last page of the list, the new records cannot be reached
    via 5-way down keypress.

* In `moon.DataGridList`, `moon.Scroller`, and `moon.ScrollStrategy`, addressed
    issue causing unnatural behavior when moving from DataGridList to paging
    controls.  Related changes were made in the Spotlight library.

* In `moon.DataRepeater`, broke out code from `modelsRemoved()` into new
    `deselectRemovedModels()` method.  This allows the subkind `moon.DataList`
    to execute the logic for deselecting removed models without also making an
    unnecessary call to `refresh()`.

* Made multiple updates to `moon.DatePicker`:

    + Revised date string format and added `getWeekDay()`, used internally to
        get the day-of-week name when `iLib` is not loaded.

    + Updated (and simplified) logic related to calculation of maximum number of
        days in a given month.

    + Fixed issues causing improper handling of locale changes.

    + Corrected picker behavior for locales using non-Gregorian calendars.

* Updated `moon.DateTimePickerBase` to display day-of-week in date picker, to
    match design spec. Also, updated `refresh()` to check that `this.value`
    is non-null before using it to create an `ilib.Date` instance.

* In `moon.Dialog`, added "X" icon, which closes the dialog when pressed.

* Updated `moon.Divider` to handle capitalization of strings in JavaScript, not
    CSS, to match behavior of other Moonstone controls.

* In `moon.Drawers`, added call to `this.updateActivator()` to `create()`.

* Made several updates to `moon.Drawers`:

    + Added support for new published properties `icon` and `src`; `icon` may be
        used to specify a font-based icon, while `src` may be used to specify
        the path to a custom icon image file.

    + Modified `closeHandleContainer()` to correct direction of arrow in an open
        dresser.

    + Updated CSS to allow 5-way navigation to and from Drawer handles.

    + Fixed issue that could result in simultaneous focus on handle and text in
        "dresser" area.  Also fixed issue causing corrupted icon to appear in
        handle.

* Modified `moon.ExpandableInput` so that only one such control may be opened at
    a time.  Also, removed unnecessary `freeze()/unfreeze()` routine and fixed
    an issue that could result in unexpected scroller behavior.

* In `moon.ExpandablePicker`, addressed multiple issues:

    + Removed calls to `silence()` and `unsilence()` from `selectedChanged()`,
        as they could interfere with the proper functioning of
        `setSelectedIndex()`.

    + Fixed alignment issues in right-to-left mode.

    + Made modification so that tapping the CheckboxItem results in the same
        behavior as calling `setSelectedIndex()` directly.

* Made several changes to `moon.Header`:

    + Added support for displaying subtitle when using small version of header.

    + Added text directionality detection for `placeholder` and `value`
        properties, used by InputHeader.

    + Moved call to `placeholderChanged()` from `rendered()` to `create()` to
        reduce number of DOM updates.

    + Made change to allow components to render before measuring them.

* Modified `moon.Header` and `moon.Panel` to address issues with small header.

* Updated `moon.Header` and `moon.VideoTransportSlider` to avoid passing shared
    event object references when firing custom events, also updating related
    sample, "InputHeaderSample".

* In `moon.HighlightText`, fixed incorrect highlighting behavior after a content
    change when HighlightText is used in conjunction with Marquee.  Also, added
    related example to "HighlightTextSample".

* Updated `moon.HighlightText` and `moon.MarqueeItem` to enable marquee
    functionality in HighlightText controls.  Also, updated
    "HighlightTextSample" to demonstrate the new functionality.

* Modified `moon.Icon` so that the `icon` property supports HTML entity
    references in addition to Moonstone icon names.

* Made several updates to `moon.IconButton`:

    + Addressed redundant firing of `onActivate` events.

    + Added distinct visual styling for state in which button is both selected
        and focused.

    + Corrected positioning of image assets inside of spotted elements.

* Updated `moon.Input` so that "focused" styling is not applied in response to
    Enter keypress.  Also, modified `onKeyUp()` to not call `unspot()` if we are
    not currently in pointer mode, as this could result in unexpected loss of
    focus.

* In `moon.IntegerPicker`, addressed issue that could IntegerPicker objects to
    become misaligned with each other.  Also, specified `direction: ltr` in CSS
    to ensure that minus sign appears to the left of the integer value when in
    right-to-left mode.

* Refactored `moon.IntegerPicker` and `moon.SimpleIntegerPicker` to use
    FlyweightRepeater to avoid unnecessary rendering.  Also, renamed the `'list'`
    CSS class used by these two kinds as `'moon-scroll-picker-repeater'` to
    avoid potential class name collisions.

* Updated `moon.IntegerPicker` to validate incoming values for `step` property,
    and to fix formatting of negative values.

* Made several changes to `moon.ListActions`:

    + Added support for `disabled` property, which is bound to the `disabled`
        property on the activating control, and updated "ListActionsSample" to
        demonstrate the new functionality.

    + Added ability to differentiate between events coming from an open/close
        state change and those from a post-rendering routine
        (i.e., `rendered()`).  In the former case, Spotlight should be invoked
        to spot the next control, but in the latter case, it should not be.

    + ListActions now sets `'display'` style in CSS instead of JavaScript, so it
        can be correctly overridden by the `'showing'` property.

    + Fixed logic error when calling `setActive()` from `openChanged()`.

* In `moon.MarqueeItem`, added code to invalidate the marquee distance if the
    alignment changes.

    Also added code to left-align text having no right-to-left characters when a
    right-to-left locale is active.

* Updated `moon.MarqueeItem`, `moon.MarqueeSupport`,  and `moon.MarqueeText` to
    address inability to read long text in disabled items.  Now text in a
    disabled item will marquee on hover if `marqueeOnSpotlight` is `true`.
    Added examples of the new behavior to "ItemSample" and "MarqueeSample".

* In `moon.MarqueeSupport`, fixed issue in which, when moving between
    synchronized marquees, the currently focused marquee will not start.  Also,
    modified `dispatchEvent()` so that target is cached properly.

* Modified `moon.MarqueeSupport` and `moon.MarqueeItem` to apply the full
    animation definition as a style.  This fixes an issue that could result in
    non-linear Marquee speed.

* In `moon.MeridiemPicker`, enabled wrapping of picker values.

* In `moon.PagingControl`, decreased value of `maxDelta` to avoid display of
    blank page when rapidly scrolling downward through a DataList.

* In `moon.Panel`, fixed issue in which, in a two-panel scenario, a left arrow
    keypress will not change the panel index to the previous index if the second
    panel has no spottable components.  Also, modified `moon.Panel` to avoid
    condition in which two panels are showing during a transition between panels
    when using the "always viewing" pattern.

* Updated `moon.Panel` and `moon.Panels` to fix functionality of the latter
    kind's `setIndexDirect()` method.


* Made a number of changes to `moon.Panels`:

    + Added optional third parameter to `pushPanels()`.  This accepts an
        `options` object, which may be used to specify an index to switch to
        after the panels have been added.  Another option allows you to skip the
        transition and jump directly to the target panel.

    + Made change to allow panel handle to be spottable when "always viewing"
        pattern is in use.

    + Made `transitionStart` event fire before pre-transition work is performed.

    + Modified `finishTransition()` so `transitionInProgress` flag is set to
        `false` before calling `this.inherited()`.

    + In code for hiding panels, added check for existence of current spotted
        control before attempting to call a method on it.

* Made several updates to `moon.Popup`:

    + Added new API methods `showDirect()`, which opens the popup without
        animation, and `hideDirect()`, which closes the popup without animation.

    + Fixed issue causing scrim to be unexpectedly hidden after completing an
        animation.

    + Fixed issue causing popups to become unfocusable when above an active
        scroller.

    + Also, addressed issue that could cause popup to close unexpectedly in
        response to directional arrow keypress.

    + Fixed incorrect font size.

* Modified `moon.ProgressBar`, `moon.Slider`, `moon.SimplePicker`, and
    `moon.SimpleIntegerPicker` to behave the same in right-to-left mode as in
    left-to-right mode.

* Modified `moon.RichText` to use superkind's blur handler.

* Made various changes to `moon.ScrollStrategy:

    + Added handler for `onSpotlightFocused` and `onSpotlightBlur` events.  In a
        related change, removed handling of several Spotlight events from
        `moon.Scroller`.  Together, these changes address problems with the
        showing and hiding of scroll bars.

    + Fixed issue that could result in dual focus on paging controls.

    + Changed `requestSetupBounds()` to base conditional statement on value of
        `this.generated` instead of `this.hasNode()`, since the latter will
        never be `true`.

* Updated `moon.ScrollStrategy` and `moon.BodyText` to address "Out of memory"
    error observed in "PopupSample".

* In `moon.SelectableItem`, added `handleTapEvent` flag.  If SelectableItem is
    used as the base control within a `moon.DataRepeater`, the flag should be
    set to `false` to give the DataRepeater exclusive access to handle tap
    events and selection state.  (Default is `true`.)

* In `moon.SelectionOverlaySupport`, adjusted margin used in right-to-left mode.

* In `moon.SimpleIntegerPicker`, modified `sync()` to fix issue causing
    incorrect initial value to be displayed.

* In `moon.Slider`, updated `animatorComplete()` to pass `sender` parameter when
    calling `doAnimateFinish()`.  This fixes an issue in which using a 5-way
    controller to change the slider value would cause an undefined (not a
    number) value to be displayed.

    Also, addressed issue that could result in appearance of 1-pixel gap around
    slider when used in VideoPlayer.

* In `moon.Spinner`, added new properties `center` and `middle`, which provide
    an easy way to center the spinner within its containing control.  To center
    horizontally, set `center: true`; to center vertically, set `middle: true`.

    Also, added `-webkit` prefix to names of transforms for improved
    compatibility.

* In `moon.TimePicker`, fixed issue that could cause day to change when meridiem
    value is updated.  Also fixed handling of hour value when using 24-hour
    clock.

* Modified `moon.Tooltip` so the direction of the tooltip is updated, if
    necessary, when the position of the tooltip decorator changes.

* Modified `moon.Tooltip` and `moon.TooltipDecorator` to fix issue with Tooltip
    positioning when `enyo.Spotlight.getCurrent()` returns `null`.  Also, fixed
    issue in which tooltip would not hide properly when focus leaves a disabled
    activator

* Modified `moon.Tooltip`, `moon.TooltipDecorator`, and `moon.Icon` to address
    Tooltip positioning issues.

* Updated `moon.VideoInfoBackground` to address channel banner positioning
    issues with inline video player in right-to-left mode.

* Made multiple updates to `moon.VideoPlayer`:

    + Added support for setting multiple sources via new `sources` array, and
        updated related samples to use the new functionality.

    + Added code to capture `onSpotlightFocus` event to constrain Spotlight
        focus to the VideoPlayer in fullscreen mode, and addressed additional
        issues that could prevent the banner and/or player controls from being
        summoned via 5-way keys in fullscreen mode.

    + Added check that `progressStatus` control has a DOM node before calling
        `applyStatus()` on it.  This resolves an issue in which video playback
        would quit due to out-of-memory errors.

    + Fixed issue that could cause video to stop playing after a call to
        `jumpToStart()`.

    + Fixed issue causing video duration to always be reported as `0`.

    + Added padding below inline player.

* In `moon.VideoTransportSlider`, fixed issue causing video duration to be
    displayed as `00:00`.  Also, added missing call to
    `enyo.Spotlight.unfreeze()` to `dragfinish()`.

* Continued to refactor and simplify CSS across the Moonstone library.

* In `CSS/.less` files, converted CSS-style commenting to LESS-style commenting.

* Removed redundant font assignments in non-Latin CSS classes.

* Updated font files to latest versions, while also updating CSS font definitions.

* Moved timing function for marquee text into `.animate-marquee` CSS rule to
    address non-linear scrolling speed.

* Modified `package.js` to ensure that `moon.IntegerPicker` is loaded before
    `moon.SimpleIntegerPicker`.

* Reworked structure of samples, adding new files `Sample.html` and `Sample.js`
    and eliminating need for nearly 60 files.

* Updated Moonstone samples so that paths to image assets are specified relative
    to `$lib/moonstone/samples` instead of current directory.

* In "Sample" (the app for viewing Moonstone samples), fixed code for enabling
    and disabling stylesheets.

* Updated "ActivityPanelsSample" to include `enyo-ilib` library.

* In "ButtonSample", fixed incorrect CSS class name.

* In "CalendarSample", restored "fa-IR" locale.  Also, modified styling to show
    correct labels when "long" option is selected for "Day of Week Label Length".

* In "ContextualPopupSample", made initial position of "Direction" button match
    the default position, to avoid unexpected repositioning.  Also, modified
    styling so that buttons in the "Direction" popup fit when in a non-Latin
    locale.

* In "DataGridListSample", added example of new group selection behavior.  Also,
    applied `'enyo-unselectable'` CSS class to the sample, as the text in the
    sample should not be selectable.

* Modified "DialogSample" so that dialog is not dismissed when user clicks
    outside the dialog while `spotlightModal` is `true`.

* In "DrawerSample", fixed path issue causing image assets to not appear.

* In "DynamicPanelsSample", replaced `create()` with `rendered()` to avoid
    propagation of `resize` event during initialization.

* Modified "ExpandablePickerSample" to include `enyo-ilib`, which had been
    unintentionally omitted.

* In "HeaderSample", added content regarding usage of `type` property.  Also,
    fixed spacing issues.

* In "HighlightTextSample", restored filtering functionality, using
    ProgressiveFilter for implementation.

* In "IntegerPickerSample", addressed issue causing picker width to fluctuate
    when selected value changes.

* Made several changes to "ListActionsSample":

    + Added example of mini-header.

    + Modified sample to allow 5-way navigation to rightmost item in list action
        menu when right-to-left mode is active.

    + Fixed unexpected behavior when Set Date button is clicked.

* In "PopupSample", set `autoDismiss: false` on `directPopup` to avoid confusion
    over the popup's behavior.

* In "ScrollerVerticalSample", fixed misaligned label next to SimplePicker.

* In "SliderSample", added call to `parseInt()` when retrieving input values, to
    avoid problems caused by treating values as strings instead of numbers.

* In "TooltipSample", removed positioning styles from two IconButtons.

* In "VideoPlayerSample", fixed overlap between Tooltip and Popup List.

### layout

* Removed source code and samples associated with abandoned `enyo.FlexLayout`
    kind.

* Made several updates to `enyo.List`:

    + Fixed reordering of list items.

    + Modified the kind to use new `Control.retainNode()` method.

    + Updated code to avoid passing shared event object references when firing
        custom events, also updating related samples "ListAroundSample",
        "ListContactsSample", and "ListLanguagesSample".

* Corrected quotation marks in `deploy.json` (single quotes are illegal in JSON
    files).

* Fixed kind name in "FittableAppLayout1".

* Modified "ListHorizontalFlickrSample", "ListPulldownSample", and
    "PanelsFlickrSample" to access Flickr API via `https` instead of `http`.

* In "SlideableSample", modified `populate()`, replacing `for...in` loop with
    incrementing counter loop to iterate through array.

### spotlight

* Made numerous changes to `enyo.Spotlight`:

    + Updated `this.onKeyUp()` to address issue causing broken dismiss-on-enter
        behavior in text input controls.

    + Updated `_setCurrent()` to properly sync `_oCurrent` property with current
        spotted control.

    + Modified `this.freeze()` to give a warning (instead of throwing an
        exception) when it is not possible to enter frozen mode because nothing
        is currently spotted.

    + Addressed issue that could cause popups to close unexpectedly.

    + Addressed issue causing unnatural behavior when focus moves from
        DataGridList to paging controls.

    + Made change to ignore `keyup` event if `keydown` event for same key was
        ignored.

* Updated `enyo.Spotlight.Container` to start intercepting events for Spotlight
    containers at component creation time.  Also, modified `_handleEvent()` to
    set `cachePoint` flag on sender.

* In `enyo.Spotlight.NearestNeighbor`, made several updates:

    + Fixed issue with determining nearest neighbor when leaving a container.

    + Fixed issue causing focus problems in ListActions controls.

    + Also, adjusted precedence calculation to include all elements in the half
        plane.

### onyx

* Removed `onyx.Scrim` and modified `onyx.Popup` to rely on scrim-handling code
    that's now inherited from `enyo.Popup`.

* In `onyx.RangeSlider`, fixed incorrect method name that was causing
    initialization error.

* Updated several places where the `onyx.TabBarItem` kind was being referenced
    by its old name, `onyx.TabBar.Item`.

* Modified CSS to reflect the fact that Onyx buttons no longer have forced
    line-height.

### enyo-ilib

* Updated `iLib` to version `20140918-build-8.0-002`.

### enyo-webos

* In `enyo.LunaService`, added `timeout` property, for passing to outbound
    service requests.

* In `version.js`, restored double-quotes around version string for
    compatibility with automated build script.

### bootplate-moonstone

* Bumped versions of submodules.
