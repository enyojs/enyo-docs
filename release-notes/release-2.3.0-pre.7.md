% Enyo 2.3.0-pre.7 Release Notes

Welcome to Enyo 2.3.0-pre.7, a pre-release version of Enyo 2.3.0.  The following
items have changed since the Enyo 2.2 release. (Note that this list is not
comprehensive; see the commit history in GitHub for a complete list of changes.)

## Enyo

* This release adds support for the MVC model of app development.  This includes
    changes to properties to support bindings, computed properties, and property
    change observers; highlights are called out below.  (See our [MVC Overview]
    for details on all the new kinds and methods.)

    + Added `enyo.Application`, a new kind to include non-visible elements and
        rendered components.  It is defined in the new `Application.js` file in
        the `kernel` module.

    + Added `enyo.Router`, a new kind that acts as an application controller
        that responds to changes in the Web page URL.  This allows developers to
        modify application state on startup based on the initial URL, as well as
        track the current state by updating the URL as the application runs.
        `enyo.Router` is defined in the new `Router.js` file in the `kernel`
        module.

    + Significantly expanded `kernel` module, adding new files `Binding.js`,
        `Controller.js`, `ViewController.js`, and `dev.js` (in addition to the
        aforementioned `Application.js` and `Router.js`), along with new `data`
        submodule (with `Model`, `ModelController`, and `Collection` kinds) and
        `mixins` submodule.  Also made major additions to existing `lang.js`
        and `Object.js` files.

    + Added data layer components (under `ui/data`) `enyo.DataList` and
        `enyo.DataGridList`.  Both are subkinds of the abstract
        `enyo.DataRepeater` kind.

    + Added new `ext` module, which contains the new files `BooleanBinding.js`,
        `BooleanOnlyBinding.js`, and `InputBinding.js`, as well as `macroize.js`
        (previously found in the `kernel` module).

    + Added new file `ready.js` in the `boot` module.

    + Added `enyo.View` as an alias for `enyo.Control`.

    + Under `tools`, added unit tests for new MVC functionality.

* Introduced new API for getting and setting object property values.

    The existing getter and setter methods, `getProperty()` and `setProperty()`,
    have been replaced by the simpler `get()` and `set()`.  To retrieve a
    property's value, instead of calling `getProperty("<propertyName>")` on an
    object, you should now call `get("<propertyName>")`.

    Likewise, when setting a property's value, instead of calling
    `setProperty("<propertyName>", <value>)` on a given object, you should now
    call `set("<propertyName>", <value>)`.

    The framework's automatic support for `propertyName<Changed>` methods for
    published properties has not changed.  So, for example, a call to
    `set("myProp", 5)` will still automatically call the `myPropChanged()`
    method (assuming that you've defined such a method, and that the value of
    `myProp` was not already `5`).

* In `Oop.js`, changed `enyo.kind()` to delay most of its work until the kind
    is used for the first time.  This behavior is enabled by default for named
    kinds with no static members; it may be turned off by setting the kind's
    `noDefer` property to a truthy value, as is done in `enyo.Object`,
    `enyo.Component`, and `enyo.Control`.

    In a related development, kinds may now define "protected statics".  These
    are static members designed for use only within the given kind and its
    subkinds.  The presence of protected statics will not prevent the deferral
    of kind creation, whereas the presence of regular statics will.

    Finally, as a result of these modifications, in the configuration object
    passed into `enyo.kind()`, the value of the `kind` property will need to be
    quoted (e.g., `kind: "enyo.Control"`).  Previously, the quotation marks
    were optional.

* To improve performance, modified internal code in Enyo Core so that override
    methods use `enyo.super()`, following the double function pattern outlined
    by [dcl.js](http://www.dcljs.org/docs/general/supercalls/).  Application
    code will continue to use the existing `this.inherited()` syntax.

* Made several significant additions to `enyo.Component`:

    + New `componentOverrides` property simplifies the creation of subkinds by
        letting developers alter items in the superkind's `components` block
        without having to copy all of the block's contents into the subkind.

    + New methods `startJob()` and `stopJob()` are used to manage job methods
        that should be associated with a specific component; they are
        automatically stopped if the component is destroyed.

    + New `throttleJob()` method allows you to execute a method immediately and
        then prevent the method from being called again for a specified period
        of time.

    + New `silence()` and `unsilence()` methods are used to stop and restore
        event propagation through the component.  This is useful when you're
        changing a lot of properties and want to keep observers from reacting to
        `changed` events until all of your work is complete.

* Added support for progress events during asynchronous activities.  Progress
    events are sent by `enyo.Async.sendProgress()` and handled by
    `enyo.Ajax.updateProgress()`.  Also added associated unit test.

* Added HTML5 fullscreen support to Enyo controls.  Changes include modification
    of `Control.js` and additions of `fullscreen.js` and "FullscreenSample".
    (This is temporarily disabled for webOS because it isn't working yet on the
    OS side.)

* Added support for loading framework source from embedded on-device location.

* Added new kinds `enyo.Media` and `enyo.Audio`.  Also added `enyo.Anchor`,
    which implements an HTML anchor (`<a>`) tag; `title` and `href` are
    available as published properties.

* Moved code for drawers, previously in `onyx.Drawer`, into the core Enyo `ui`
    library as the new kind `enyo.Drawer`.  Also added new
    `onDrawerAnimationEnd` event, which may be used to detect changes in the
    drawer's open/closed status.

* Moved `focus()` and `blur()` methods from `enyo.Input` to `enyo.Control`,
    since they are generally useful for any DOM node.  Also added protected
    property `rtl`, which indicates direction of layout, to `enyo.Control`.  It
    should be set to `true` for right-to-left scripts (default is `false`).
    This property will typically only be used by developers who are creating
    their own subkinds of `enyo.Control`.

* Added `enyo.design`, which is used to specify design information for the Ares
    designer tool.

* Added new `version.js` file, which defines `enyo.version`, a string that
    indicates the framework version (currently, `2.3.0-pre.7-dev`).  Then, added
    `version.js` to list of boot scripts in `enyo.js` (so that `enyo.version` is
    available to non-minified files) and to list of dependencies in `package.js`.

* Added `jobs.js`, which defines `enyo.jobs`, a low-level mechanism for queueing
    tasks and sorting them by priority.  Normally, it will not be used by
    application code.  Also added related sample, "AnimatorSample".

* In `enyo.Object`, added new `bindSafely()` method, which acts like
    `enyo.bind()`, but handles the case in which the bound method is called
    after the object has been destroyed.  Also, in `set()` method, added
    documentation for optional `force` parameter; if true, the property whose
    value is being set will be updated (and notifications will be sent) even if
    the passed-in value is the same as the existing value.

* In `job.js`, added `enyo.job.throttle()`, which enables job throttling outside
    the context of a specific component.

* In `dispatcher.js`, added `enyo.dispatcher.stopListening()`, which removes
    listeners for a particular kind of event, and `enyo.unmakeBubble()`, which
    stops listening for events bubbled by `enyo.makeBubble()`.  Also added
    support for `animationEnd` and `webkitAnimationEnd` events.

* Renamed `phonegap.js` as `cordova.js` and modified `enyo.ready()` to add
    listener for `deviceready` event before setting up signals for other Cordova
    events.  Also added Enyo support for the `localechange` event supplied by
    cordova-webos (i.e., signals will be sent).

* In `loader.js` and `boot.js`, fixed issue causing `enyo.load()` to not wait
    until all files have loaded before calling the callback function.

* In `boot.js`, changed `enyo.ready()` to call `enyo.asyncMethod()` instead of
    `run()`, to guarantee that all callbacks are asynchronous.  Also added
    "charset"` to the generated script elements for Internet Explorer.

* Added new method `enyo.easedComplexLerp()` in `animation.js` and put it to use
    in `Animator.next()`.  The new method allows for more complex animations
    than are possible with the existing `enyo.easedLerp()`.

* In `enyo.Async`, fixed issue causing exceptions when setting properties on the
    subkind `enyo.Ajax`.  (The `constructor()` method was missing a call to
    `this.inherited(arguments)`.)

* In `enyo.Ajax`, changed `contentType` check from exact string match to regular
    expression, to allow values such as `'application/json; charset=utf-8'`.
    Also removed check for webOS platform when determining whether synchronous
    (blocking) AJAX requests are allowed.

* Added `overrideCallback` property to `enyo.JsonpRequest`, along with inline
    documentation and associated unit test.

* In `xhr.js`, fixed `request()` to only apply cache-control code to iOS 6,
    not to iOS versions greater than 6.

* In `modal.js`, updated `release()` to search for a passed-in target to
    release from the list of captured events, instead of simply releasing the
    last captured event.  This fixes an issue in which popups could close
    unexpectedly.

* In `FloatingLayer.js` and `Popup.js`, modified `enyo.FloatingLayer` so it
    recreates itself when `document.body` is wiped out by a fresh render.

* Added detection of webOS 4/Open webOS, Tizen, BlackBerry PlayBook, and
    Internet Explorer 11 platforms to `platform.js`.

* In `Oop.js`, fixed issue in `enyo.kind.features.push()` that could allow
    feature mixins to be run more than once, overwriting the custom subclass
    method.  Also added `enyo.kind.allowOverride` flag for use in Ares; it
    allows flagged kinds to be redefined.

* In `UiComponent.js`, modified `getBubbleTarget()` to allow events to bubble
    properly from a control to an owning component that is not a UiComponent.
    Also fixed issue in which setting the `addBefore` property could update the
    `children` array but not update the `controls` array with the same ordering.

* In `Repeater.js`, updated `decorateEvent()` to prevent index value from being
    overwritten when dealing with nested repeaters.

* In `RichText.js`, updated `valueChanged()` to prevent scroll reset on
    keypress.  Also added proper support for `disabled` property, including new
    `disabledChanged()` method.

* In `enyo.Image`, added new published property `alt`, which corresponds to the
    `"alt"` attribute of an HTML `<img>` tag.

* Modified core code so that IE8 passes unit tests.  Also, fixed positioning
    issues affecting IE8 in `dom.js`.

* Also in `dom.js`, added methods `enyo.dom.hasClass()`, `enyo.dom.addClass()`,
    and `enyo.dom.removeClass()`.  Put the new methods to use in `enyo.Control`
    to prevent duplication of effort across multiple renders.

* In `drag.js`, reworked code for cloning events in `beginHold()`, as it was
    causing crashes in `ImageView`.

* In `lang.js`, added fast implementations of `enyo.setPath()` and
    `enyo.getPath()` that only work with local property names.  These are used
    internally by a new unit test for published properties; they are not for
    public use.
    
    Also fixed `enyo.getPath()` to return null if path is not defined.

* In `langTest.js`, added tests for `enyo.isObject()` and `enyo.isArray()`.

* In `ready.js`, added legacy WebKit support for `enyo.ready()`.

* Fixed `enyo.Drawer` and "GestureSample" to stop propagation of animation
    events.

## Onyx

* Added new `onyx.Submenu` kind, which enables the creation of nested menus.
    Instances are meant to live alongside `onyx.MenuItem` objects within an
    `onyx.Menu`.

* Added `version.js` file, which specifies current version of Onyx library
    (`enyo.version.onyx`).  Initial value is `2.3.0-pre.7-dev`.  Also added
    `version.js` to list of dependencies in `package.js`.

* In `onyx.Menu`, added support for specifying a menu's scroll strategy.

* Added `onyx.design`, which is used by libraries to specify their associated
    design information.  It replaces `design.js` and is discoverable via
    `package.js`. 

* Moved `onyx.Drawer` from Onyx library into Enyo core, as `enyo.Drawer`, with
    `onyx.Drawer` now aliased to `enyo.Drawer`.

* Cleaned up code for better compatibility with JSHint 2.1, which is used in
    Travis CI tests.

* In `Popup.js`, modified `getScrimZIndex()` to ensure selection of proper
    z-index values for popups that should appear on top of other popups.  Also
    made static fields protectedStatic to hide their internal state.

* In `ContextualPopup.js`, added ability to set `ontap` handlers for the action
    buttons.

* Tweaked the `Button`, `IconButton`, and `Slider` controls to work better on
    FirefoxOS.

* In `DatePicker.js`, fixed issue causing DatePicker controls to be unusable
    inside a Repeater.

* In `IntegerPicker.js`, fixed max/min validation in `valueChanged()`.

* In `MoreToolbar.js`, fixed issue that could cause a crash when resizing a
    window.

* In `TimePicker.js`, moved check for null `is24HrMode` property after
    globalization/localization code.

## Layout

* Added several new layout-related kinds:

    + `enyo.ContextualLayout`, a layout strategy intended for use in a popup in
        a decorator/activator scenario, where the popup is positioned relative
        to the activating control

    + `enyo.FittableHeaderLayout`, a subkind of `enyo.FittableColumnsLayout` in
        which items are laid out in a set of naturally-sized vertical columns,
        with one column designated to expand horizontally to fill any leftover
        space

    + `enyo.GridList`, which extends `enyo.List` to display items in a grid
        pattern, with multiple items per row based on the available container
        width

    + `enyo.GridListImageItem`, a convenience component that may be used inside
        an `enyo.GridList` to display an image grid

    + `enyo.GridFlyweightRepeater`, which extends `enyo.FlyweightRepeater` to
        display items in a grid pattern

* Added `version.js` file, which specifies current version of Layout library
    (`enyo.version.layout`).  Initial value is `2.3.0-pre.7-dev`.  Also added
    `version.js` to list of dependencies in `package.js`.

* Added `layout.design`, which contains information on the layouts available in
    the Layout library; it replaces `design.js` and is loaded by default.

* Added library manifest file, `deploy.json`.

* In `enyo.List`, added support for horizontal layouts; also removed
    unnecessary call to `inEvent.preventDefault()`.

* In `enyo.Scroller`, updated documentation for `getScrollBounds()` method.

* In `enyo.Panels`, added method `selectPanelByName()`, which selects a pane
    based on its name instead of its index.  Also fixed `removeControl()` to
    correctly update the active panel if you remove the one that's currently
    selected, as well as addressing issue causing problems with panel transition
    animations.

* Modified `enyo.Arranger` to allow panels to opt out of acceleration/transform
    on a per-instance basis.  Also allowed sliding panel acceleration to be set
    to `auto`.

* In `FittableLayout.css`, added special case for tables in a
    FittableColumnsLayout.  Also added special case for locales with
    right-to-left text alignment.

## Canvas

* Added `version.js` file, which specifies current version of Canvas library
    (`enyo.version.canvas`).  Initial value is `2.3.0-pre.7-dev`.  Also added
    `version.js` to list of dependencies in `package.js`.

* Added library manifest file, `deploy.json`.

## Globalization/Localization

* Introduced `enyo-ilib`, a wrapper for the [ilib](www.jedlsoft.com)
    globalization/internationalization library.  This is a replacement for the
    now-deprecated `g11n` library.

* Fixed `deploy.sh` to not create duplicate subdirectories.

## Bootplate

* Introduced new `bootplate-mvc` repo, an application template using the new
    MVC pattern.

* In `deploy.sh`, fixed issue causing problems when development path name
    contains whitespace.

* In `.gitmodules`, replaced absolute URL paths to github.com with relative
    paths to allowing forking of the project.

## Samples

* Added new samples "DataListSample", "DataRepeaterSample", and
    "ComponentOverrideSample".

* Removed obsolete "Playground" sample.

* In `sampler` repo's `.gitmodules` file, replaced absolute URL paths to
    github.com with relative paths to allowing forking of the project.

* In Sampler app's `App.js` file, added platform checks for improved
    compatibility with Windows 8 and Windows Phone 8.  Also made fix to not
    clobber existing namespaces.

* Updated samples with "no telephone number detection" and "no translation"
    meta tags.

* In "ButtonSample", modified sample control to use `.png` file instead of
    `.ico` file for improved compatibility with Windows Phone 8 browser.

* In "PlatformSample", modified `updateWindowSize()` for improved compatibility
    with IE8.

* In "RepeaterSample", modified `setupItem()` to stop event propagation.

* Fixed "ListPulldownSample" to work properly as a Windows 8 application.

* In "ContextualPopupSample", fixed double-inclusion of Onyx source.

* Revised "PopupSample" to test fix for unexpected dismissal of popups.

## Tools

* Added support for Travis CI continuous integration system, which uses JSHint
    and PhantomJS to run tests on repos after each commit.

* Added `.jshintrc` files to the root folder of most repos; these are now used
    when writing new code and validating old code.  Set `"es3": true` so that
    JSHint detects trailing commas.  (Subsequently removed trailing commas from
    a number of source files.)

* Updated minifier support in Enyo to use `less 1.3.3` and `uglify-js 2.2.5`.
    Flag tweaks should result in ~5% reduction in gzipped-file size.

* Added support for new `"beautify"` option in minification and deployment
    scripts, `tools/minify.js` and `tools/deploy.js`.  When this switch is
    activated (by specifying `-B` on the command line), the scripts will create
    output files in which line breaks are not removed from code.  The
    improvement in human-readability makes the beautified files useful for
    debugging.

* Made numerous changes to enable use of `deploy.js` and `minify.js` outside of
    the source tree.
    
 * In `deploy.js`, added support for manifest file (`deploy.json`).  Also added
    `-T`/`--test` switch to generate a build directory in the source tree for
    testing.

## Work in Progress

The following components are considered "Work-in-Progress" (WIP), meaning code
has been committed but is still under development and should not be considered
API-stable.

All WIP components are included in a `wip-package.js` rather than the standard
`package.js`, so apps will not have access to these kinds by default.  If you
need to use them, you may include the relevant `wip-package.js` file in your
app, but be aware that breaking changes are likely.

* Layout

    - `enyo.FlexLayout` and related kinds