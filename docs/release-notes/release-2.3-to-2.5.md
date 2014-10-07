% Enyo 2.3.0-rc.24 to 2.5.0 Release Notes

Welcome to Enyo 2.5.0!  The items listed below have changed since the
2.3.0-rc.24 release.  (Note that this list is not comprehensive; see the commit
history in GitHub for a complete list of changes.)

## Migration Notes

Some of the changes made in Enyo 2.5.0 may require updates to your existing Enyo
applications.  Please read the Enyo 2.3.0-rc.24 to 2.5.0 Migration Notes
([English](migration-2.3-to-2.5.html) | [Korean](migration-2.3-to-2.5-ko.html))
for a detailed discussion of these issues.

## Performance Notes

Enyo 2.5.0 contains numerous changes designed to improve the performance of your
applications.  For a detailed list, please see the Enyo 2.3.0-rc.24 to 2.5.0
Performance Notes ([English](performance-2.3-to-2.5.html) |
[Korean](performance-2.3-to-2.5-ko.html)).

## UX Notes

Enyo 2.5.0 also features a number of user experience enhancements, described in
the Enyo 2.3.0-rc.24 to 2.5.0 UX Notes ([English](ux-2.3-to-2.5.html) |
[Korean](ux-2.3-to-2.5-ko.html)).

## Detailed Release Notes

### enyo

* Reworked data layer code, adding support for relational data objects.
    Significant changes were made to existing kinds such as `enyo.Control`,
    `enyo.Binding`, `enyo.Source`, and `enyo.Store`, and existing mixins such as
    `enyo.BindingSupport`, `enyo.ComputedSupport`, and `enyo.ObserverSupport`.

    New data-related kinds include `enyo.Filter`, `enyo.BucketFilter`,
    `enyo.ProgressiveFilter` (coming soon), `enyo.LinkedList`,
    `enyo.ObserverChain`, `enyo.ModelList`, `enyo.AjaxSource`, and
    `enyo.JsonpSource`; new mixins include `enyo.EventEmitter` and
    `enyo.ProxyObject`.

    In addition, several stubbed kinds have received proper implementations,
    including `enyo.RelationalModel` and `enyo.LocalStorageSource`.

    Finally, `enyo.RegisteredEventSupport` is now an alias to the
    `enyo.EventEmitter` mixin.

* Enyo now provides support for the W3C Page Visibility API in the new file
    `page_visibility.js`, under the `dom` package.  This normalizes
    `visibilitychange` events, as well as the `document.hidden` and
    `document.visibilityState` properties.  Fallbacks are used to support older
    browsers.

* Began transition to Mocha-based unit testing.

* Added `enyo.SpriteAnimation` kind, which enables the creation of simple
    animated sprite images.  Also added related sample, "SpriteAnimationSample".

* Added `enyo.Style` kind, used to dynamically generate `<style>` tags.

* Added `enyo.StylesheetSupport` mixin, used to add an auxiliary, inline
    stylesheet (containing programmatically-generated CSS) to a control.  Also
    added related sample, "StylesheetSupportSample".

* Added `enyo.HTMLStringDelegate`, a status object used by `enyo.Control` for
    rendering.

* In `enyo.Ajax`, added support for synchronous loading of binary files.

* In `enyo.AjaxSource`, updated `commit()` to set default `contentType` as
    `"application/json"`.

* In `enyo.Animator`, updated `next()` to fire `onEnd` event when animation has
    finished.

* In `enyo.Binding`, added `force` parameter to `sync()` method.

* Made several changes to `enyo.Collection`:

    + `enyo.Collection` is once again a subkind of `enyo.Component`.

    + The `filtered`, `filters`, `filterProps`, and `activeFilter` properties
        have been removed, and the `filter()` method no longer can be used to
        clear the active filter.  The whole filtering mechnanism is being
        rewritten for greater flexibility and improved performance.

* In `enyo.Component`, added `triggerHandler()` method, a public API for
    triggering the handler for a particular type of event.  Also modified
    `toString()` to return `id` as well as `kindName`.

* Made several changes to `enyo.Control`:

    + Updated `applyStyle()` to prevent invalid values from being propagated to
        the `style` property.

    + In `Control.normalizeCssStyleString()`, modified regular expression to
        fix issue with extra spaces in paths in `style` attribute.

    + Added code to properly clear the `style` tag when appropriate.

    + Fixed issue in rendering code causing picker to be dismissed when choosing
        a locale in "DatePickerSample".

    + Added call to `enyo.dom.updateScaleFactor()` in `renderInto()`.

* In `enyo.DataList`, updated `create()` to synchronize the values of `showing`
    and `absoluteShowing`.  Also modified `modelsRemoved()` so that `sup` call
    is only made if `this.$.scroller.canGenerate` is `true`.

* Made several updates to `enyo.DataRepeater`:

    + `controller` is no longer a special property; this affects DataRepeater,
        DataList, DataGridList, UiComponent (and its child kinds), and
        Application.  DataRepeater, DataList, and DataGridList should use the
        `collection` property instead.  For all other kinds, there is no direct
        replacement for the previous functionality.  Instead, use a binding from
        the path to the desired local property.

    + The `length` property is no longer bound.  Developers are advised to check
        for the existence of the `collection` property, and then check the
        length of the collection (if it exists).  This change affects DataList
        and DataGridList as well as DataRepeater.

    + Fixed issue causing DataRepeater not to render in response to collection
        changes.

    + Modified `batchingChanged()`, adding call to `this.refresh()`.

* In `enyo.dom`, added method `enyo.dom.getAbsoluteBounds()`, which takes into
    account translateX, translateY, and matrix3d transforms.  The existing
    `enyo.Control.getAbsoluteBounds()` API is unchanged, but its implementation
    now utilizes the new method on `enyo.dom`.

    Also, added properties `_bodyScaleFactorX` and `_bodyScaleFactorY`,
    which represent the ratio of the `<body>` tag's size to the window size
    along the x and y axes.  This value is updated via
    `enyo.dom.updateScaleFactor()` on page load and window resize.

* In `enyo.gesture`, introduced `configureHoldPulse()` method, used in `down()`
    to configure subsequent `holdpulse` events.  `configureHoldPulse()` accepts
    a hash of options that may include values for `"delay"`, `"moveTolerance"`,
    `"endHold"`, and `"resume"`.  Default values are defined in
    `enyo.gesture.drag.holdPulseDefaultConfig`.

    Also, updated `makeEvent()`, adding code to update mouse/pointer
    coordinate values (`clientX` and `clientY`) if body is being scaled.

* In `hooks.js`, modfied `enyo.updateLocale()` so that it is the emitter of the
    `onLocaleChange` event.

* Made several changes to `enyo.Image`:

    + Added published properties `sizing` and `position`, along with change
        handler methods.  When `sizing` is set, the image is rendered as a
        `<div>` with `background-image`.  Valid values are `"cover"` and
        `"constrain"`.  When `sizing` is used, `position` determines the
        positioning of the image within its bounds (default is `"center"`).

    + Added `srcChanged()`, handler method for changes to `src` property.

    + Fixed issue in which some browsers could not read placeholder image data.

* In `enyo.Image` and `enyo.Video()`, updated `create()` method, adding call to
    `this.srcChanged()`.

* In `lang.js`, modified `enyo.asyncMethod()` to accept an anonymous function as
    the lone parameter.  The previous signature is still valid, as well.

* In `loader.js`, updated `decodePackagePath()` to properly handle URLs that
    begin with `//`.

* In `log.js`, added `validateArgs()` to prevent (or gracefully handle) circular
    reference errors when stringifying objects.

* Made several updates to `enyo.Model`:

    + `enyo.Model` now employs the default `enyo.ObserverSupport` and
        `enyo.BindingSupport`; as a result, it shares the limitation of working
        only with the `attributes` of a data record.

    + Added support for `force` parameter in `set()` method.  Setting the value
        to `true` forces change notifications to fire, even if the new value is
        the same as the old one.

    + Made changes to improve Model initialization time.

    + Fixed issue in which calling `destroy()` on previously fetched models
        would destroy the models locally, but not in the remote data source. 

* In `ObserverSupport.js`, modified `enyo.concatHandler()` so that component
    overrides don't wipe out observers of the base kind.

* In `enyo.Option`, added `selected` property, a Boolean value indicating
    whether the option is currently selected.  (Default is `false`.)

* In `enyo.platform`, updated platform detection for Silk 3.x.

* Made several updates to `enyo.Popup`:

    + Added `enyo.Popup.concat()`, which may be used to specify events to be
        captured (in addition to the usual `ondown` and `ontap`).
        
    + In a related change, modified the kind to set `noDefer: true` by default.

    + Added `allowDefault` flag.  Default value is `false`.  Setting this to
        `true` will stop `preventDefault()` from being called on captured
        events.

* Updated `ready.js` so that it no longer uses other Enyo code.

* In `enyo.Repeater`, updated documentation for `build()` method.

* Made several changes to `enyo.Scroller`:

    + Used absolute positioning to implement `enyo-scrollee-fit` style for
        scroller as a child of flexbox, since flexbox doesn't support
        percentage-based sizing.

    + Rewrote `cacheScrollPosition()` to address caching bug.

    + Modified `setScrollLeft()` and `setScrollTop()` to update the cached
        scroll position when the scroller is hidden or re-rendered.

* Made several updates to `enyo.ScrollMath`

    + Updated `mousewheel()` to allow horizontal scrolling from `mousewheel`
        event.

    + Modified `animate()` and `scrollTo()` to ensure that final scroll position
        matches the originally-specified position.

    + Adjusted value of `kFrictionEpsilon` when running on webOS for faster
        scroll stop on TV.

* In `enyo.ScrollMath` and `enyo.TouchScrollStrategy`, addressed issue that
    could cause touch scrolling to get stuck in overscroll at the bottom of a
    DataGridList.

* In `enyo.Select`, added `value` property, which contains the value of the
    selected option.  (Default is `null`.)

* In `enyo.TouchScrollStrategy`, added `preventDefault` flag.  Set this to
    `false` to allow default (i.e., platform-native) scrolling behavior.  The
    default value is `true`, meaning that native scrolling is suppressed.

* In `transform.js`, modified `enyo.dom.transformsToDom()` to set correct style
    property when control does not have DOM node.

* In `enyo.UiComponent`, removed `controllerChanged()`; also modified `bubble()`
    to call `enyo.dom.updateScaleFactor()` if window is being resized.

* In `VerticalDelegate.js`, modified `modelsAdded()` to always update scroll
    thresholds.

* In `VerticalGridDelegate.js`, broke out new methods `updateIndexBound()`,
    `modelsAdded()` and `modelsRemoved()` from existing `updateMetrics()`.  This
    improves performance by eliminating redundancy.

* In `enyo.xhr`, added support for boolean request parameters `mozSystem` and
    `mozAnon`.  Set `mozSystem` to `true` to create a cross-domain XHR; set
    `mozAnon` to `true` to create an anonymous XHR that does not send cookies or
    authentication headers.  Both parameters are currently supported on Firefox
    OS only.

    Also, updated `request()`, fixing error in code for handling synchronous
    requests.

* In `enyo.XHRSource`, updated `go()` to switch order of parameters when calling
    `opts.fail()`.

* Added new samples: "AnchorSample", "ButtonSample", "CheckboxSample",
    "DragAvatarSample", "GroupSample", "ImageSample", "InputSample",
    "PageVisibilitySample", "PopupSample", "RichTextSample", "SelectSample",
    "SpriteAnimationSample", "StylesheetSupportSample", "TableSample",
    "TextAreaSample", and "VideoSample".

* Updated LESS to version 1.7.0.

* Updated `deploy.js` to ensure that deployment errors out if a badly-formatted
    `deploy.json` file is found.

* Updated `lessc.js` and `minify.js` to use relative URLs when compiling LESS
    files, to be compatible with the bootplate `Theme.less` scheme for importing
    and then overriding library variables.

* In `minify.js`, fixed extra quote in external URLs that caused problems with
    external stylesheets in Firefox.

* Updated `walker.js` to allow remapping of files as well as folders.

### moonstone

* Removed deprecated kinds `moon.List`, `moon.GridFlyweightRepeater`, and
    `moon.GridList`, along with related samples "ListHorizontalSample",
    "ListVerticalSample", and "GridListSample".  Developers should use
    `moon.DataList` and `moon.DataGridList` instead.

* Deprecated the `moon.ToggleText` kind, which has been superseded by
    `moon.ToggleSwitch`.  `moon.ToggleText` will likely be removed in a future
    Moonstone release.

* Replaced all image assets in the library with font-based icons and CSS.  When
    necessary, the icons may be colored using the `@moon-accent` LESS variable.
    This change, which involves modifications to kinds across all of Moonstone,
    makes it easier to implement UI themes, while also reducing the Moonstone
    library's file storage footprint.

* Updated `rendered()` functions of numerous Moonstone controls so they do not
    make DOM-related changes that could be made earlier (e.g., in `create()`).
    Moved code as needed.

* In `moon.Accordion`, added binding from `disabled` property on Accordion
    object to `disabled` property in `headerWrapper` component.  Also updated
    "AccordionSample" with related example.

* In `moon.Accordion`, `moon.ExpandableListItem`, and `moon.RadioItemGroup`,
    corrected property names in code samples.

* In `moon.BodyText`, updated `contentChanged()` to bubble
    `onRequestSetupBounds` event.

* Updated `moon.BreadcrumbArranger` to gracefully handle unrendered panels.

* In `moon.Button`, `moon.IconButton`, and `moon.PagingControl`, addressed issue
    in which, when opening a system popup, the `onKeyUp` event would not reach
    the application.

* Modified `moon.Calendar` to validate values in generic setter function instead
    of change handler.  Also modified code for determining month length to use
    new functionality provided by `iLib`.  

* Added right-to-left support to `moon.ChannelInfoBadge` controls.

* In `moon.ContextualPopup` and `moon.ContextualPopupDecorator`, added support
    for hiding the popup if the activating control is pressed again while the
    popup is showing.  Among other changes, the former kind receives the new
    method `capturedTap()`, while the latter kind gains `popupShown()`, a
    handler for `onShow` events.

* Made several changes to `moon.DataGridList`:

    + Added handlers for `onSpotlightFocus` and `onSpotlightBlur` events.  Now
        when a DataGridList item receives focus, the z-index value is
        incremented; when focus is lost, the original z-index is restored.  This
        improves performance for DataGridList items that contain Marquees.

    + Added handler for `onSpotlightFocused` event as part of fix for up and
        down arrows' remaining active when 5-way navigation reaches first or
        last row, respectively.

* In `moon.DataList`, fixed issue in which Spotlight (5-way) navigation would
    not proceed to next page if items at end of current page are disabled.  Fix
    includes introduction of new methods `selectItem()`, `selectPrev()` (which
    handles `onSpotlightUp` and `onSpotlightLeft` events), `selectNext()` (which
    handles `onSpotlightDown` and `onSpotlightRight`), `findSpottableControl()`,
    and `getNextSpottableChild()`.

* In `moon.DataListSpotlightSupport`, updated `getNextSpottableChild()`,
    replacing `for...in` loop with `for` loop using incrementing counter.

* Updated `moon.DatePicker` and `moon.TimePicker` to support null value; also
    updated related samples "DatePickerSample" and "TimePickerSample".

* In `moon.Drawer`, fixed issue that could cause "dresser" area to be
    unfocusable.

* Updated `moon.Drawer`, `moon.Drawers`, `moon.Panel`, and `moon.Panels` so that
    panels and drawers are generally not spottable when hidden.

* In `moon.Drawers`, modified `setupHandles()` to check for existence of drawers
    before trying to work with them.  Also modified the `pointer-event` rule
    value to unblock mouse events.

* In `moon.Drawers` and `moon.Panels`, replaced `for 'x' in 'y'` structures with
    incrementing loop counters.

* Made several updates to `moon.ExpandableInput`:

    + Updated behavior so that a 5-way Down keypress while in the open state
        causes the input's content to be submitted and the focus to shift
        downward (if applicable).  Input content will also be submitted in
        response to a click outside of the control.  Code changes include the
        introduction of two new methods, `inputBlur()` and
        `closeDrawerAndHighlightHeader()`.

    + Changed `onkeydown` event handler to an `onkeyup` handler with key code
        checking.

    + Made change to respot header when closing the drawer while in pointer
        mode.

* In `moon.ExpandableIntegerPicker`, added handling for new `onRebuilt` event,
    allowing the picker to be reflowed, if necessary.

* Made several changes to `moon.ExpandableListItem:

    + Addressed issue preventing drawer from opening when the header text area
        is focused via 5-way navigation.

    + Fixed issue preventing the header of a disabled ExpandableListItem from
        reflecting its disabled state.
  
    + Added new "ExpandableListItemSample".

* In `moon.ExpandablePicker`, added support for selection of multiple items.
    To enable multi-selection, set the `multipleSelect` property to `true`
    (default is `false`).  Also added related example to
    "ExpandablePickerSample".

* In `moon.GridListImageItem`, set `overflow: hidden` to prevent unnecessary
    re-layout.

* Made several changes to `moon.Header`:

    + Added new `type` property.  Valid values for `type` are `"small"`,
        `"medium"`, and `"large"` (the default).  Also added handler for changes
        to `type` value.

    + Deprecated `small` property, which was previously used to distinguish
        between "small" and "large" headers; updated samples to use `type`
        property to specify header size/type.

    + Removed time-delayed auto-marquee behavior from header title.
    
    + Changed color of horizontal rules.

* In `moon.HighlightText`, overloaded render delegate to handle special
    behavior.

* In `moon.Icon`, made behavior more intuitive when `icon` or `src` property
    changes.  Also, fixed styling of disabled state.

* In `moon.IconButton`, fixed issue preventing grouped IconButtons from showing
    active state when pressed.  Also, simplified CSS styles.

* Modified styling of `moon.Image` so that it only stretches to fit the full
    size of its container when the `"sized"` CSS class has been applied.

* In `moon.InputHeader`, added support for ellipsizing overflow content.

* Updated `moon.ListActions` to use CSS transforms for animation, instead of
    relying on `enyo.StyleAnimator`.

* In `moon.MarqueeSupport`, added `marqueeOnRenderDelay` property.  If
    `marqueeOnRender` is `true`, the marquee animation will begin when this
    many milliseconds have elapsed after rendering.

    Also added `_marquee_startMarqueeCustomDelay()`, used internally to trigger
    the marquee animation.

* In `moon.ObjectActionDecorator`, fixed 5-way navigation; also converted
    Windows line endings to Unix line endings in source file.

* In `moon.Panel`, added `removeSpottableProps()` and updated
    `updatesSpottability()` to correct issue in which focus could be lost when
    using panels within drawers.

* Made several updates to `moon.Panels`:

    + Improved performance by simplifying show/hide animation, and by reworking
        `pushPanel()` so that only pushed panels are resized.

    + Added handler for `onSpotlightFocused` events, to ensure that `this.index`
        gets updated when a new panel gains focus.

    + Improved handling of changes to `brandingSrc` property, used to display a
        brand image in the lower left corner of an activity panel when a
        breadcrumb is visible.

    + Updated `create()` method, adding call to `this.showingChanged()`.  This
        is part of a fix for an issue that could prevent the sidebar from being
        invoked when the Always Viewing pattern is used.

    + Updated `indexChanged()` to address issue preventing active panel from
        being spotted.

    + In `setIndex()`, moved value clamping inside conditional statement.  This
        addresses an issue that, under certain conditions, could prevent the
        Panels from closing as expected.

    + Made change to prevent Spotlight from highlighting controls during panel
        transition.

    + Fixed issue causing unexpected behavior when right arrow key is pressed
        twice (panel index advances by one, instead of the expected two).

    + Fixed issue that could prevent panels from expanding when a breadcrumb is
        clicked.  As part of fix, replaced handler for `onSpotlightFocused`
        events with handler for `onSpotlightFocus`.

    + Fixed issue that could cause two panels to overlap during a transition
        from one to the other.

    + Applied CSS translation to background scrim, enabling hardware
        acceleration.

    + In `spotlightLeft()`, fixed problem affecting leftward navigation via
        5-way controller in an Always Viewing pattern.

* Updated `moon.Popup` to prevent focus from escaping when in 5-way mode.

* In `moon.Scroller`, updated `scrollToControl()`, adding new parameter
    `setLastFocusedChild`.  When set to `true`, the control being scrolled to is
    set as the viewport's last focused child.

    Also, fixed issue causing scroller paging controls to remain visible when
    exiting the scroller via 5-way.

* Made several updates to `moon.ScrollStrategy`:

    + Cleaned up logic governing paging controls in 5-way mode.

    + Added `requestSetupBounds()`, handler method for `onRequestSetupBounds`
        event.  This updates `scrollBounds` without scrolling into view.

    + Added `setLastFocusedChild()`, which sets the passed-in control as the
        last focused child in the viewport.

    + Modified `requestScrollIntoView()` to address issue with calculation of
        bounds for an Accordion control at the bottom of the viewport.

* Made several changes to `moon.SimpleIntegerPicker`:

    + Added `onRebuilt` event, which fires when the picker is rebuilt, giving
        the controls it contains the opportunity to reflow the picker, if
        necessary.

    + Added ability to easily adjust picker height.

    + Modified arrow button behavior to reflect design spec.

* In `moon.SimplePicker`, modified `selectedIndexChanged()` to call
    `startMarquee()` after enabling or disabling navigation buttons.  This fixes
    broken marquee behavior.

    Also added handling for repeated keypresses.

* In `moon.Slider`, made change to prevent slider from becoming
    Spotlight-unhighlighted if pointer moves away during a drag operation.

* Made several updates to `moon.Spinner`:

    + GPU-accelerated CSS is now used for animations.
    
    + The font for spinner balls is now set explicitly.  This addresses an issue
        in which the spinner would appear "shrunken" when non-Latin fonts were
        in use.

    + Added support for using marquees, long text, and `components` blocks
        inside a spinner.

* In `moon.TimePicker`, updated `initILib()` to fix issue with incorrectly
    localized meridiem values.

* In `moon.ToggleButton`, added radio button inside the control to more clearly
    indicate the active state.  Also added support for customizing the text
    labels for "On" and "Off".

* In `moon.Tooltip`, modified `contentChanged()`, adding call to
    `detectTextDirectionality()` to address right-to-left mode issues.

* Fixed styling of `moon.VideoFeedback` in right-to-left mode.

* Updated `moon.VideoFeedback` and `moon.VideoTransportSlider` so that feedback
    control is updated while in preview mode.

* Made several changes to `moon.VideoPlayer`:

    + Updated `onjumpForward()` and `onjumpBackward()` to respond to button
        presses between 200 ms and 400 ms in duration.

    + In `create()` method, added call to `this.srcChanged()`.

    + Corrected icons for "show additional controls" and "hide additional
        controls".

    + Fixed problems with Spotlight behavior when VideoPlayer is used inside a
        Panels.  (A related change was made to the `_show()` method in
        `moon.Panels`.)

    + Addressed issue in which playback controls could not be invoked using
        5-way Up or Down keys.

* Updated `moon.VideoTransportSlider` to watch Enyo `move` event instead of DOM
    `mousemove` event.  This improves the tracking of mouse movement when screen
    content is upscaled.

* Added `moon-body-large-text` CSS style, for use when a large font size is
    needed.  Also added related sample, "BodyLargeTextSample".

* Added CSS styling for selected text in input controls.

* Fixed issues with sizing of Thai characters in input controls.

* Modified CSS for paging controls so that disabled controls do not display an
    active state.

* Updated samples to refer to LESS version 1.7.0.

* Updated HTML pages in samples with proper `<meta>` tags specifying UTF-8
    character set.

* Added "DynamicPanelsSample".

* In "CalendarSample", fixed functionality of Reset button.

* Updated "ContextualPopupSample" to set `value` property on ToggleButton
    instead of setting `active` property.

* Made several updates to "DataGridListSample":

    + Fixed behavior on refresh, replacing call to `removeAll()` (which
        currently does not exist on `enyo.Collection`) with call to
        `remove(collection.models)`.

    + Addressed problem causing loss of checkbox selection state when popup list
        is closed.

    + Modified `generateRecords()` to reference `this.modelIndex` instead of
        `this.index`.

* Made several updates to "DataListSample":

    * Fixed issue causing unexpected focus behavior on 5-way Down keypress from
        drawer.

    * Modified `scrollToIndex()` to allow the method to be called when scrolling
        has occurred or when the current index differs from the desired index.

    * Updated `generateRecords()` and `recordCountChanged()` to reference
        `models` property on `enyo.Collection` instead of outdated `records`
        property.

* In "DatePickerSample", fixed issue causing input fields to be obscured in
    right-to-left mode.

* In "DrawerSample", fixed spelling of "Third".

* In "HighlightTextSample", temporarily removed filtering from sample until new
    implementation is ready.

* Added new examples of `moon.Item` usage to "ItemSample".

* In "MarqueeSample", fixed behavior of "Stop Marquee" button.

* Updated "ScrollerTextSample" to work with `value` property of ToggleButtons
    instead of `active` property when declaring initial values and data
    bindings.

* In "SpinnerSample", added examples of spinners containing long text and
    `components` blocks.

* Updated "TimePickerSample" so that picker's locale is updated when the user
    selects a new locale.  Also fixed exception thrown when setting locale, and
    updated method names for consistency.

### layout

* Removed `enyo.GridList`, the supporting kind `enyo.GridFlyweightRepeater`, and
    "GridListSample".  Developers should use the `enyo.DataGridList` kind (under
    `ui/data` in Enyo core) instead.

* In `enyo.FittableLayout`, implemented CSS flexbox-based layout for improved
    performance on supported platforms.  To use flexbox, set `useFlex: true` on
    a Fittable container.  Otherwise, the existing JavaScript-based layout will
    be used.  Related samples were also updated.

* Updated `enyo.FlyweightRepeater` to use delegate pattern, removing interim fix
    based on whether control was overloading the generator method.  Also made
    changes for compatibility with recent changes to `enyo.Control`.

* In `enyo.Panels`, implemented improved narrow fit detection using media
    queries (in CSS) and platform detection at initialization time (in new
    `isNarrowDevice()` method).  With these changes, resizing functionality has
    been restored.

    Also, modified `finishTransition()` so that `popOnBack` is not ignored
    during transitions.

### spotlight

* Made several updates to `enyo.Spotlight`:

    + Exposed `highlight()` and `unhighlight()` functions, and added
        `bIgnoreMute` parameter to `_highlight()`.  When set to `true`, the
        highlighting code will run regardless of the muting state.

    + Fixed issue in which Spotlight would blur the current control when
        attempting to navigate to a different control via 5-way.

    + Moved firing of `onSpotlightSelect` event from `this.onSpotlightKeyDown()`
        to `this.onSpotlightKeyUp()`.  Also added emulation of `holdPulse` for
        `onSpotlightKeyDown` event.

    + Fixed issue preventing show-on-focus captions from appearing when the
        activating control receives focus through a transition from pointer mode
        to 5-way mode.

* Updated `enyo.Spotlight` and `enyo.Spotlight.Accelerator` to cancel
    acceleration when Spotlight container boundary is reached.

* In `enyo.Spotlight.Container`, modified `setLastFocusedChild()` so that
    `getFirstChild()` is called on `enyo.Spotlight` instead of on `this`; also
    removed logging code that could cause unhandled exception.

* In `enyo.Spotlight.Muter`, added calls to `enyo.Spotlight.highlight()` and
    `enyo.Spotlight.unhighlight()`.

### enyo-ilib

_No changes._

### enyo-webos

* Renamed `enyo.LS2Source` as `enyo.LunaSource` and corrected order of
    parameters passed to `options.success`.

### bootplate-moonstone

* Bumped versions of submodules.

## Known Issues and Limitations

* In right-to-left mode, in certain complex layouts involving scrollers, users
    may be unable to reach certain UI elements via 5-way keypresses.
