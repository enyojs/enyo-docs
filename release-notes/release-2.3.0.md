# Enyo 2.3.0 Release Notes

Welcome to Enyo 2.3.0!  The following items have changed since the 2.3.0-pre.10
public preview release.  (Note that this list is not comprehensive; see the
commit history in GitHub for a complete list of changes.)

### enyo

* Enyo now supports the W3C pointer events recommendation and will use these
    events instead of mouse events when available.  The existing support for
    MSPointer events is now enabled only when W3C pointer events aren't
    detected, which fixes a touch-recognition problem in Internet Explorer 11.

* Added `enyo.Video`.  Also updated base kind `enyo.Media` to support different
    playback states (fast forward, rewind, slow forward, slow rewind).

* Added `keymap.js` to `dom` package.  This adds a new key mapping feature to
    the dispatcher; key events gain a new _keySymbol_ property based on a global
    key mapping.  To map a keyCode to a keySymbol, call
    `enyo.dispatcher.registerKeyMap()` and pass in the mapping as a simple hash.

* Added `rendered.js` to `boot` module.  `enyo.rendered()` registers callbacks
    to be called when `renderInto()` finishes rendering root component tree.

* Added `scrollToIndex()` API method to `enyo.DataList` and `enyo.DataGridList`.

* Modified `enyo.Application`, deprecating the `controllers` property and making
     `enyo.Controller` the `defaultKind`.  In related changes, added support for
     `global` property to `enyo.Controller` and updated `enyo.Collection` to
     once again be a subkind of `enyo.Component`.

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

    + Deprecated the `controller` property; the `collection` property should be
        used instead.  Updated core unit test to use `collection` instead of
        `controller`.  In application code, any bindings that reference
        `controller` should be changed to use `collection` and any overload
        `controllerChanged()` methods should be changed to `collectionChanged()`.

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

* Made multiple updates to `enyo.Collection`:

    + Updated `add()` to monitor `change` and `destroy` events from instantiated
        models.

    + Added ability to call `filter()` with no parameters to easily apply the
        active filter.

    + Fixed issue preventing records from being added at index 0.

* In `enyo.Component`, modified `toString()` to return `id` as well as
    `kindName`.

* In `enyo.Control`, added new API methods `invalidateStyles()` and
    `getDomCssText()`.  The former method is called by
    `enyo.dom.transformsToDom()` in `transform.js`, while the latter is used
    internally in `enyo.Control`.

* Made a number of updates to `enyo.DataList`

    + Deprecated the `controlsPerPage` property because it was not being used
        properly, leading to problems in some apps; in its place, added
        `pageSizeMultiplier` property, which now dynamically determines the
        optimal number of controls for a given page.  Apps should not need to
        modify `pageSizeMultiplier` except in very rare circumstances.

    + Added overload version of `destroy()` method to address problems with
        `scrollToIndex()`.

    + Modified `rendered()` to give overloaded kinds the opportunity to respond
        to the `finished` event, even when it is delayed.

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

* In `enyo.Group`, added published property `allowHighlanderDeactivate`.  A
    value of `true` means that an active highlander item may be deactivated
    (default is `false`).  The value may be changed at runtime by sending the
    group an `onActivate` event with the desired value set on the event's
    `allowHighlanderDeactivate` property.

* In `HorizontalDelegate.js` and `VerticalDelegate.js`, modified `initList()` to
    allow scroller settings to be overridden by a subkind or instance.  Also
    added new property `posProp`, part of reworked support for right-to-left
    scripts.

* Modified `enyo.Input` so that, when the value changes, we only call
    `setAttribute()` if the Input has no DOM node yet; otherwise, we set
    the `value` property on the node.

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

* Updated `enyo.platform` to include `platformName`.

* In `enyo.Object`, made the `destroyed` flag observable.

* Optimized `RepeaterChildSupport.js` to avoid claiming node until necessary.

* In `enyo.RichText`, modified `disabledChanged()` to bubble `onDisabledChange`
    event.  This is needed because `disabledChanged()` doesn't call the parent
    method in `enyo.Input`.

* In `enyo.Scroller`, set `noDefer: true` for API compatibility.  Also, set the
    touch strategy to "TranslateScrollStrategy" (instead of
    "TouchScrollStrategy") for webOS version 4 and later.

* Updated `enyo.Scroller` and `enyo.ScrollStrategy` to normalize new properties
    returned by `getScrollBounds()`.

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

 In `VerticalDelegate.js`, fixed problems with item selection.  Also fixed
    issue causing display of truncated list after deletion of an item.

* In `xhr.js`, updated previous change to `simplifyFileURL()` that disabled use
    of local file access when fetching a page from a Windows file share.  With
    this update, the hostname is now only omitted for devices running webOS 3 or
    earlier.

* In `enyo/tools`, updated npm dependencies (`nopt` and `shelljs` packages).

* In minifier script (`minify.js`), fixed handling of non-relative paths,
    alternate `package.js` files, and CSS/LESS assets with spaces in their
    filenames.

* In `package.json`, reformatted dependencies as a hash map to match npm
    documentation specifications.

 * Updated Travis CI configuration to use npm cache and PHP 5.5.  Temporarily
    disabled AJAX tests' ability to affect Travis pass/fail status due to
    problems with PHP server.

* Updated `enyo.design` file, used by the Ares IDE.

### onyx

* Updated `onyx.design` file, used by the Ares IDE.

### layout

* In `enyo.Arranger`, disabled translation for any panel containing video.

* In `enyo.ContextualLayout`, fixed miscalculation in
    `applyHorizontalPositioning()` that could cause contextual popups to bleed
    off the screen.

* Reworked handling of right-to-left scripts in `enyo.List`.

* Removed `disableTranslation` hack from `enyo.Panels`, as the webOS bug it
    worked around has been fixed.

* Updated `layout.design` file, used by the Ares IDE.

### enyo-ilib

* Updated `ilib` to version `20131204-build-4.0-005`.

* In `glue.js`, added the class `<enyo-locale>-non-italic` for locales that use
    scripts that do not commonly use italic fonts.  This may be used in the Enyo
    CSS classes to determine whether or not to turn on italics for some parts of
    the UI.

    Also in `glue.js`, restored code that updates locale settings at library
    load time.

* Restored Onyx-based samples.
