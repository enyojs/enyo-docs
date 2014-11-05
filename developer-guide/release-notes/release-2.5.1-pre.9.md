% Enyo 2.5.1-pre.9 Release Notes

Welcome to the `pre.9` preview release of Enyo 2.5.1.  The items listed below
have changed since the `2.5.1-pre.8` release.  (Note that this list is not
comprehensive; see the commit history in GitHub for a complete list of changes.)

Please note that we are currently transitioning to use JSDoc-style commenting
for all APIs in Enyo and its related libraries.  The final 2.5.1 release will
include an API Reference with more features and better performance than the
previous API Viewer.  In the meantime, we appreciate your patience, as the API
Viewer functionality will be temporarily unavailable.

## Detailed Release Notes

### enyo

* Updated `enyo.Binding` to fix issue in which the source or target of a global
    binding specified as a string (beginning with `^`) would be incorrectly
    resolved.  Also added a related unit test.

* In `enyo.Control`, added `retainNode()` API method.  This is used internally
    to temporarily retain a DOM node after teardown if there is a string of
    touch events emanating from the node.  Although this a public method, you
    probably won't need to call it directly from application code.

    Also, updated `detectTextDirectionality()` to accept an optional string
    parameter.  If present, the passed-in string will be tested to determine
    directionality instead of `this.content`.

* Modified `enyo.DataList` to properly initialize internal `absoluteShowing`
    property at render time.  Also, made change to update selection state
    immediately when models are removed from the underlying collection while the
    list is hidden.

* In `enyo.DataList.delegates.vertical`, updated `controlsPerPage()` and
    `setScrollThreshold()` to call `sizeProp` method on local scope, rather than
    global scope.

* Updated `enyo.Media`, `enyo.Video`, and `enyo.TranslateScrollStrategy` to
    avoid passing shared event object references when firing custom events.

* In `enyo.Repeater`, re-implemented legacy method `setCount()` for
    compatibility with older versions of the framework.

* Updated `enyo.Router` to check its owner for route methods.  Also, updated
    `create()` so that `triggerOnStart` behavior is executed asynchronously,
    rather than immediately on router creation, so that the parent object can
    complete initialization.

### moonstone

* Deprecated `moon.ToggleText`.  Developers should use `moon.ToggleButton` and
    `moon.ToggleItem` instead.

    Meanwhile, in the current implentation of ToggleText, marked the `src` and
    `icon` properties (inherited from `moon.Checkbox`) as private, since they
    are not supported by ToggleText, and suppressed the change handlers for
    these properties.

* Made changes to numerous kinds to standardize and simplify usage of z-plane
    transforms.

* In `moon.Checkbox` and `moon.CheckboxItem`, modified styling to resolve issues
    with sizing and positioning.

* In `moon.CheckboxItem`, added support for setting custom checkmark icons when
    inside a DataGridList.

* Made several updates to `moon.ContextualPopup`:

    + Added check to avoid working with uncreated DOM node.

    + Made optimization to prevent repeated calculation of popup bounds.

    + Added code to set `popupActivated` flag to `false` when Spotlight focus
        leaves the popup.

* In `moon.ContextualPopup` and `moon.ContextualPopupDecorator`, corrected
    spelling of `popupActivated` property.

* In `moon.DataGridList`, `moon.Scroller`, and `moon.ScrollStrategy`, addressed
    issue causing unnatural behavior when moving from DataGridList to paging
    controls.  Related changes were made in the Spotlight library (see below).

* In `moon.Dialog`, added "X" icon, which closes the dialog when pressed.

* In `moon.ExpandableInput`, fixed issue that could result in unexpected
    scroller behavior.

* In `moon.ExpandablePicker`, fixed alignment issues in right-to-left mode.

* Made several changes to `moon.Header`:

    + Added text directionality detection for `placeholder` and `value`
        properties, used by InputHeader.

    + Moved call to `placeholderChanged()` from `rendered()` to `create()` to
        reduce number of DOM updates.

    + Made change to allow components to render before measuring them.

* Updated `moon.Header` and `moon.VideoTransportSlider` to avoid passing shared
    event object references when firing custom events, also updating related
    sample "InputHeaderSample".

* Modified `moon.ListActions` to set `'display'` style in CSS instead of in
    JavaScript, so it can be correctly overridden by the `'showing'` property.

* In `moon.MarqueeItem`, added code to invalidate the marquee distance if the
    alignment changes.

    Also added code to left-align text having no right-to-left characters when a
    right-to-left locale is active.

* In `moon.MarqueeSupport`, fixed issue in which, when moving between
    synchronized marquees, the currently focused marquee will not start.

* Modified `moon.Panel` to avoid condition in which two panels are showing
    during a transition between panels when using the "always viewing" pattern.

* Updated `moon.Panel` and `moon.Panels` to fix functionality of the latter
    kind's `setIndexDirect()` method.

* In `moon.Popup`, addressed issue in which scrim was unexpectedly hidden after
    completing an animation.

* In `moon.ScrollStrategy`, added handler for `onSpotlightFocused` and
    `onSpotlightBlur` events.  In a related change, removed handling of several
    Spotlight events from `moon.Scroller`.  Together, these changes address
    problems with the showing and hiding of scroll bars.

* In `moon.SelectionOverlaySupport`, adjusted margin used in right-to-left mode.

* Modified `moon.Tooltip`, `moon.TooltipDecorator`, and `moon.Icon` to address
    Tooltip positioning issues.

* Updated `moon.VideoInfoBackground` to address channel banner positioning
    issues with inline video player in right-to-left mode.

* In `moon.VideoPlayer`, added check that `progressStatus` control has a DOM
    node before calling `applyStatus()` on it.  This resolves an issue in which
    video playback would quit due to out-of-memory errors.

* Modified CSS/LESS files, moving `'font-weight'`, `'font-style'`, and
    `'letter-spacing'` properties out of individual text classes and into base
    `.moon` class.

* Updated "ActivityPanelsSample" to include `enyo-ilib` library.

* In "ContextualPopupSample", made initial position of "Direction" button match
    the default position, to avoid unexpected repositioning.  Also, modified
    styling so that buttons in the "Direction" popup fit when in a non-Latin
    locale.

* Modified "DialogSample" so that dialog is not dismissed when user clicks
    outside the dialog while `spotlightModal` is `true`.

* In "ScrollerVerticalSample", fixed misaligned label next to SimplePicker.

* In "TooltipSample", removed positioning styles from two IconButtons.

### layout

* Made several updates to `enyo.List`:

    + Fixed reordering of list items.

    + Modified the kind to use new `Control.retainNode()` method.

    + Updated code to avoid passing shared event object references when firing
        custom events, also updating related samples "ListAroundSample",
        "ListContactsSample", and "ListLanguagesSample".

### spotlight

* Modified `enyo.Spotlight` to address issue causing unnatural behavior when
    focus moves from DataGridList to paging controls.

* In `enyo.Spotlight.NearestNeighbor`, fixed issue with determining nearest
    neighbor when leaving a container.

### onyx

_No updates._

### enyo-ilib

_No updates._

### enyo-webos

_No updates._

### bootplate-moonstone

* Bumped versions of submodules.
