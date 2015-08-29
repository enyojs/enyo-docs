% Kinds

## enyo.kind()

[enyo.kind(inProps)]($api/#/namespace/enyo.kind) 是 Enyo 框架的方法用来生成
种类。种类是用原型的构造函数（像类），它有一些高级特性，如原型链（继承）。

为了扩展种类生成器的能力，包括了一个插件系统，同时当生成子类时，构造函数允许
执行定制操作。

在文本中，我们将看看在调用 `enyo.kind()` 时发生的几件事情。要知道当有一个实
例化对象后发生了什么，可以看
[对像和发布的属性](objects-and-published-properties.html) 和
[组件](components.html).

## 特殊的属性名

通常在传递进的 `inProps` 对象中定义的属性是直接复制到生成的原型中，但是有些属性
名会触发一些特殊的流程。一些特殊属性的例子如下：

* `name`: 在全局名字空间（中间对象是自动创建的）定义了创建的构造函数。`name`
    不是直接复制到原型中，它是以 `kindName` 的方式存储。

    ```javascript
        // Create a function myNamespace.MyKind with a prototype.
        // myNamespace.MyKind.prototype.kindName is set to "myNamespace.MyKind".
        // myNamespace.MyKind.prototype.plainProperty is set to "foo".
        enyo.kind({
            name: "myNamespace.MyKind"
            plainProperty: "foo"
        });
        // Make an instance of the new kind.
        var myk = new myNamespace.MyKind();
    ```

* `kind`: 从哪里继承的种类名，或者指向这个种类名，象超类。新的构造函数原型会链
    传递到 `kind` 指定的原型superclass.  The new constructor's prototype is chained to the prototype
    specified by `kind`, and the `base` property in the new prototype is set to
    reference the `kind` constructor.

    ```javascript
        // Create a function MyKind with a prototype, derived from enyo.Object.
        // MyKind.prototype.kindName is set to "MyKind".
        // MyKind.prototype.base is set to "enyo.Object".
        enyo.kind({
            name: "MyKind",
            kind: "enyo.Object"
        });
    ```

* `constructor`: An optional function to call when a new instance is created; it
    is actually stored on the prototype as `_constructor`.

    ```javascript
        // Create a function MyKind with a prototype, derived from enyo.Object.
        // _constructor_ is called when an instance is created. 
        enyo.kind({
            name: "MyKind",
            kind: "enyo.Object",
            constructor: function() {
                this.instanceArray = [];
                // Call the constructor inherited from Object
                this.inherited(arguments);
            }
        });
    ```

* `statics`: Properties from any `statics` object are copied onto the
    constructor directly, instead of the prototype.

    ```javascript
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
    ```

* `protectedStatics`: Introduced in Enyo 2.3, protected statics are statics that
    are meant for use only within the kind in which they are declared, or in
    code that derives from that kind.

    Unlike public statics, protected statics won't prevent the deferral of a
    kind's creation.  Deferral is not possible for kinds containing public
    statics because of the potential for the public statics' being used before
    any instances of the kind exist.

Certain kinds in the framework define their own special properties, e.g., the
`published` property supported by [enyo.Object]($api/#/kind/enyo.Object).

## Lifecycle of a Trivial Kind

A trivial kind has a simple lifecycle:

```javascript
    var MyKind = enyo.kind({
        kind: null, // otherwise it will default to 'Control'
        constructor: function() {
            // do any initialization tasks
        }
    });
```

That's it.  `MyKind()` is now a function that you can use with the `new`
operator to create instances.

```javascript
        myInstance = new MyKind();
```

Like all JavaScript objects, a kind instance will be garbage-collected when
there are no references to it. 

## Inheritance: this.inherited()

It's common for one kind to be based on another kind.  The new kind inherits all
the properties and methods of the old kind.  If the new kind overrides a method
from the old kind, you can call the overridden method using `this.inherited()`:

```javascript
    var MyNextKind = enyo.kind({
        kind: "MyKind",
        constructor: function() {
            // do any initialization tasks before MyKind initializes
            //
            // do inherited initialization (optional, but usually a good idea)
            this.inherited(arguments);
            //
            // do any initialization tasks after MyKind initializes
            }
        });
```

`MyNextKind` starts with all the properties and methods of `MyKind`, but then we
override `constructor()`.  Our new constructor may call the old constructor
using the `this.inherited()` syntax.  The first parameter passed to
`this.inherited()` must be the literal `arguments`, which is a special
JavaScript variable containing information about the executing function.  (For
more about `arguments`, see
[developer.mozilla.org](https://developer.mozilla.org/en/JavaScript/Reference/Functions_and_function_scope/arguments).)

In its constructor, `MyNextKind` may specify things to do before or after
calling the old constructor, or it may choose to not call the old constructor at
all.

This override system works the same for any method, not just `constructor()`:

```javascript
    enyo.kind({
        name: "MyOriginalKind",
        doWork: function() {
            this.work++;
        }
    });

    enyo.kind({
        name: "MyDerivedKind",
        kind: "MyOriginalKind",
        doWork: function() {
            if (this.shouldDoWork) {
                this.inherited(arguments);
            }
        }
    });
```

Note that you could also call an inherited method using only raw JavaScript,
like so:

```javascript
    MyKind.prototype.<method name>.apply(this, arguments);
```

However, the `this.inherited()` syntax is shorter and eliminates the need to
specify the superkind's name (in this case, `MyKind`).

**Additional Reading**

* [Event Handling](event-handling.html)
* [Objects and Published Properties](objects-and-published-properties.html)
* [Components](components.html)
* [Controls](controls.html)

