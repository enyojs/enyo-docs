% Enyo 2.4 Release Notes

Welcome to Enyo 2.4!  The following items have changed since the 2.3.0-pre.10
public preview release.  (Note that this list is not comprehensive; see the
commit history in GitHub for a complete list of changes.)

## New Libraries

The 2.4 release marks the public introduction of Moonstone, Enyo's UI library
for TV apps, and Spotlight, a library for managing focus states.  Also new are
the repos `bootplate-moonstone`, a Moonstone-specific version of the Bootplate
starter template, and `enyo-webos` and `enyo-cordova`, which provide support for
development on webOS for TV and a range of popular third-party platforms,
respectively.

## Detailed Release Notes

### enyo

* Enyo now supports the W3C pointer events recommendation and will use these
    events instead of mouse events when available.  The existing support for
    MSPointer events is now enabled only when W3C pointer events aren't
    detected, which fixes a touch-recognition problem in Internet Explorer 11.

* Enyo provides support for the W3C Page Visibility API in the new file
    `page_visibility.js`, under the `dom` package.  This normalizes
    `visibilitychange` events, as well as the `document.hidden` and
    `document.visibilityState` properties.  Fallbacks are used to support older
    browsers.

* Added `enyo.Video`.  Also updated base kind `enyo.Media` to support different
    playback states (fast forward, rewind, slow forward, slow rewind).

* Added `keymap.js` to `dom` package.  This adds a new key mapping feature to
    the dispatcher; key events gain a new _keySymbol_ property based on a global
    key mapping.  To map a keyCode to a keySymbol, call
    `enyo.dispatcher.registerKeyMap()` and pass in the mapping as a simple hash.

    Note that all key events are now dispatched via Signals.

* Added `rendered.js` to `boot` module.  `enyo.rendered()` registers callbacks
    to be called when `renderInto()` finishes rendering root component tree.

* Added `scrollToIndex()` API method to `enyo.DataList` and `enyo.DataGridList`.

* Deprecated `enyo.GridList`.  Developers should use `enyo.DataGridList`
    instead.

* Made several changes to `enyo.Collection`:

    + `enyo.Collection` is once again a subkind of `enyo.Component`.

    + The `filtered`, `filters`, `filterProps`, and `activeFilter` properties
        have been removed, and the `filter()` method no longer can be used to
        clear the active filter.  The whole filtering mechnanism is being
        rewritten for greater flexibility and improved performance.

    + Added support for destroying all local records.  The `destroyAll()` method
        now accepts a `local` parameter; pass in `true` to destroy local records
        via `destroyLocal()`.  Alternatively, you may use the new convenience
        method `destroyAllLocal()`.

        Also added convenience method `fetchAndDestroyLocal()`, which fetches
        the data for the collection before destroying local records.

    + Added `isFetching` property, whose value is a boolean indicating whether
        data is currently being fetched.  Typically used to show/hide an
        "in-progress" spinner control.

* In `enyo.Application`, removed the `controllers` property and made
    `enyo.Controller` the `defaultKind`.  Controllers should be declared as
    normal components.

    In a related change, added support for `global` property to
    `enyo.Controller`.

* Made numerous changes to `enyo.Binding`:

    + Removed `dirty` property, which was found to be not worth supporting. 

    + Added `allowUndefined` property, which defaults to `true`, allowing
        propagation of the `undefined` object.  If set to `false`, `undefined`
        will not be propagated without the use of a transform or an overloaded
        binding kind.

    + You may now call `stop()` from within a binding's `transform` function to
        stop propagation based on user-defined conditions.

    + `enyo.Binding` now registers for an entire path, and will update in
        response to changes anywhere in the path.

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

    + Added new `selectionEvents` property to enable mapping of events other
        than `ontap` to the selection process.

* Made several updates to `enyo.Model`:

    + `enyo.Model` now employs the default `enyo.ObserverSupport` and
        `enyo.BindingSupport`; as a result, it shares the limitation of working
        only with the `attributes` of a data record.

    + Added support for `force` parameter in `set()` method.  Setting the value
        to `true` forces change notifications to fire, even if the new value is
        the same as the old one.

    + Added support for `opts.success` callback in `didDestroy()` (which is
        itself an internal callback, called before any user-provided callbacks
        when a record is successfully destroyed).

    + Made changes to improve Model initialization time.

    + Fixed issue in `setObject()` that could result in failure to detect
        whether a model has changed.  Added related unit test to
        `DataModelingTest.js`.

    + Fixed issue in which calling `destroy()` on previously fetched models
        would destroy the models locally, but not in the remote data source. 

* Reworked the registered event system used by `enyo.Model` and
    `enyo.Collection`, creating a new mixin file, `RegisteredEventSupport.js`.
    The new system no longer depends on `enyo.Store`; thus, the API methods
    previously available via `enyo.Store` no longer exist.

* In `enyo.TouchScrollStrategy`, added published properties `fixedTime` and
    `frame`, which facade the `ScrollMath` properties with the same names.  Also
    added change handler methods `fixedTimeChanged()` and `frameChanged()`.

* In `enyo.UiComponent`, removed the base method `modelChanged()` and deprecated
    `controllerChanged()`; as a result, any developer code calling
    `this.inherited(arguments)` from within an overloaded `modelChanged()`
    method will fail, and should be removed.

* Updated XHR references in `xhr.js` to avoid potential circular references.
    Also implemented `destroy()` method in `enyo.Ajax` and `enyo.Async` for
    improved reference cleanup. 

* In `BindingSupport.js`, addressed issue preventing `destroy()` from completely
    destroying component bindings when called on a component.  Added related
    unit test to `BindingTest.js`.

* In `boot.js`, updated `enyo.load()` to work properly at load time.

* Made multiple updates to `enyo.Collection`:

    + Updated `add()` to monitor `change` and `destroy` events from instantiated
        models.

    + Added ability to call `filter()` with no parameters to easily apply the
        active filter.

    + Fixed issue preventing records from being added at index 0.

* In `enyo.Component`, added `triggerHandler()` method, a public API for
    triggering the handler for a particular type of event.  Also modified
    `toString()` to return `id` as well as `kindName`.

* In `ComputedSupport.js`, added default value support to computed properties.
    Simply provide a configuration object with a key named `defaultValue` and
    any value (even `undefined`).  Also updated associated unit tests.

* Made several updates to `enyo.Control`:

    + Added `detectTextDirectionality()`, which determines the control's script
        orientation (i.e., left-to-right or right-to-left) based on its content.

    + Added `getDomCssText()`, used internally in `enyo.Control`.

    + Added `invalidateStyles()`, called by `enyo.dom.transformsToDom()` in
        `transform.js`.

    + Added `sendShowingChangedEvent()`, which waterfalls an `onShowingChanged`
        event when a control's `showing` value is modified; also added
        `showingChangedHandler()` as default handler for the event.  If the
        control is not showing, the handler will stop propagation of the event.
        `showingChangedHandler()` may be overloaded to provide additional
        handling for the `onShowingChanged` event.

    + Modified `getAbsoluteShowing()` so that it now accepts an optional boolean
        parameter.  If `true` is passed in, computed bounds will not be
        retrieved to force a layout; instead, the method will rely on the return
        value of `getShowing()`.  Also fixed issue preventing focus from
        entering a popup if its owner is a hidden control.

    + Addressed issue that could cause focus to be lost when all items are
        removed from a list.

    + Fixed deprecated warnings triggered by calls to `getAbsoluteBounds()`.
    
    + Updated documentation for `hasNode()`.

* Made multiple updates to `enyo.DataList`

    + Added public property `fixedChildSize`, used to optimize performance when
        the items in a list have fixed dimensions.  This property should be set
        for any list whose items are of uniform height or width.

    + Added overload version of `showingChangedHandler()`.

    + Added overload version of `destroy()` method to address problems with
        `scrollToIndex()`.

    + Deprecated the `controlsPerPage` property because it was not being used
        properly, leading to problems in some apps; in its place, added
        `pageSizeMultiplier` property, which now dynamically determines the
        optimal number of controls for a given page.  Apps should not need to
        modify `pageSizeMultiplier` except in very rare circumstances.

    + Modified `rendered()` to give overloaded kinds the opportunity to respond
        to the `finished` event, even when it is delayed.

    + Reworked code to delay certain actions until the list is showing.

    + Updated `didScroll()` and `didResize()` to avoid firing events if no
        collection is available.

    + Fixed issue causing layout problems in DataLists with horizontal
        orientation.

    + Removed misleading documentation.

* In `enyo.DataList` and `enyo.DataRepeater`, renamed `getChildForIndex()` as
    `childForIndex()` and made sure that it returns `undefined` when that value
    is expected.

* In `enyo.DataList` and `VerticalDelegate.js`, fixed issue preventing proper
    updating of properties; also fixed code for determining scrolling threshold
    in horizontal orientation.

* In `enyo.dispatcher`, added `enyo.getPosition()`, a new API for retrieving the
    coordinates of the last known mouse/cursor position (or touch, if
    applicable).  Also added related sample, "PositionSample".

* In `dom.js`, added method `enyo.dom.getAbsoluteBounds()`, which takes into
    account translateX, translateY, and matrix3d transforms.  The existing
    `enyo.Control.getAbsoluteBounds()` API is unchanged, but its implementation
    now utilizes the new method on `enyo.dom`.

* In `gesture.js`, introduced `configureHoldPulse()` method, used in `down()` to
    configure subsequent `holdpulse` events.  `configureHoldPulse()` accepts a
    hash of options that may include values for `"delay"`, `"moveTolerance"`,
    `"endHold"`, and `"resume"`.  Default values are defined in
    `enyo.gesture.drag.holdPulseDefaultConfig`.

* In `enyo.Group`, added published property `allowHighlanderDeactivate`.  A
    value of `true` means that an active highlander item may be deactivated
    (default is `false`).  The value may be changed at runtime by sending the
    group an `onActivate` event with the desired value set on the event's
    `allowHighlanderDeactivate` property.

* In `hooks.js`, modfied `enyo.updateLocale()` so that it is the emitter of the
    `onLocaleChange` event.

* In `HorizontalDelegate.js` and `VerticalDelegate.js`, modified `initList()` to
    allow scroller settings to be overridden by a subkind or instance.  Also
    added new property `posProp`, part of reworked support for right-to-left
    scripts.

* Made several changes to `enyo.Image`:

    + Added published properties `sizing` and `position`.  When `sizing` is set,
        the image is rendered as a `<div>` with `background-image`.  Valid
        values are `"cover"` and `"constrain"`.  When `sizing` is used,
        `position` determines the positioning of the image within its bounds
        (default is `"center"`).

    + Modified `srcChanged()` to guard against regex failure if `src` property
        is null.

    + Fixed issue in which some browsers could not read placeholder image data.

* In `enyo.Input`, modified `valueChanged()` to manually update the cached value
    to ensure we have the correct value the next time the attribute is requested
    or the control is re-rendered.

* Made several updates to `lang.js`:

    + Added `enyo.perfNow()`, a high-precision, high performance monotonic
        timestamp, which is independent of changes to the system clock and
        safer for use in animation, etc.  `enyo.perfNow()` falls back to
        `enyo.now()` (based on the JavaScript `Date` object) on platforms where
        `window.performance.now()` is not available.  Also modified numerous
        kinds across the framework to use `enyo.perfNow()` instead of
        `enyo.now()` for tracking duration.

    + Added methods `enyo.toUpperCase()` and `enyo.toLowerCase()`.  These should
        be used to replace calls to `String.toUpperCase()` and
        `String.toLowerCase()` in code that needs to be locale-aware.

    + Modified `enyo.asyncMethod()` to accept an anonymous function as the lone
        parameter.  The previous signature is still valid, as well.

    + Addressed problems with `enyo.getPath()`, `enyo.getPath.fast()`,
        `enyo.setPath()`, and `enyo.setPath.fast()` when dealing with computed
        properties.

* In `loader.js`, updated `decodePackagePath()` to properly handle URLs that
    begin with `//`.

* In `log.js`, added `validateArgs()` to prevent (or gracefully handle) circular
    reference errors when stringifying objects.

* In `modal.js`, modified the `enyo.dispatcher.capture()` API so that it no
    longer bubbles all captured events through the normal event chain, but
    rather notifies the captureTarget when specific events occur, according to a
    map of callbacks passed as a parameter to `capture()`.
    
    While this is, technically, a breaking change to the
    `enyo.dispatcher.capture()` API, the API has not been publicized and is
    fairly difficult to use.  Among the set of controls developed by the Enyo
    team, it was only used in `enyo.Popup`, so we assume this change will have
    minimal impact on the general public.

* Fixed problem affecting initialization of `model` property in
    `enyo.ModelController` and added unit test to `ControllerTest.js`.  Also
    addressed a similar situation involving `controller` property in
    `enyo.UiComponent`.

* In `msevents.js`, added pointer event support for IE11 and fixed handling of
    touch events in IE10.

* Updated `enyo.platform` to include `platformName`.  Also updated platform
    detection for Silk 3.x.

* In `enyo.Object`, made `destroyed` flag observable and updated documentation
    for `set()`.

* In `enyo.Popup`, added `allowDefault` flag.  Default value is `false`.
    Setting this to `true` will stop `preventDefault()` from being called on
    captured events.  Also, improved centering code in `updatePosition()`.

* Updated `ready.js` so that it no longer uses other Enyo code.

* In `enyo.Repeater`, updated documentation for `build()` method.

* Optimized `RepeaterChildSupport.js` to avoid claiming node until necessary.

* In `enyo.RichText`, modified `disabledChanged()` to bubble `onDisabledChange`
    event.  This is needed because `disabledChanged()` doesn't call the parent
    method in `enyo.Input`.

* Made several modifications to `enyo.Scroller`:

    + Added overload version of `resized()` that only propagates `resize` events
        to children if the `showing` property is `true`.  This is part of a fix
        for issues seen while scrolling or paging in `enyo.DataList` or
        `enyo.DataGridList`.

    + Rewrote `cacheScrollPosition()` to address caching bug.

    + Modified `setScrollLeft()` and `setScrollTop()` to update the cached
        scroll position when the scroller is hidden or re-rendered.

    + Set `noDefer: true` for API compatibility.

    + Set the touch strategy to "TranslateScrollStrategy" (instead of
        "TouchScrollStrategy") for webOS version 4 and later.

* Updated `enyo.Scroller` and `enyo.ScrollStrategy` to normalize new properties
    returned by `getScrollBounds()`.

* In `enyo.ScrollMath`, updated `mousewheel()` to allow horizontal scrolling
    from `mousewheel` event.

* In `enyo.ScrollMath` and `enyo.TouchScrollStrategy`, addressed issue that
    could cause touch scrolling to get stuck in overscroll at the bottom of a
    DataGridList.

* Modified `enyo.Store` to throw an error (instead of a warning) when unique
    records in the same store are found to have the same `primaryKey`.

* In `enyo.Store`, fixed context binding in `addListener()`, adding related unit
    test to `DataModelingTest.js`.  Also fixed issues seen when calling
    `findLocal()` with no previous entry of data for the record kind.

* In `touch.js`, fixed issue causing `document.ongesturechange` event to not
    fire on iOS 7.

* In `enyo.UiComponent`, addressed issue in which `addBefore()` did not work
    correctly if the container had a control parent; added related unit test to
    `ControlTest.js`.

* Made several updates to `VerticalDelegate.js`:

    * Fixed problems with item selection.

    * Fixed issue causing display of truncated list after deletion of an item.

    * Added check to refresh page only if it actually has children.

    * Modified `didScroll()` to update scroll bounds before comparing bounds to
        scroll threshold.

    * Modified `setScrollThreshold()` to better handle case in which a
        DataGridList has a small data set and page 2 has no controls.
        
* In `VerticalGridDelegate.js`, modified `layout()` to add support for
    right-to-left positioning of grid items.  Also rounded values used for
    positioning and sizing to avoid floating point positioning glitches in
    WebKit.

* Made several changes to `enyo.xhr`:

    + Added support for boolean request parameters `mozSystem` and `mozAnon`.
        Set `mozSystem` to `true` to create a cross-domain XHR; set `mozAnon` to
        `true` to create an anonymous XHR that does not send cookies or
        authentication headers.  Both parameters are currently supported on
        Firefox OS only.

    + Updated previous change to `simplifyFileURL()` that disabled use of local
        file access when fetching a page from a Windows file share.  With this
        update, the hostname is now only omitted for devices running webOS 3 or
        earlier.

    + Modified `request()` to call `enyo.path.rewrite()` on passed-in URL before
        calling `simplifyFileURL()`.  This fixes the loading of `$`-prefixed
        paths from `file://` URLs.

* Added samples for Enyo core UI controls.

* Updated "DataRepeaterSample" to show how `index` property may be used to get
    item number.  Also removed `"enyo-fit"` CSS class, which was causing the
    DataRepeater not to scroll on initial upward swipe.

* In "GroupSample", fixed issue with grouping in Firefox.

* In "ImageSample", fixed issue causing placeholder image to be stretched.

* Updated `AjaxText.js` to limit cache control test to iOS 6 only.

* In `enyo/tools`, updated npm dependencies (`nopt` and `shelljs` packages).

* Updated `lessc.js` and `minify.js` to use relative URLs when compiling LESS
    files, to be compatible with the bootplate `Theme.less` scheme for importing
    and then overriding library variables.

* In `minify.js`, fixed handling of non-relative paths, alternate `package.js`
    files, and CSS/LESS assets with spaces in their filenames.  Also fixed extra
    quote in external URLs that caused problems external CSS in Firefox.

* In `package.json`, reformatted dependencies as a hash map to match npm
    documentation specifications.

 * Updated Travis CI configuration to use npm cache and PHP 5.5.  Temporarily
    disabled AJAX tests' ability to affect Travis pass/fail status due to
    problems with PHP server.

* Updated `enyo.design` file, used by the Ares IDE.

### onyx

* Updated components and samples to support the `iLib` localization library (via
    `enyo-ilib`).

* Updated `onyx.Button` to prevent pressed state from appearing when button is
    disabled.

* In `onyx.ContextualPopup`, modified action buttons so they behave like
    standard Enyo buttons.

* In `onyx.IconButton`, added code to verify that the IconButton is not disabled
    before firing events.

* In `onyx.Popup`, made `defaultZ` a published property.

* In `onyx.TabBar`, fixed several issues related to changing or removing tabs.

* In `onyx.TabBar.Item`, removed unnecessary call to `render()`.

* Fixed issue with delayed `:active:hover` button styling in response to touch.

* Updated `.less` files to ensure that `<script>` tag content isn't visible.

* Removed `:active:hover` button styling, instead applying or removing `pressed`
    class in response to appropriate events.  Also fixed issues with `pressed`
    state as applied to sliders.

* Updated "DatePickerSample" and "TimePickerSample" to set locale on picker
    initialization.

* In "InputSample", fixed "alwaysLookFocused" checkbox so that unchecking the
    box actually results in the expected action.

* In "ListPulldownSample", added CSS `overflow` property.

* In "PickerSample", replaced `onyx.PickerButton` with `onyx.Button` in the
    "Picker with Static Button".  Also replaced one-off date picker with generic
    name picker based on `onyx.FlyweightPicker`.

* Updated `onyx.design` file, used by the Ares IDE.

### layout

* Removed `enyo.GridList`, the supporting kind `enyo.GridFlyweightRepeater`, and
    "GridListSample".  Developers should use the new `enyo.DataGridList` kind
    instead.

* In `enyo.Arranger`, disabled translation for any panel containing video.

* In `enyo.ContextualLayout`, fixed miscalculation in
    `applyHorizontalPositioning()` that could cause contextual popups to bleed
    off the screen.

* In `enyo.FittableLayout`, added overload `constructor()` method to ensure that
    correct CSS class is applied if control is explicitly marked as not
    right-to-left.

* In `enyo.GridListImageItem`, fixed documentation for `useSubCaption` property.

* In `enyo.ImageView`, fixed issue in which image would not render on initial
    load in Safari, but would after resize.

* In `enyo.List`, modified behavior of persistent swipeable items so that the
    `persistentItemVisible` flag is only set to `true` if a swipe has completed.
    Previously, it had been set to `true` on incomplete swipes as well, leading
    to unexpected behavior on the subsequent swipe.

    Also, reworked handling of right-to-left scripts.

* Made several changes to `enyo.Panels`:

    + Updated `isScreenNarrow()` to support Android Chrome browser and Android
        version 4.4 and higher.

    + Modified `setIndex()` so that, when `wrap` is `true`, the index value
        wraps to its initial value when moving forward from the last index,
        and to its last value when moving backward from the initial index.

        Also in `setIndex()`, ensured that observers are sent the correct index
        value when value is clamped.

    + Removed `disableTranslation` hack, as the webOS bug it worked around has
        been fixed.

* In `enyo.PanZoomView`, fixed ownership of unscaled components.

* Updated `layout.design` file, used by the Ares IDE.

### enyo-ilib

* Updated `iLib` to version `20140409-build-5.0-012`.

* Made numerous updates to `glue.js`:

    + Updated `enyo.updateI18NClasses()` to apply the `enyo-locale-non-latin`
        CSS class to the `<body>` tag for languages having missing glyphs in
        either the Miso or Museo Sans fonts. This lets us avoid the "ransom
        note" effect, in which multiple fonts are used in the same word.

    + Added the class `<enyo-locale>-non-italic` for locales that use scripts
        that do not commonly use italic fonts.  This may be used in the Enyo CSS
        classes to determine whether or not to turn on italics for some parts of
        the UI.

    + Added support for passing a locale string as an argument to
        `enyo.updateLocale()`.

    + Added support for locale-safe string case-changing.

    + Restored code that updates locale settings at library load time.

    + Allowed caching of JSON files.

    + Added override to display Latin characters in Korean.

    + Added Croatian and Bosnian to list of languages using characters that have
        glyphs missing from Miso/Museo (`nonLatinLanguageOverrides`).

    + Fixed ISO code for Polish language.

    + Minor updates for IE8 compatibility.

* Restored Onyx-based samples.
