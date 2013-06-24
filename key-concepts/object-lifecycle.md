# Object Lifecycle

## Lifecycle Methods in Enyo

### A Trivial Kind

Remember that Enyo kinds use regular JavaScript prototypes. A trivial kind has a
simple lifecycle:

        var MyKind = enyo.kind({
            kind: null, // otherwise it will default to 'Control'
            constructor: function() {
                // do any initialization tasks
            }
        });

That's it.  Now `MyKind` is a function that you can use with the `new` operator
to create instances.  The `MyKind` function is a copy of a boilerplate function
that will call your (optional) `constructor` function.

        myInstance = new MyKind();

Like all JavaScript objects, a kind instance is garbage-collected when there are
no references to it. 

**Note:** While the `Component` and `Control` kinds have some advanced features,
`enyo.kind()` itself is fairly simple.

### Inheritance: this.inherited()

It's possible to base a kind on another kind.  The new kind inherits all the
properties and methods of the old kind.  If you override a method from the old
kind, you can call the overridden method using `inherited()`:

        var MyNextKind = enyo.kind({
            kind: MyKind,
            constructor: function() {
                // do any initialization tasks before MyKind initializes
                //
                // do inherited initialization (optional, but usually a good idea)
                this.inherited(arguments);
                //
                // do any initialization tasks after MyKind initializes
            }
        });

`MyNextKind` starts with all the properties and methods of `MyKind`, but then we
override `constructor()`.  Our new constructor can call the old constructor
using the `this.inherited(arguments)` syntax.  `MyNextKind` can decide what
things to do before or after calling the old constructor, or can choose to not
call the old constructor at all.

This override system is the same for any method, not just for `constructor()`.

Note that you could call an inherited method using only raw JavaScript, like so:

        MyKind.prototype.<method name>.apply(this, arguments);

The `this.inherited` syntax is shorter and removes the need to specify the
superkind's name (in this case, `MyKind`).

Also note that `arguments` is a [JavaScript
built-in](https://developer.mozilla.org/en/JavaScript/Reference/Functions_and_function_scope/arguments)
whose value is a pseudo-array of the arguments passed to the currently executing
function.

### Components: create() and destroy()

All kinds may have constructor methods as described above.  The `Component` kind
adds several new lifecycle methods, most notably `create()` and `destroy()`:

        var myComponent = enyo.kind({
            kind: enyo.Component,
            constructor: function() {
                // low-level or esoteric initialization, usually not needed at all
                this.inherited(arguments);
            },
            create: function() {
                // create is called *after* the constructor chain is finished
                this.inherited(arguments);
                // this.$ hash is only available *after* calling inherited create
            },
            destroy: function() {
                // do inherited teardown
                this.inherited(arguments);
            }
        });

Technically, `create()` differs from `constructor()` in that the `constructor`
call finishes completely (including any chain of inherited calls) before
`create()` is called, but normal initialization may be done in either method. 

For convenience, most components can simply ignore `constructor()` and rely on
`create()`.

The other important feature of `create()` is that the `this.$` hash is ready
after `Component.create()` has executed.  This means that an override of
`create` is generally where you would do initialization tasks for owned
components.  For example:

        components: [
            {kind: "MyWorker"}
        ],
        create: function() {
            this.inherited(arguments);
            // put MyWorker to work
            this.$.myWorker.work();
        }

Components frequently reference other components.  In the example above, the
`MyWorker` instance is referenced by `this.$.myWorker`.  The `destroy()` method
cleans up these references and allows component to be garbage-collected.
Component kinds also put general cleanup code in `destroy()`.

        destroy: function() {
            // stop MyWorker from working
            this.$.myWorker.stop();
            // standard cleanup
            this.inherited(arguments);
            // this.$ hash is empty now
        }

**Note:** If you've made a custom reference to a component that is not cleaned
up by a `destroy()` method, then calling `destroy()` will not actually make that
object subject to garbage collection.  For this reason, there is a
`this.destroyed` flag on each component.  If `this.destroyed` is `true`, the
Component has been uninitialized and the reference should be removed.

### Controls: hasNode() and rendered()

`Control` is a kind of component, so controls have the same `constructor()`,
`create()`, `destroy()` system described above, but the `Control` kind
introduces a few more methods for managing its representation in the DOM. 

`Control` is designed so that most of its methods and properties can be used
without regard to whether there is a corresponding DOM node or not.  For
example, you can call

        this.$.control.applyStyle("color", "blue");

If the control is rendered, that style is placed in the DOM; if not, the
information is stored until the DOM is created.  Either way, when you see it,
the text will be blue.

There are certain things you cannot do unless DOM has been created.  Obviously,
you cannot do work directly on a `DomNode` if there is no DOM.  Also, some
methods (e.g., `getBounds()`) return values measured from DOM, so if there is no
DOM, you won't get accurate values.

In a control, if you need to do something immediately after the DOM is created,
you can do that in the `rendered()` method:

        rendered: function() {
            // important! must call the inherited method
            this.inherited(arguments);
            // this is the first moment bounds are available
            this.firstBounds = this.getBounds();
        }

Another important thing to note here is that even though DOM elements have been
created when `rendered()` is called, the visual representation of these elements 
in the browser is generally not visible yet.  Most browsers will not update the
display until Enyo yields the JavaScript thread.  This means you have the
ability to make changes to the DOM in `rendered()` without causing annoying
flashes.

Whenever you need to access a control's DOM node directly, use the `hasNode()`
method:

        twiddle: function() {
            if (this.hasNode()) {
                buffNode(this.node); // buffNode is made-up
            }
        }

Remember that even if DOM is rendered, `this.node` may not have a value.  A
truthy result from `hasNode()` means `this.node` is initialized.  Even within
`rendered()`, you need to call `hasNode()` first:

        rendered: function() {
            this.inherited(arguments); // important! must call the inherited method
            if (this.hasNode()) {
                buffNode(this.node);
            }
        });

### When Controls Are Rendered

In general, controls are not rendered until you you explicitly say so.  Most
applications have a `renderInto()` or `write()` method at the very top that
renders the controls in the application.

Also, when creating controls dynamically, Enyo will not render those controls
until you call `render()` on them, or on one of their containers.  You will
often see code like the following:

        updateControls: function() {
            // destroy controls we made last time 
            // ('destroyClientControls' destroys only dynamic controls;
            // 'destroyControls' destroys everything)
            this.destroyClientControls(); 
            // create new controls
            for (var i=0; i<this.count; i++) {
                // created but not rendered
                this.createComponent({kind: "myCoolControl", index: i});
            }
            // render everything in one shot
            this.render();
        });

Destroying a control will cause it to be removed from the DOM right away, as
this is a necessary part of the cleanup process.  There is no `unrender()`
method.

### A Note About Kind Names

The preceding examples use this syntax for creating kinds:

        var MyKind = enyo.kind(...);

In most Enyo code, however, you'll see the following:

        enyo.kind({
            name: "MyKind"
            ...
        });

Here the inclusion of a `name` property is optional.  If you include it, Enyo
will make a global reference to your kind using that name, which will be
available in instances as `this.kindName`.  The `name` syntax is used mostly to
take advantage of these conveniences. For example, instead of

        var foo = {
            kinds: {
                MyKind: enyo.kind(...);
            }
        }

one can write

        enyo.kind({
            name: "foo.kinds.MyKind",
            ...
        });