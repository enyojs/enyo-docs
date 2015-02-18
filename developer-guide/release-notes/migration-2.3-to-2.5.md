% Enyo 2.3.0-rc.24 到 2.5.0 迁移注释

To ensure a smooth transition from Enyo 2.3.0-rc.24 to Enyo 2.5.0, please review
the following list of changes that will likely require modifications to your
existing Enyo applications.

## 总览

* 在 `enyo.Control` 里，`resized()` 方法已经重命名成 `resize()`，缺省的事件处理器
   也从 `resizeHandler()` 重命名成 `handleResize()`。 如果你重载过这个事件处理器，
   你需要重命名你的重载方法为 `handleResize()`，同时如果你调用 `resized()`，你应该
   调用 `resize()`。

* The way in which bindings are initialized and resolved has been rewritten so
    that you no longer need to prefix the `to` and `from` properties with a dot
    (".").  While the old syntax will still work, it results in unnecessary
    string parsing, so you should use the new syntax for a slight boost in
    performance.

变更前：

```
bindings: [
	{from: '.myProp', to: '.$.myComponent.prop'}
]
```
变更后：

```
bindings: [
	{from: 'myProp', to: '$.myComponent.prop'}
]
```

* A new API allows components that are intended to be accessible by other
    components to set a `publish` property to `true`; the component will then be
    accessible without needing to use the `$` prefix.  Note that this should not
    be used unless the component is exposed outside the scope of its instance
    owner.

    An example of an acceptable use case would be an `enyo.Application` that
    exposes its components to other nested components.

变更前：

```
enyo.kind({
	name: 'App',
	kind: 'enyo.Application',
	components: [
		{name: 'myComponent'}
	],
	bindings: [
		{from: '.myProp', to: '.$.myComponent.prop'}
	]
});

// all other children in the app could see a binding like this
bindings: [
	{from: '.app.$.myComponent.prop', to: '.myProp'}
]
```

变更后：

```
enyo.kind({
	name: 'App',
	kind: 'enyo.Application',
	components: [
		{name: 'myComponent', publish: true}
	],
	bindings: [
		{from: 'myProp', to: 'myComponent.prop'}
	]
});

// all other children in the app could see a binding like this
bindings: [
	{from: 'app.myComponent.prop', to: 'myProp'}
]
```

* In previous versions of Enyo, it was possible to incorrectly use a kind
    constructor as a namespace.  This has been fixed, but if you were relying on
    the old behavior, you may need to make a few minor updates to your apps to
    make them function as before.

变更前：

```
// unfortunately you were able to incorrectly create a kind and then use it as your namespace,
// assigning other kinds to it and using them directly
enyo.kind({

	// now there is a constructor available for MyKind
	name: 'MyKind'
});

// then you would do something like this
enyo.kind({
	
	// you are assigning a new kind constructor to another constructor
	name: 'MyKind.MyOtherKind'
});

// in this scenario you could potentially do this
new MyKind();

// and this
new MyKind.MyOtherKind();
```

As a rule, if you can use the `new` operator, it is __not a namespace__.  Here's
an example of how to avoid this error:

```
// either explicitly or implicitly declare a namespace; this is an example of explicitly
// declaring a namespace
MyNamespace = {};

// now when we create new kind constructors, we add them to the true namespace
enyo.kind({
	name: 'MyNamespace.MyKind'
});

enyo.kind({
	name: 'MyNamespace.MyOtherKind'
});

// notice that using the new operator on the namespace would throw an error
new MyNamespace; // -> exception

// but you can safely do this
new MyNamespace.MyKind();
new MyNamespace.MyOtherKind();
```

## Utility

* The `enyo.setPath()` method now accepts a configuration hash as its third
    parameter. This affects any `set()` call on an `enyo.Object` or subkind of
    `enyo.Object`.  Backward compatibility with the boolean `force` flag has
    been maintained, but with the options hash you can set `silent` and `create`
    flags as well.  The `force` flag behaves the same as before.  Setting
    `silent: true` will prevent change notifications from being emitted, while
    setting `create: false` will prevent the path from being automatically
    created (overriding the default behavior).

* Several native JavaScript types have been polyfilled (when necessary) to allow
    us to reliably use ECMA-defined methods.  While the Enyo exposed versions
    are still available, they now call the native implementations for
    consistency.  Here is a list of Enyo methods and the native methods they now
    call.  Note that it is now preferable, for efficiency, to use the native
    implementation when possible:

	* `enyo.trim` -> `String.prototype.trim`
	* `enyo.keys` -> `Object.keys`
	* `enyo.indexOf` -> `Array.prototype.indexOf` | `String.prototype.indexOf`
	* `enyo.lastIndexOf` -> `Array.prototype.lastIndexOf` | `String.prototype.lastIndexOf`
	* (new) `enyo.findIndex` -> `Array.prototype.findIndex`
	* `enyo.find` -> `Array.prototype.find`
	* `enyo.forEach` -> `Array.prototype.forEach`
	* `enyo.map` -> `Array.prototype.map`
	* `enyo.filter` -> `Array.prototype.filter`
	* (new) `enyo.where` -> `Array.prototype.find`
	
It is important to note that all Enyo Array methods have had their parameter
ordering normalized to accept the target array as the first parameter.  (These
methods are backward-compatible.)

* `enyo.find()` will now return `undefined` instead of `false`, per ECMA 6
    (ECMA-262) draft specification.

* `Object.create` polyfill has been added and is now used internally.

## enyo.ObserverSupport

* The internal mechanics of observers have been changed, yielding some
    performance gains.  As part of these changes, `addObserver()` and its (new)
    preferred alias, `observe()`, return the callee for chaining instead of the
    method passed in.  When passing in a context parameter, it no longer needs
    to bind the method.  This means that when calling `removeObserver()` or its
    (new) preferred alias, `unobserve()`, you pass the original parameters,
    including the context to be matched.

	* `addObserver` -> `observe`
	* `removeObserver` -> `unobserve`
	* `notifyObservers` -> `notify`

变更前：

```
// before, this would return the a function reference that had been bound to the context
// that was passed in
var fn = this.addObserver('prop', method, context);

// we would need to use the bound function reference to remove it
this.removeObserver('prop', fn);
```

变更后：

```
// now we do not need to store the reference to the bound method to remove it
this.observe('prop', method, context);

// we simply call it the same way
this.unobserve('prop', method, context);
```

* There is a new preferred way of declaring observers in a kind--as an array
    (the previous structure is still available, but has been deprecated):

变更前：

```
observers: {
	observerMethod: ['triggeredBy']
}
```

变更后：

```
observers: [
	// path can be an array if it is more than one property
	{method: 'observerMethod', path: 'triggeredBy'}
]
```

## enyo.RegisteredEventSupport

* Added alias as `enyo.EventEmitter`

* Added preferred aliases for previous API as follows (either may be used):

	* `addListener` -> `on`
	* `removeListener` -> `off`
	* `triggerEvent` -> `emit`
	
## enyo.ComputedSupport

* The `defaultValue` property did not properly and has been completely removed.

* Kinds that want to use `enyo.ComputedSupport` do not need to add it as a
    mixin, as it will automatically be added if there is a `computed` property
    in the kind definition.

* As in `enyo.ObserverSupport`, the `computed` property should now be declared
    as an array:

变更前：

```
computed: {
	computedMethod: ['triggeredBy']
}
```

变更后：

```
computed: [
	// path can be an array if it is more than one property
	{method: 'computedMethod', path: 'triggeredBy'}
]
```

## enyo.BindingSupport

* The `refreshBindings()` and `rebuildBindings()` methods are no longer
    relevant, and have been removed.

## Data Layer

The 2.5.0 release includes a reworking of the Enyo data layer to normalize APIs,
improve performance, and complete the implementation of its _relational support_
(`enyo.RelationalModel`).  This accounts for the majority of the changes made,
with some changes in the API and some in how objects work together.  Also note
that there has been a shift in terminology in that we refer to instances of
`enyo.Model` as "models" as opposed to "records".

### enyo.Store

* `enyo.Store` has been implemented as a protected class and is not intended to
    be subclassed directly.  The `enyo.store` singleton is an internally-used
    interface and runtime database.  It does not have any interaction with
    sources (`enyo.Source`).

* The `addSources()`, `removeSource()`, and `removeSources()` methods have been
    removed.

* `enyo.store` no longer tracks, stores or creates collections
    (`enyo.Collection`).  The `addCollection()`, `removeCollection()`,
    `getCollection()`, and `createCollection()` methods have all been removed.

* `enyo.store` no longer has a public API for creating instances of models
    (`enyo.Model`).  The `createRecord()`, `getRecord()`, `addRecord()`,
    `destroyRecord()`, and `removeRecord` methods have all been removed.

* The `find()` method is now the equivalent of `findLocal()` with modified
    parameters; `findLocal()` has been kept for name compatibility, but now
    calls `find()` internally.  The parameters were brought in line with many of
    the other data layer methods, which accept an optional `options` hash as the
    last parameter.  Note that the options have changed to the following:
    
    + `all` (boolean): if `true`, implies that an array of multiple models will
        be returned; if `false`, only a single model will be returned.

    + `context`: the context under which to execute the filter-method provided
        as the second parameter.

    For more information, see the documentation for the method.

变更前：

```
enyo.store.findLocal(ctor, opts, filterMethod);
```

变更后：

```
enyo.store.find(ctor, filterMethod, opts);
```

### enyo.Model

* `enyo.Model` now has its default behavior controlled by the `options`
    property. These options will be fully documented to for better understanding.

* The `defaultSource` property is now called `source`; its value may be a
    string, an array of strings, an instance of `enyo.Source`, or an array of
    `enyo.Source` instances.

* The `readOnly` property has been removed.

* The `urlRoot` property is no longer used on a model.

* The `mergeKeys` property has been removed.

* Any computed properties for `enyo.Model` are now declared and used exactly the
    same as for all other kinds and cannot be declared in the `attributes` hash.
    They also are not included in the return values of `toJSON()` or `raw()`.

* The `setObject()` method has been removed, but `set()` still accepts an object
    as well as a string path.

* There is no `destroyLocal()` method; there is only `destroy()`, which will be
    a local action (only removing the model from the running application and
    store) unless specific flags are set in the `options` hash.

* The `didDestroy()` method was removed; the equivalent behavior can now only be
    achieved by forcing a remote destroy via a source and passing a `success`
    method via the options hash to the `destroy()` method.

* The `didFetch()` method is now called `fetched`; it has different parameters
    and should not need to be overloaded like before.

* The `didCommit()` method is now called `committed()`; it, too, has different
    parameters and should not need to be overloaded like before.

* The `didFail()` method is now called `errored()`; it has different parameters
    and should not need to be overloaded like before.

* The `toJSON()` method now returns a JSON-parseable object instead of a
    JSON-serialized string.

### enyo.Collection

* `enyo.Collection` now has its default behavior controlled by the `options`
    property.  These options will be fully documented for better understanding.

* The filtering API was completely removed.  There is a new kind,
    `enyo.BucketFilter`, that acts as a proxy for a given collection and can
    automatically maintain multiple filtered states.  In a future release, there
    will also be an `enyo.ProgressiveFilter` that will help in text filtering
    for a collection.

    With the removal of the old filtering API, the `filtered`, `filters`,
    `activeFilter`, and `filterProps` properties no longer exist.  The
    `clearFilter()` method has been removed, as well.

* The `instanceAllRecords` property has been removed since `enyo.Collection` no
    longer delays the instantiation of models.

* The `records` property, previously public, is now a private property called
    `models`.

* The `preserveRecords` property no longer exists; models in a collection are
    always preserved unless the `destroy` option is `true` in the options hash
    when the `destroy()` method is called.

* The `fetchAndReplace()` and `fetchAndDestroy()` methods have been removed; the
    equivalent functionality can now be managed via the options passed to the
    `add()` method.

* The `didFetch()` method is now called `fetched()`; it has different parameters
    and should not need to be overloaded like before.

* The `didFail()` method is now called `errored()`; it, too, has different
    parameters and should not need to be overloaded like before.

* The `toJSON()` method now returns a JSON-parseable object instead of a
    JSON-serialized string.

* The `merge()` method has been removed, as the behavior it implemented can now
    controlled via options passed to the `add()` method.

* The `add()` method has been significantly reworked and now expects an
    `options` hash as the second parameter.

* The `remove()` method has been significantly reworked and now accepts an
    optional `options` hash as a second parameter.

* The `reset()` method has been replaced by `empty()`, which has multiple uses,
    but can be made to replicate the behavior of `reset()` via its optional
    parameters. 

* The `removeAll()` method has been replaced by `empty()`.

* The `destroyAll()` method has been replaced by `empty()`, which can be made to
    replicate the behavior of `destroyAll()` through its optional parameters.

* The `createRecord()` method has been removed.

* The `recordChanged()` optional method is no longer supported.

* The `destroy()` method has been reworked and now accepts an `options` hash,
    much like `enyo.Model.destroy()`.

* You can now commit from a collection; a new `committed()` method has been
    added, which should not need to be overloaded.

* The `isFetching` property has been replaced by the more sophisticated `status`
    property.  See the exposed constants (`enyo.Collection.STATES`) for
    available states.  We recommended that you read the documentation to fully
    understand the various states and how to use them to meet your needs.
    
    The `status` value will be a hexadecimal numeric value; you may use bitwise
    operators on `status` for explicit state control, or make use of the new
    convenience methods `isBusy()`, `isError(),` and `isReady()`, which should
    be suitable for many general use cases (like the one below).

变更前：

```
enyo.kind({
	name: 'MyKind',
	components: [
		{name: 'myCollection', kind: 'enyo.Collection'},
		{name: 'busyPopup', showing: false}
	],
	bindings: [
		{from: '.$.myCollection.isFetching', to: '.$.busyPopup.showing'}
	]
});
```

变更后：

```
enyo.kind({
	name: 'MyKind',
	components: [
		{name: 'myCollection', kind: 'enyo.Collection'},
		{name: 'busyPopup', showing: false}
	],
	bindings: [
		{from: '$.myCollection.status', to: '$.busyPopup.showing', transform: function (value) {
			// we return true if the collection is in its busy state
			return this.$.myCollection.isBusy();
			
			// or in cases where more explicit checking is required you could do something
			// like this
			var STATES = enyo.Collection.STATES;
			
			// this is the bitwise AND operator -- read the documentation to understand this
			// in greater detail
			if (value & STATES.FETCHING) return true;
			else return false;
		}
	]
});
```

### enyo.Source

* `enyo.Source` is no longer considered to be a singleton and is not
    automatically available in a given application.  Sources that need to be
    available to the app must be instanced, usually within the `enyo.ready()`
    function call, where the `enyo.Application` instance is created.  It should
    also be noted that sources no longer interact with `enyo.Store` at all.

变更前：

```
enyo.store.addSources([
	{ajaxSource: enyo.AjaxSource}
]);

new enyo.Collection({defaultSource: 'ajaxSource'});
```

变更后：

```
enyo.AjaxSource.create({name: 'ajax'});

new enyo.Collection({source: 'ajax'});
```
* `enyo.AjaxSource` and `enyo.JsonpSource` (both based on `enyo.XHRSource`) no
    longer inspect a collection or model for a `params` property.  Instead, use
    the `options` hash passed to `fetch()`, `commit()`, or `destroy()` (when
    using a source) to pass the `params` property for the desired behavior.

**See also:** [Enyo 2.3.0-rc.24 to 2.5.0 Release Notes](release-2.3-to-2.5.html)
