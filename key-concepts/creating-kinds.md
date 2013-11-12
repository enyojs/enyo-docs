% Creating Kinds

## enyo.kind

[enyo.kind(inProps)](../api.html#Oop.js) is the Enyo framework's
method for generating kinds.  A kind, you'll recall, is a
constructor-with-prototype (like a class) that has advanced features like
prototype-chaining (inheritance).

A plug-in system is included for extending the abilities of the kind generator,
and constructors are allowed to perform custom operations when subclassed.

In this article, we look at several things that happen when `enyo.kind` is
invoked. To learn about what happens once you have an instantiated object, see
[Object Lifecycle](object-lifecycle.html).

## Special Property Names

Generally, the properties defined in the passed-in `inProps` object are copied
directly to the	generated prototype, but certain property names trigger special
processing.	Some examples of special properties are:

* `name`: Defines the name of the created constructor in
	the global namespace (intermediate objects are created automatically).
	`name` is not copied directly to the prototype,	but is instead stored as
	`kindName`.

        // Create a function MyNamespace.MyKind with a prototype.
        // MyNamespace.MyKind.prototype.kindName is set to "MyNamespace.MyKind".
        // MyNamespace.MyKind.prototype.plainProperty is set to "foo".
        enyo.kind({
            name: "MyNamespace.MyKind"
            plainProperty: "foo"
        });
        // Make an instance of the new kind.
        var myk = new MyNamespace.MyKind();

* `kind`: The name of, or a reference to, a kind to derive from, like a superclass.
	The new constructor's prototype is chained to the prototype specified by
	`kind`, and the `base` property in the new prototype is set	to reference the
	`kind` constructor.

        // Create a function MyKind with a prototype, derived from enyo.Object.
        // MyKind.prototype.kindName is set to "MyKind".
        // MyKind.prototype.base is set to enyo.Object.
        enyo.kind({
            name: "MyKind",
            kind: enyo.Object
        });

* `constructor`: A function to call when a new instance is created; it is
    actually stored on the prototype as `_constructor`.

        // Create a function MyKind with a prototype, derived from enyo.Object.
        // _constructor_ is called when an instance is created. 
        enyo.kind({
            name: "MyKind",
            kind: enyo.Object,
            constructor: function() {
                this.instanceArray = [];
                // Call the constructor inherited from Object
                this.inherited(arguments);
            }
        });

* `statics`: Properties from any `statics` object are copied onto the
    constructor directly, instead of the prototype.

        // Create a kind with a static method.
        enyo.kind({
            name: "MyKind",
            statics: {
                info: function() {
                    return "MyKind is a kind with statics.";
                }
            }
        });
        // Invoke the static info() method of MyKind.
        console.log(MyKind.info());

* `protectedStatics`: Introduced in Enyo 2.3, protected statics are statics
    that are meant for use only within the kind in which they are declared, or
    in code that derives from that kind.

    Unlike public statics, protected statics won't prevent the deferral of a
    kind's creation.  Deferral is not possible for kinds containing public
    statics because of the potential for the public statics' being used before
    any instances of the kind exist.

Certain kinds in the framework define their own special properties, e.g., the
`published` property supported by [enyo.Object](../api.html#enyo.Object).

## this.inherited

`this.inherited` allows you to easily call the superkind method for any method
that has been overridden:

        enyo.kind({
            name: "MyKind",
            doWork: function() {
                this.work++;
            }
        });

        enyo.kind({
            name: "MyDerivedKind",
            kind: "MyKind",
            doWork: function() {
                if (this.shouldDoWork) {
                    this.inherited(arguments);
                }
            }
        });

The first argument to `this.inherited` must be the literal `arguments`, which is
a special JavaScript variable containing information about the executing function.

For more information on the proper usage of `this.inherited`, see [Object
Lifecycle](object-lifecycle.html).

**Additional Reading**

* [Event Handling](event-handling.html)
* [Objects and Published Properties](objects-and-published-properties.html)