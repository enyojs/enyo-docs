% Enyo 2.3.0-rc.1 Release Notes

Welcome to Enyo 2.3.0-rc.1, the first release candidate version of Enyo 2.3.0.
The following items have changed since the Enyo 2.3.0-pre.10 release. (Note that
this list is not comprehensive; see the commit history in GitHub for a complete
list of changes.)

## Migration Notes/API Changes

* In `DataList` and `DataGridList`, the `controller` property was renamed as
    `collection` for better consistency.  The old `controller` property will
    continue to work exactly the same way until the next major Enyo release
    (following 2.3 final), so changing to `collection` at this time is optional,
    although you will see a warning in the console advising that the
    `controller` property is considered deprecated.  So, please consider
    renaming `controller` to `collection` when time permits.

## enyo

* Enyo now supports the W3C pointer events recommendation and will use these
    events instead of mouse events when available.  The existing support for
    MSPointer events is now enabled only when W3C pointer events aren't
    detected, which fixes a touch-recognition problem in Internet Explorer 11.

* Added `enyo.Video` (previously in `moonstone` repo).  Also updated base kind
    `enyo.Media` to support different playback states (fast forward, rewind,
    slow forward, slow rewind).

* Added `keymap.js` to `dom` package.  This adds a new key mapping feature to
    the dispatcher; key events gain a new _keySymbol_ property based on a global
    key mapping.  To map a keyCode to a keySymbol, call
    `enyo.dispatcher.registerKeyMap()` and pass in the mapping as a simple hash.

* Added `rendered.js` to `boot` module.  `enyo.rendered()` registers callbacks
    to be called when `renderInto()` finishes rendering root component tree.

* Implemented `destroy()` in `enyo.Ajax` and `enyo.Async` for improved
    reference cleanup.

* Added `scrollToIndex()` API method to `enyo.DataList` and `enyo.DataGridList`.

* In `enyo.DataList`, deprecated the `controlsPerPage` property because it was
    not being used properly, leading to problems in some apps; instead, added
    `pageSizeMultiplier` property, which now dynamically determines the optimal
    number of controls for a given page.  Apps should not need to modify
    `pageSizeMultiplier` except in very rare circumstances.

* In `enyo.Scroller`, set `noDefer: true` for API compatibility.  Also, set the
    touch strategy to "TranslateScrollStrategy" (instead of
    "TouchScrollStrategy") for webOS version 4 and later.

* Updated `enyo.Scroller` and `enyo.ScrollStrategy` to normalize new properties
    returned by `getScrollBounds()`.

* In `enyo.TouchScrollStrategy`, added published properties `fixedTime` and
    `frame`, which facade the `ScrollMath` properties with the same names.  Also
    added change handler methods `fixedTimeChanged()` and `frameChanged()`.

* Modified `enyo.Application`, deprecating the `controllers` property and making
     `enyo.Controller` the `defaultKind`.  In related changes, added support for
     `global` property to `enyo.Controller` and updated `enyo.Collection` to
     once again be a subkind of `enyo.Component`.

* Made numerous changes to `enyo.Binding`:

    + Added `allowUndefined` property, which defaults to `true`, allowing
        propagation of the `undefined` object.  If set to `false`, `undefined`
        will not be propagated without the use of a transform or an overloaded
        binding kind.

    + Removed `dirty` property, which was found to be not worth supporting. 

    + `enyo.Binding` now registers for an entire path, and will update in
        response to changes anywhere in the path.

* In `enyo.Collection`, added ability to call `filter()` with no parameters to
    easily apply the active filter.

* In `enyo.DataList` and `enyo.DataRepeater`, renamed `getChildForIndex()` as
    `childForIndex()` and made sure that it returns `undefined` when that value
    is expected.

* In `enyo.DataRepeater`, deprecated the `controller` property; the `collection`
    property should be used instead.  Updated core unit test to use `collection`
    instead of `controller`.  In application code, any bindings that reference
    `controller` should be changed to use `collection` and any overload
    `controllerChanged()` methods should be changed to `collectionChanged()`.

* Made several updates to `enyo.Model`:

    + `enyo.Model` now employs the default `enyo.ObserverSupport` and
        `enyo.BindingSupport`; as a result, it shares the limitation of working
        only with the `attributes` of a data record.

    + Made changes to improve Model initialization time.

    + Added support for `opts.success` callback in `didDestroy()` (which is
        itself an internal callback, called before any user-provided callbacks
        when a record is successfully destroyed).

    + Fixed issue in `setObject()` that could result in failure to detect
        whether a model has changed.  Also added related unit test to
        `DataModelingTest.js`.

    + Fixed issue in which calling `destroy()` on previously fetched models
        would destroy the models locally, but not in the remote data source. 

* Reworked the registered event system used by `enyo.Model` and
    `enyo.Collection`, creating a new mixin file, `RegisteredEventSupport.js`.
    The new system no longer depends on `enyo.Store`; thus, the API methods
    previously available via `enyo.Store` no longer exist.

* Fixed problem affecting initialization of `model` property in
    `enyo.ModelController` and added unit test to `ControllerTest.js`.  Also
    addressed a similar situation involving `controller` property in
    `enyo.UiComponent`.

* Modified `enyo.Store` to throw an error (instead of a warning) when unique
    records in the same store are found to have the same `primaryKey`.

* In `enyo.UiComponent`, removed the base method `modelChanged()` and deprecated
    `controllerChanged()`; as a result, any developer code calling
    `this.inherited(arguments)` from within an overloaded `modelChanged()`
    method will fail, and should be removed.

    Also addressed issue in which `addBefore()` did not work correctly if the
    container had a control parent; added related unit test to `ControlTest.js`.

* In `xhr.js`, updated XHR references to avoid potential circular references.
    Also, in `simplifyFileURL()`, added a workaround for problems with local
    file access on devices running webOS 3 or earlier.

* In `enyo.Collection`, updated `add()` to monitor `change` and `destroy` events
    from instantiated models, and to fix issue preventing records from being
    added at index 0.

* In `enyo.Collection` and `enyo.DataRepeater`, removed references to
    `controller` property from documentation.

* In `enyo.Component`, modified `toString()` to return `id` as well as
    `kindName`.

* Fixed issue causing layout problems in DataLists with horizontal orientation;
    also, addressed problems with `scrollToIndex()` API in `enyo.DataList`,
    adding overload version of `destroy()` method, and removed misleading
    documentation.

* In `enyo.DataList` and `VerticalDelegate.js`, fixed issue preventing proper
    updating of properties; also fixed code for determining scrolling threshold
    in horizontal orientation.

* In `HorizontalDelegate.js` and `VerticalDelegate.js`, modified `initList()` to
    allow scroller settings to be overridden by a subkind or instance.  Also
    added new property `posProp`, part of reworked support for right-to-left
    scripts.

* In `enyo.dispatcher`, added `enyo.getPosition()`, a new API for retrieving the
    coordinates of the last known mouse/cursor position (or touch, if
    applicable).  Also added related sample, "PositionSample".

* In `enyo.Group`, added published property `allowHighlanderDeactivate`.  A
    value of `true` means that an active highlander item may be deactivated
    (default is `false`).  The value may be changed at runtime by sending the
    group an `onActivate` event with the desired value set on the event's
    `allowHighlanderDeactivate` property.

* In `enyo.Model`, added support for `force` parameter to `set()`.  When set to
    `true`, this forces change notifications to fire, even if the new value is
    the same as the old one.

* In `enyo.Object`, made the `destroyed` flag observable.

* In `enyo.RichText`, modified `disabledChanged()` to bubble `onDisabledChange`
    event.  This is needed because `disabledChanged()` doesn't call the parent
    method in `enyo.Input`.
 
* In `enyo.Store`, fixed context binding in `addListener()`; added related unit
    test to `DataModelingTest.js`.

* Updated `enyo.platform` to include `platformName`.

* In `modal.js`, modified `enyo.dispatcher.capture()` API so that captured
    events no longer get bubbled through the normal event chain, but instead
    notify the `captureTarget` through a callback passed as a parameter to
    `capture()`.

    In addition, the capture API now requires a whitelist of events to capture,
    rather than the previous behavior of capturing (nearly) all events.

* In `msevents.js`, added pointer event support for IE11.

* In `touch.js`, fixed issue causing `document.ongesturechange` event to not
    fire on iOS 7.

* In `BindingSupport.js`, addressed issue preventing `destroy()` from completely
    destroying component bindings when called on a component.  Added related
    unit test to `BindingTest.js`.

* Optimized `RepeaterChildSupport.js` to avoid claiming node until necessary.

* Fixed issues with minifier script (`minify.js`).

* In `enyo/tools`, updated npm dependencies (`nopt` and `shelljs` packages).

* Updated Travis CI configuration to use npm cache and PHP 5.5.  Temporarily
    disabled AJAX tests' ability to affect Travis pass/fail status due to
    problems with PHP server.

* Updated `enyo.design` file, used by the Ares IDE.

# onyx

* Added enyo namespace to underspecified `kind` strings in `onyx.Popup`,
    `onyx.ProgressBar`, `onyx.ProgressButton`, `onyx.RadioButton`,
    `onyx.RadioGroup`, `onyx.TabBar`, `onyx.TabBarItem`, and `onyx.TabPanels`).
    This addresses an issue in which a kind could be treated as its own base
    kind.

* Removed unsafe code from `onyx.TabBar`.

* Updated `onyx.design` file, used by Ares IDE.

## layout

* In `enyo.Arranger`, disabled translation for any panel containing video.

* In `enyo.ContextualLayout`, fixed miscalculation in
    `applyHorizontalPositioning()` that could cause contextual popups to bleed
    off the screen.

* Reworked handling of right-to-left scripts in `enyo.List`.

* Updated `layout.design` file, used by the Ares IDE.

## enyo-ilib

* Updated `ilib` to version `enyojs/20131102-build-4.0-002`.

* In `glue.js`, added the class `<enyo-locale>-non-italic` for locales that use
    scripts that do not commonly use italic fonts.  This may be used in the Enyo
    CSS classes to determine whether or not to turn on italics for some parts of
    the UI.

    Also, restored code that updates locale settings at library load time.

* Restored Onyx-based samples.
