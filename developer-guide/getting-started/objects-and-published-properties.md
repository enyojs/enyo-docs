% Objects and Published Properties

## enyo/CoreObject/Object

[enyo/CoreObject/Object]($api/#/kind/enyo/CoreObject/Object) implements the Enyo
framework's property publishing system.  Published properties are declared in a
hash called `published` within a call to [kind()]($api/#/module/enyo/kind).  To
get the value of a published property, call `get(<propertyName>)`; to set the
value, call `set(<propertyName>, value)`.

By convention, the setter for a published property will trigger an optional
`<propertyName>Changed` method when called.

In the following example, `myValue` becomes a regular property on the `MyObject`
prototype, with a default value of 3:

```javascript
    var
        kind = require('enyo/kind'),
        Object = require('enyo/CoreObject/Object');

    var MyObject= kind({
        name: 'MyObject',
        kind: Object,

        // declare 'published' properties
        published: {
            myValue: 3
        },

        // optional method that is called whenever set('myValue', <value>) is called
        myValueChanged: function (oldValue) {
            this.delta = this.myValue - oldValue;
        }
    });
```

Since we have declared a property-changed method (i.e., `myValueChanged`) to
observe `set()` calls on the `myValue` property, it will be called when
`set('myValue', <value>)` is called, as illustrated by the following:

```javascript
    myobj = new MyObject();
    var x = myobj.get('myValue'); // x gets 3

    myobj.set('myValue', 7); // myValue becomes 7; myValueChanged side-effect sets delta to 4
```

Property-changed methods are only called when setters are invoked with a
different value.  If you were to call `set()` a second time with the same
value, the changed handler would not be invoked:

```javascript
        myobj.set('myValue', 7); // myValue stays 7; myValueChanged is *not* called
```

Published properties are stored as regular properties on the object prototype,
so it's possible to query or set their values directly:

```javascript
        var x = myobj.myValue;
```

Note that when you set a property's value directly, the property-changed method
is not called.

## Object and Array Values

In most cases, published properties should only contain basic values, such as
numbers and strings.  If you use an array or an object as the value of a
property, the mechanism that detects changes will likely fail.  This is because
of the way that JavaScript handles comparisons between arrays and objects.

In JavaScript, two arrays or objects are not considered equal if they merely
share the same data in the same structure; they must also be the same
*instance*.  A `get(<propertyName>)` call that returns an object or array
returns a reference to the internal state, since if you then modify that object
or array, you modify the same instance that's held inside the kind instance.

You could work around this by overriding `get()` to have it use the `enyo/utils`
module's `clone()` method to make a shallow copy of the object or array.  Then,
if you pass that object into `set()`, it won't be considered equal to the
internal one, since it's a different object in memory.  However, you would have
a new problem in that the property-changed method will be called even if the two
objects have all the same contents.
