% Enyo 2.5.1-pre.4 Release Notes

Welcome to the `pre.4` preview release of Enyo 2.5.1.  The items listed below
have changed since the 2.5.0 release.  (Note that this list is not comprehensive;
see the commit history in GitHub for a complete list of changes.)

Please note that we are currently transitioning to use JSDoc-style commenting
for all APIs in Enyo and its related libraries.  This is a complicated process
involving changes to JavaScript files across the entire framework.

The final 2.5.1 release will include an API Reference with more features and
better performance than the previous API Viewer.  In the meantime, we appreciate
your patience, as the API Viewer functionality will be temporarily unavailable.  

In addition, please be aware that the CSS for many Moonstone controls has been
refactored and optimized.  If your application contains CSS overrides, there may
be cosmetic issues that need to be addressed.

## Detailed Release Notes

### enyo

* Moved scrim kind into Enyo core as `enyo.Scrim`; also moved scrim-handling
    logic into `enyo.Popup`.

* Added implementation of abstract filter kind, `enyo.ProgressiveFilter`.

* In `enyo.Async`, modified `accumulate()` to correctly handle input from Luna
    send.

* In `Binding.js`, corrected variable name in `ready()`.

* Updated `enyo.Binding`, `enyo.ObserverChain`, and `enyo.ObserverChainNode` to
    address issue causing bindings to report false-positive for ready-state and
    to auto-synchronize inappropriately.

* Updated `enyo.Component` and `enyo.UiComponent` to improve event bubbling by
    caching the bubble target.

* In `enyo.Control`, fixed issue in which calling `setShowing(false)` after
    `setShowing(null)` would make a control visible.

* Modified `enyo.DataList` to allow users to specify their own values for
    `controlsPerPage`; also made related changes to the vertical delegate
    `(enyo.DataList.delegates.vertical)`.

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

* In `enyo.JsonpRequest`, updated `bodyArgsFromParams()` to work properly when
    `params` is `null`.

* In `enyo.Model`, updated `set()` to avoid inadvertent combining of changesets.

* In `platform.js`, updated regular expression for detecting `'webos'` platform
    to detect Netcast apps.

* Modified `enyo.ScrollMath` to account for overscroll when setting target x and
    y positions.  As part of fix, added new methods `clampX()` and `clampY()`,
    called from `scrollTo()`.

    Also, updated `scrollTo()` so that `start()` is only called when scroll
    position has actually changed.

* In `enyo.TouchScrollStrategy`, added `inFireEvent` parameter to `stop()`
    method, to suppress redundant `onScrollStop` events when stopping previous
    scroll behavior.

### moonstone

* Modified `moon.Checkbox` and `moon.CheckboxItem`, adding API for changing
    checkmark icon.  Also made related updates to the Checkbox subkinds
    `moon.ToggleItem` and `moon.ToggleSwitch`.

* In `moon.ContextualPopup`, added support for setting preferred direction of
    popup (with respect to activating control); also added related example to
    "ContextualPopupSample".

* In `moon.DataList`, updated `getFirstVisibleChild()`, replacing `for...in`
    loop with incremented `for` loop.

* In `moon.DatePicker`, revised date string format and added `getWeekDay()`,
    used internally to get the day-of-week name when `iLib` is not loaded.

* Made several updates to `moon.Drawers`:

    + Added support for new published properties `icon` and `src`; `icon` may be
        used to specify a font-based icon, while `src` may be used to specify
        the path to a custom icon image file.

    + Modified `closeHandleContainer()` to correct direction of arrow in an open
        dresser.

    + Updated CSS to allow 5-way navigation to and from Drawer handles. 

* Modified `moon.ExpandableInput` so that only one such control may be opened at
    a time.

* Updated `moon.HighlightText` and `moon.MarqueeItem` to enable marquee
    functionality in HighlightText controls.  Also, updated
    "HighlightTextSample" to demonstrate the new functionality.

* In `moon.IconButton`, removed `rendered()` method, which was generating
    unnecessary `onActiveChange` events.

* In `moon.ListActions`, added support for `disabled` property, which is bound
    to the `disabled` property on the activating control, and updated
    "ListActionsSample" to demonstrate the new functionality.

    Also, fixed logic error when calling `setActive()` from `openChanged()`.

* In `moon.MarqueeItem`, modified `translateZ` value to prevent components from
    overlapping.

* Updated `moon.MarqueeItem`, `moon.MarqueeSupport`,  and `moon.MarqueeText` to
    address inability to read long text in disabled items.  Now text in a
    disabled item will marquee on hover if `marqueeOnSpotlight` is `true`.
    Added examples of the new behavior to "ItemSample" and "MarqueeSample".

* In `moon.MarqueeSupport`, modified `dispatchEvent()` so that target is cached
    properly.

* In `moon.Panels`, made `transitionStart` event fire before pre-transition work
    is performed.

    Also, modified `finishTransition()` so `transitionInProgress` flag
    is set to `false` before calling `this.inherited()`.  

* In `moon.Popup`, added new API methods `showDirect()`, which opens the popup
    without animation, and `hideDirect()`, which closes the popup without
    animation.

* Updated `moon.ScrollStrategy` and `moon.BodyText` to address "Out of memory"
    error observed in "PopupSample".

* In `moon.SimpleIntegerPicker`, modified `sync()` to fix issue causing
    incorrect initial value to be displayed.

* Modified `moon.Tooltip` and `moon.TooltipDecorator` to fix issue with Tooltip
    positioning when `enyo.Spotlight.getCurrent()` returns `null`.

* Made multiple updates to `moon.VideoPlayer`:

    + Added support for setting multiple sources via new `sources` array, and
        updated related samples to use the new functionality.

    + Added code to capture `onSpotlightFocus` event to constrain Spotlight
        focus to the VideoPlayer in fullscreen mode, and addressed additional
        issues that could prevent the banner and/or player controls from being
        summoned via 5-way keys in fullscreen mode.

    + Fixed issue that could cause video to stop playing after a call to
        `jumpToStart()`.

    + Fixed issue causing video duration to always be reported as `0`.

* Continued work on refactoring and simplifying CSS across the Moonstone library.

* Reworked structure of samples, adding new files `Sample.html` and `Sample.js`
    and eliminating need for nearly 60 files.

* Modified "CalendarSample" and related styling to show correct labels when
    "long" option is selected for "Day of Week Label Length".

* Updated "DataGridListSample" to include example of new group selection
    behavior.

* In "DynamicPanelsSample", replaced `create()` with `rendered()` to avoid
    propagation of `resize` event during initialization.

* In "HeaderSample", added content regarding usage of `type` property.

* In "ListActionsSample", added example of mini-header.

* In "PopupSample", set `autoDismiss: false` on `directPopup` to avoid confusion
    over the popup's behavior.

* In "VideoPlayerSample", fixed overlap between Tooltip and Popup List.

### layout

* Modified "ListHorizontalFlickrSample", "ListPulldownSample", and
    "PanelsFlickrSample" to access Flickr API via `https` instead of `http`.

### spotlight

* In `enyo.Spotlight`, updated `this.onKeyUp()` to address issue causing broken
    dismiss-on-enter behavior in text input controls.  Also updated
    `_setCurrent()` to properly sync `_oCurrent` property with current spotted
    control.

* Updated `enyo.Spotlight.Container` to start intercepting events for Spotlight
    containers at component creation time.  Also, modified `_handleEvent()` to
    set `cachePoint` flag on sender.

### onyx

* Removed `onyx.Scrim` and modified `onyx.Popup` to rely on scrim-handling code
    that's now inherited from `enyo.Popup`.

### enyo-ilib

_No changes._

### enyo-webos

* In `enyo.LunaService`, added `timeout` property, for passing to outbound
    service requests.

### bootplate-moonstone

* Bumped versions of submodules.
