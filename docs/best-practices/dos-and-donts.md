% Enyo Dos and Don'ts

A while back, the Framework Team began keeping a list of items for team members
to consider before submitting code for peer review.  As the list grew, we
realized that it could be useful to the wider community of app developers.  Thus
we are pleased to present the current document.

The content is divided into sections aimed at particular groups of developers;
we begin by addressing a general audience, then move on to discuss the more
specialized responsibilities of those creating shared code.  We suggest that you
start reading at the beginning and stop when the content no longer seems
relevant to your specific role.

## I'm Developing an Enyo/Moonstone Application...

Welcome to the team!  Here are some things that all developers should keep in
mind when writing apps using Enyo and Moonstone:

* **Don't break encapsulation.**

    * Avoid using `$` more than once on a given line:

        ```javascript
            this.$.child.$.childsChild    // bad idea
        ```

    * Don't reach into the parent's other components:

        ```javascript
            this.parent.$.parentsChild    // also a bad idea
        ```

    For more on this topic, see [Encapsulation in Enyo](encapsulation-in-enyo.html).
     
* **Most published properties should have change handlers (or data bindings).**

    A common bug occurs when a property is used only at create/render time;
    later, when someone calls `set("myProperty", <myValue>)`, nothing happens
    because there is no change handler to enable the property to change at
    runtime.

    This situation can easily go undetected.  Samples may look fine because the
    properties are passed in at create time.  The normal pattern is to put the
    code that uses a property in a change handler, and to call that handler from
    `create()` (or from `render()`, if the handler needs to send events--see the
    following).

* **Do not send events from `create()`; if initial events must be sent, send them
    from `render()`.**

    The problem with sending events from `create()` is that event handlers in
    the owner or elsewhere often need to reference other components.  `create()`
    is called as items are being created, meaning that at the time Component A's
    `create()` is called, all components after it (e.g., Components B and C)
    have yet to been created.  As a result, if you have a handler for A's event
    that references `this.$.B`, it will throw an undefined error.

    Firing initial events from `render()` is safer, since all components have
    been created by the time `render()` is called.

* **Handlers for `onSetupItem` events should usually return `true`, stopping
    propagation of the event.**
    
    Failure to return `true` may cause problems with nested repeaters or lists,
    and will certainly make the program run more slowly due to the extra
    dispatching taking place for each item.

* **Don't create unnecessary `Signals` instances.**

    When you have a component that needs to listen for several different
    signals, the component only needs to include one instance of `enyo.Signals`.
    That one instance may register as a listener for multiple signals.  (For
    details, see [Event Handling](../key-concepts/event-handling.html).)

* **Try to minimize your use of Fittables.**

    When possible, do layout using CSS styles rather than Fittables; CSS-based
    layout is faster because it avoids the JavaScript overhead that comes with
    `FittableRows` and `FittableColumns`.  If you decide to use Fittables,
    remember to set `fit: true` on the row or column that you want to expand.

* **Don't set `font-face` directly.**

    Latin and Non-Latin fonts use different font faces.  The framework sets the
    font face as needed; as an application developer, you should not need to
    concern yourself with this.

* **Remember that Moonstone includes both a dark theme and a light theme.**

    The dark theme, with white or gray text on a black background, is the
    default.  To use the light theme (which features dark text on a gray
    background), open your app's `package.js` file and replace `$lib/moonstone`
    with `$lib/moonstone/light-package.js`.

* **Use shortcuts for shared paths.**

    When you need to specify the path to a shared resource, remember that the
    framework supports a number of shortcuts for commonly-used locations (such
    as `$tv-common` in the following example):

    ```javascript
        this.$.channelSource.setSrc("$tv-common/assets/banner/banner_input_icon_tv.png");
    ```

* **Test for right-to-left compatibility.**

    Setting the CSS class `enyo-locale-right-to-left` on a control will activate
    any specialized behavior it supports for right-to-left scripts.

* **Use your browser for debugging.**

    It's typically much easier to debug a JavaScript app running in a browser
    than one running on any kind of hardware, so we recommend that you debug in
    the browser to the extent that that's possible.  For a detailed discussion
    of this topic, see [Browser-Based
    Debugging](../building-apps/testing-and-debugging/browser-based-debugging.html). 

* **Refactor your code.**

    There are many good reasons to refactor your application code.  One to
    remember in the context of Enyo and Moonstone is that refactored code will
    typically yield smaller file sizes for the final, optimized version of your
    application.

## I'm Creating Custom Widgets for My App...

Unless you're working on an app by yourself, your code is likely to be used by
at least a few of your colleagues.  Here are some things to remember when
creating shared code:

* **Use familiar naming.**

    When naming a property or defining a new API, look at similar kinds that
    have already been implemented and, where possible, try to use the same
    naming.  (When you can't use the same naming, use new names that are
    consistent with existing ones.)  By limiting the complexity of Enyo's
    vocabulary, we allow programmers to have more accurate expectations of how
    our objects will work, thus reducing the amount of new learning necessary.

* **Remember to include inline API documentation.**

    All Enyo APIs are documented with comments in JSDoc format.  If you create a
    new kind, be sure to include a summary the top, including a description of
    the kind and a brief code sample (if appropriate).  In addition, add inline
    comments for all published properties, public events (including event
    properties), and public methods.  When commenting your code, use the
    existing comments as a guide.

    For more details, see [Documenting Code for the API
    Viewer](api-tool.html#documenting-code-for-the-api-viewer).

* **Prefix all CSS classes with the name of the widget you are developing.**

    All CSS classes should be scoped to the widget you are developing;
    otherwise there is a high likelihood of collisions.  For example, if two
    widgets define a `.button-overlay` class, the second definition will wipe
    out the first.

    Instead, create CSS classes that are specific to your widget, e.g.,
    `.mywidget-button-overlay` or `.mywidget .button-overlay`.

* **Don't assume you that know what type a component's client controls will be.**

    For example, `this.children[0].aFunction("foo");` is bad.  Particularly in
    decorator patterns (e.g., InputDecorator), it's tempting to assume that a
    developer will always put a particular type of object (like an Input)
    inside.  But the developer should be free to put an IconButton in the
    decorator alongside the Input, or to wrap the Input inside another control
    within the decorator.

    Don't limit the freedom of developers to be creative.  Typically, this may
    be avoided through the judicious use of events (bubbling up and waterfalling
    down).

* **If your kind contains controls that should not be deleted by the user, create
    those controls as chrome (i.e., in your kind definition).**

    When a developer instantiates your kind and calls `createComponent()` to add
    new controls to the instance, those controls are created as client controls,
    which may be freely added or removed as needed.

    By contrast, when you specify components in your kind definition, they are
    created as chrome controls (i.e., the `isChrome` flag is true); unlike client
    controls, chrome controls are built into the widget and cannot be directly
    modified by the user.  The `destroyClientControls()` method allows the user
    to destroy all of the client (user-added) controls without affecting the
    internal chrome controls.

    If you need to create chrome controls dynamically at runtime (e.g., in
    `create()`), be sure to do one of the following:
    
    * Create the controls using `createChrome()` instead of `createComponent()`; or

    * Set `isChrome: true` on each control before passing it to `createComponent()`
    
    Controls created in either of these ways will be treated as chrome, and will
    not be affected by calls to `destroyClientControls()`.

* **Update any cached size/position data in resizeHandler.**

    One common bug occurs when the results of size/position calculations (e.g.,
    calls to `getBounds()`) are made and cached in `rendered()`, but are not
    refreshed when the component is resized/reflowed.

* **Avoid sending `onChange`-type events initially.**

    Although arguments could be made either way, the general direction we have
    chosen is to not send `onChange`-type events when setting a property's
    initial value, only when the value changes after render.

* **Don't re-invent the wheel with utility functions.**

    All framework developers should familiarize themselves with the many useful,
    cross-platform-compatible utilities provided by `enyo.lang`, `enyo.dom`,
    `enyo.Component`, `enyo.UIComponent`, and `enyo.Control`.  Whether you need
    to check whether one component is a descendant of another, convert a style
    string into an array (and back), or filter an array of data, chances are
    good that someone else has already had to do something similar.  And that
    person might well have built the functionality you need into the framework.

## I'm Contributing Code to the Enyo Framework...

Great!  In that case, you're creating code that will definitely be used (or, in
the case of samples, studied) by others.  We have some special words of advice
for you, beyond what has already been discussed:

* **Don't commit "commented-out" code.**

    You make a weak statement when you commit commented code--either you forgot
    to uncomment something you were testing, or you weren't willing to remove
    the comment completely because you were unsure about it.  In the former
    case, it's a bug; in the latter case, you shouldn't be committing code that
    you have doubts about.

    Don't leave comments in for "history"--our version control system already
    tracks commit history.  If you removed something and want to make sure that
    someone else doesn't add it back, leave a comment describing what was
    removed and why, instead of leaving a cryptically commented line of code.

* **Don't commit debug console log statements.**

* **Be sure that every commit includes the Enyo DCO signoff line:**

    ```
        Enyo-DCO-1.1-Signed-Off-By: <Your Name> (<your email address>)
    ```

* **Add unit tests where possible.**

    Any major code changes to the Enyo library should have one or more
    corresponding unit tests.  In addition, any new UI kind needs at least one
    sample that exercises all of the kind's properties.

* **Keep samples simple.**

    If you are creating a sample and need to use a lot of custom CSS/JavaScript
    to make the widget look good or function correctly, the widget probably
    needs more work to make it more generally usable.  Samples should exercise
    all of a control's functionality while using as little custom code as
    possible.

* **Don't include default properties on components used in samples.**

    Developers WILL copy and paste code from samples, so if you define a
    property on a kind, developers will assume they need to do the same.
