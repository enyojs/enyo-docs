# Building Data-Driven Apps

## Overview

Working with data is a key part of building any application.  In a typical
application, you may need to load records and lists of records from a back-end
service, display that data in your application's views, accept input from users
that changes or creates new data, keep views in sync with the changing data, and
persist the data to a back-end location.  Enyo provides many features to make
developing rich, data-driven applications as easy as possible using a minimal
amount of code.

At the heart of Enyo's data layer is the concept of data observation and
binding--the ability to observe changes to an object's properties and have the
changes be automatically synced to properties of related objects.  While this is
most useful for binding view properties to your back-end data, bindings in Enyo
are very flexible and may be created between any two Enyo objects.

All Enyo objects and components support binding by default when property values
are changed using the `set()` method of [enyo.Object]($api/#/kind/enyo.Object).
However, to make changes to properties observable on plain old JavaScript
objects (e.g., JSON objects loaded from a back-end service), Enyo also provides
[enyo.Model]($api/#/kind/enyo.Model), an object that wraps a plain JavaScript
object and adds support for observation, thus allowing your back-end data to be
easily bound to Enyo objects and controls.  In addition, Enyo provides
[enyo.Collection]($api/#/kind/enyo.Collection), which wraps arrays of models and
allows observation of additions to (and removals from) the collection.

Using these features, the properties of `enyo.Object` and `enyo.Model` instances
may be bound to any view properties (which will then be automatically kept in
sync with any object or model changes).  Furthermore, "collection-aware" view
kinds such as [enyo.DataRepeater]($api/#/kind/enyo.DataRepeater),
[enyo.DataList]($api/#/kind/enyo.DataList), and
[enyo.DataGridList]($api/#/kind/enyo.DataGridList), which generate repeated
controls based on a list of data, may be bound to an `enyo.Collection`.  The
views will then be automatically re-rendered when the models in the collection
change.

Finally, Enyo provides APIs on `enyo.Model` and `enyo.Collection` that let you
easily fetch data from (and persist data to) back-end sources such as HTTP-based
Ajax and Jsonp endpoints.  You may also customize these APIs to accommodate
other data sources, such as third-party libraries or SDKs, by subclassing and
registering new [enyo.Source]($api/#/kind/enyo.Source) objects.

## Observers, Bindings, and Computed Properties

[enyo.Component]($api/#/kind/enyo.Component) provides both declarative and
programmatic APIs for observing property changes and binding properties of
objects in the scope of the component.

### Observers

In Enyo, an observer is simply a function that is called when the value of a
property being observed changes.  By convention, Enyo automatically calls
change observers for properties in the form of `<property>Changed()`
functions.  For example:

```javascript
    enyo.kind({
        name: "MyControl",
        foo: "",
        fooChanged: function(inOld) {    // Called when foo changes
            // Do something with "this.foo"
        }
    });
```

In this example, `fooChanged()` will be called when `foo` is set with the `set()` method:

```javascript
    tapHandler: function() {
        this.set("foo", "bar");      // Causes fooChanged() to be called
    }
```

You may declare your own property change observers by adding entries to your
kind's `observers` block:

```javascript
    enyo.kind({
        name: "MyControl",
        publicProperty: 10
        _protectedProperty: 42,
        observers: [
            { method: "watchValues", path: ["publicProperty", "_protectedProperty"] }
        ],
        watchValues: function(previous, current, property) {  // Called when either property changes
            // Do something with "this.publicProperty" and "this._protectedProperty"
        }
    });
```

Note that, as long as property changes are made via the `set()` function of
`enyo.Object`, any property (published or otherwise) is observable.  Also note
that the long-form setters generated for published properties (e.g.,
`setPublicProperty()` for the current example) call the generic `set()`
function internally.

After a kind has been created, you may add or remove observers programmatically
using the `addObserver()` and `removeObserver()` functions on `enyo.Object`
(provided by the [enyo.ObserverSupport]($api/#/mixin/enyo.ObserverSupport)
mixin).

### Bindings

Bindings in Enyo are built on the basic observation capability outlined above.
A binding is responsible for propagating property value changes between two
points--the source and target of the binding.  When the source of a binding
changes, the new value is set to the target property.

You may declare bindings between properties in the scope of a component by
adding entries to your kind's `bindings` block.  In the following example, the
binding will automatically keep the content of the label (`label.content`) in
sync with the value of the slider (`slider.value`) as the user drags the slider
knob.

```javascript
    enyo.kind({
        name: "MyValueSlider",
        components: [
            {kind: "moon.Slider", name: "slider"},
            {kind: "enyo.Control", name: "label"}
        ],
        bindings: [
            {from: "$.slider.value", to: "$.label.content"}
        ]
    });
```
Note that the source (`from`) and target (`to`) properties of the binding are
specified as string paths.  By convention, when the path starts with a dot (`.`)
as in this example, the path is relative to `this`.  If the path starts with a
caret (`^`), the path is relative to the global scope.

By default, bindings are one-way, from the source to the target.  However,
a binding may be specified as "two-way" by setting the `oneWay` flag to `false`:

```javascript
    enyo.kind({
        name: "MyValueSlider",
        sliderValue: 10,    // Initial value of slider
        components: [
            {kind: "moon.Slider", name:"slider"},
            {kind: "enyo.Control", name:"label"}
        ],
        bindings: [
            {from: "sliderValue", to: "$.slider.value", oneWay: false},    // two-way binding
            {from: "$.slider.value", to: "$.label.content"}                // one-way binding
        ]
    });
```

Note that in two-way bindings, the order of the `from` and `to` values is still
meaningful, since the initial value will be determined by the source (`from`)
end.  In the current example, we are binding the `sliderValue` 
property to the child slider's `value` property.  At creation time, the binding
will propagate the value of `sliderValue` to the child slider's `value` property
(not the other way around), but on any subsequent changes to the child slider,
`value` will be propagated from `value` back to `sliderValue`.

An optional `transform` function may be provided for a binding to transform the
value as it passes from the source to the target (and vice-versa, for two-way
bindings):

```javascript
    enyo.kind({
        name: "MyValueSlider",
        components: [
            {kind: "moon.Slider", name:"slider", min: 0, max: 1},
            {kind: "enyo.Control", name:"label"}
        ],
        bindings: [
            {from: "$.slider.value", to: "$.label.content", transform: function(val) {
                return "The slider value is " + Math.round(val * 100) + "%";
            }}
        ]
    });
```

If necessary, a bi-directional transform may be provided for a two-way binding;
check the second argument to the `transform` function to determine the direction
in which the binding is firing: 

```javascript
    {from: "$.slider.value", to: "$.input.value", oneWay:false, transform: function(val, dir) {
        if (dir == "source") {
            return (val * 100) + "%";
        } else {
            return parseInt(val) / 100;
        }
    }}
```

### Computed Properties

Computed properties allow you to observe and bind to changes in properties that
are computed based on one or more dependent properties.  When any dependencies
of the computed property change (resulting in a change to the computed value),
observers and bindings for that property fire.

Here's a simple example of a computed property based on two properties:

```javascript
    enyo.kind({
        name: "MyForecastControl",
        weather: "sunny",
        city: "San Francisco",
        computed: [
            { method: "forecast", path: ["weather", "city"] }    // "forecast" method depends on properties in list
        ],
        forecast: function() {
            return "It's always " + this.get("weather") + " in " + this.get("city")
        }
    }); 
```

We may now bind the computed `forecast` property to a view control, e.g.:

```javascript
    enyo.kind({
        name: "MyForecastControl",
        weather: "sunny",
        city: "San Francisco",
        components: [
            {kind: "enyo.Control", name: "forecastLabel"}
        ],
        bindings: {
            {from: "forecast", to: "$.forecastLabel.content"}
        },
        computed: [
            { method: "forecast", path: ["weather", "city"] }    // "forecast" method depends on properties in list
        ],
        forecast: function() {
            return "It's always " + this.get("weather") + " in " + this.get("city")
        }
    });
```

Then, when either dependent property changes, the view will automatically update:

```javascript
    this.set("weather", "rainy");    
    // forecastLabel's content becomes "It's always rainy in San Francisco"

    this.set("city", "Seattle");
    // forecastLabel's content becomes "It's always rainy in Seattle"
```

## Models

[enyo.Model]($api/#/kind/enyo.Model) is a very lightweight base kind that is
specially designed to wrap plain-old JavaScript objects (POJOs), such as data
fetched as JSON from a remote server.  It allows for observation and binding
using the APIs described above.

Note that `enyo.Model` is **NOT** an `enyo.Component`; it may not be used within
declarative `components` blocks, but is instead instanced using the `new`
keyword.  In fact, `enyo.Model` is not even derived from `enyo.Object`, as it is
intended to be as lightweight as possible.

### Creating and Using Models

A generic `enyo.Model` may be instanced and initialized by simply using the
`new` keyword and passing the constructor an optional object containing the
desired initial attribute values:

```javascript
    var myModel = new enyo.Model({
        name: "Kevin", 
        hometown: "San Francisco",
        avatar: "/assets/kevin.png",
        height: 6.0
    });
```

We may get and set properties of the model using the `set()` and `get()`
functions, just as we would do with `enyo.Object`:

```javascript
    myModel.get("name"); // returns "Kevin"
    myModel.set("name", "Bob");
    myModel.get("name"); // returns "Bob"
```

The properties of the model may be observed or bound to properties of components
or other models using the same API described above:

```javascript
    enyo.kind({
        name: "ContactView",
        personModel: null,
        components: [
            {kind: "enyo.Image", name: "avatar"},
            {kind: "enyo.Control", name: "nameLabel"},
            {kind: "enyo.Control", name: "townLabel"}
        ],
        bindings: [
            {from: "personModel.name", to: "$.nameLabel.content"},
            {from: "personModel.hometown", to: "$.townLabel.content"},
            {from: "personModel.avatar", to: "$.avatar.src"}
        ]
    });
```

If we set the `personModel` property of a `ContactView` instance to a model with
the expected schema, the avatar, name, and town components of the view will
automatically be synced with the corresponding properties of the model:

```javascript
    var myModel = new enyo.Model({
        name: "Kevin", 
        hometown: "San Francisco",
        avatar: "/assets/kevin.png",
        height: 6.0
    });

    this.$.contactView.set("personModel", myModel);
```

Furthermore, if any properties of the model are changed, the view will
automatically update:

```javascript
    myModel.set("name", "Bob");        // The "nameLabel" component of the view will update
```

### Creating Model Subkinds

You may subkind `enyo.Model` to provide an explicit schema and default values
via the `attributes` property, or to override any other default behavior:

```javascript
    enyo.kind({
        name: "ContactModel",
        kind: "enyo.Model",
        attributes: {
            name: "Unknown",
            hometown: "Unknown",
            avatar: "/assets/unknown.png"
        }
    });

    var myModel = new ContactModel({
        name: "Bob"        // other attributes will reflect the defaults in ContactModel
    });
```

### Fetching Models from REST Endpoints

Although it is often useful to initialize a model using an object literal (as
seen above), `enyo.Model` instances are often populated based on data from a
remote source.  To simplify this process, the Enyo data layer includes support
for fetching models from Ajax and Jsonp REST endpoints by default, and may be
easily customized for other source types (see [Sources](#sources) below for more
details).

In the following example, we create a `ContactModel` subkind, providing a URL to
the REST endpoint for this resource, along with the `primaryKey` (which will be
appended to the end of the `url` property):

```javascript
    enyo.kind({
        name: "ContactModel",
        kind: "enyo.Model",
        url: "http://myservice.com/users",
        primaryKey: "user_id"
    });

    var myModel = new ContactModel({user_id: 1234});
    myModel.fetch();  // Results in an XHR request to http://myservice.com/users/1234
```

If you need greater control over how the URL is constructed for your service,
you may overload the `getUrl()` function on `enyo.Model`:

```javascript
    enyo.kind({
        name: "ProductModel",
        kind: "enyo.Model",
        getUrl: function() {
            return "http://myservice.com/products/" + this.get("department_id") + "/" + this.get("product_id");
        }
    });
```

### Parsing and Converting Fetched Data

Often, you may need to adjust or convert the structure of data returned from a
service (especially one that you don't control) in order to make it suitable for
use in your application.  For this reason, `enyo.Model` provides a `parse()`
API, to be called after the data is fetched but before the data is transferred
to the internal `attributes` hash and observers are notified. To enable this feature, set the `parse` option to `true`.

For example, a service might return metadata about a request that is not
relevant to the data for your model:

```
    {
        "status": {
            "error": "none",
            "last_request": 1230394903
        },
        "result": {
            "user_id": 1234,
            "name": "Kevin",
            "hometown": "San Francisco"
            "avatar": "/images/kevin.png",
            "height": 6.0
        }
    }
```

In this case, you could overload the `parse()` function to tell `enyo.Model` to
only use the `result` sub-tree of the fetched data for the model attributes:

```javascript
    enyo.kind({
        name: "ContactModel",
        kind: "enyo.Model",
        options: {parse: true},
        url: "http://myservice.com/users",
        primaryKey: "user_id",
        parse: function(data) {        // incoming data contains {status:..., result:...}
            return data.result;        // returned data contains {user_id:..., name:..., ...}
        }
    });
```

If the data from the REST endpoint did not arrive in JSON format, you would also
use `parse()` to parse the data (string) returned from the service into a
JavaScript object.  Although Enyo does not provide XML-to-JSON parsing as part
of the core framework, there are several open-source libraries that provide this
functionality, such as [X2JS](https://code.google.com/p/x2js/):

```javascript
    enyo.kind({
        name: "ContactModel",
        kind: "enyo.Model",
        options: {parse: true},
        url: "http://myservice.com/users",
        primaryKey: "user_id",
        parser: new X2JS(),
        parse: function(data) {        // incoming data: "<root><user_id>1234</user_id><name>...</name>...</root>"
            var json = this.parser.xml_str2json(data);
            return json.root;        // returned data: {user_id:..., name:..., ...}
        }
    });
```

For performance, `enyo.Model` does not support binding to nested data
structures within a model.  If a service returns nested data that your app needs
to bind to, you could use the `parse()` function to flatten the structure.  For
example, if the fetched model data looked like this...

```
    {
        "user_id": 1234,
        "name": "Kevin",
        "department": {
            "dept_id": 42,
            "name": "Encabulator Marketing"
        },
        "manager": {
            "user_id": 933,
            "name": "Gray"
        }
    }
```

...the following() `parse` function would wrap the `department` and `manager`
fields with `enyo.Model`, making those nested sub-objects bindable as well:

```javascript
    enyo.kind({
        name: "ContactModel",
        kind: "enyo.Model",
        options: {parse: true},
        url: "http://myservice.com/users",
        primaryKey: "user_id",
        parse: function(data) {
            data.dept_id = data.department.dept_id;
            data.dept_name = data.department.name;
            delete data.department;
            data.manager_id = data.manager.user_id;
            data.manager_name = data.manager.name;
            delete data.manager;
            return data;
        }
    });
```

## Collections

While `enyo.Model` wraps plain JavaScript objects to make them observable,
[enyo.Collection]($api/#/kind/enyo.Collection) wraps arrays of JavaScript
objects, providing observation support for the addition of objects to (and
removal of objects from) the array, and automatically "upgrading" plain
JavaScript objects to `enyo.Model` status.

Note: Although collections have many features and APIs in common with
`enyo.Model`, such as the ability to fetch and parse data from a back-end
server, `enyo.Collection` is actually a subkind of `enyo.Component`.  As such,
a collection may be instantiated either declaratively, in the `components` block
of a component or control, or programmatically, using the standard keyword
`new`.

### Creating and Using Collections

A generic `enyo.Collection` may be instanced and initialized by simply using the
`new` keyword and passing the constructor an optional object containing the
initial model data:

```javascript
    var myCollection = new enyo.Collection([
        {
            name: "Kevin", 
            hometown: "San Francisco",
            avatar: "/assets/kevin.png",
            height: 6.0
        },
        {
            name: "Gray", 
            hometown: "San Jose",
            avatar: "/assets/gray.png",
            height: 6.1
        },
        {
            name: "Cole", 
            hometown: "Santa Clara",
            avatar: "/assets/cole.png",
            height: 5.9
        }
    ]);
```

We can retrieve models from the collection using the `at()` function:

```javascript
    myCollection.at(0);                 // returns enyo.Model instance for "Kevin" record
    myCollection.at(2).get("name");     // returns "Cole"
```

We can add models using the `add()` function.  Note that `add()` will accept
either `enyo.Model` objects or plain JavaScript objects.  The latter are
converted into `enyo.Model` objects when first retrieved.

```javascript
    myCollection.add({name: "Ben", hometown: "Austin"});
    myCollection.at(myCollection.length-1).get("name"); // returns "Ben"

    myCollection.add(new ContactModel({name: "Aaron", hometown: "San Mateo"}));
    myCollection.at(myCollection.length-1).get("name"); // returns "Aaron"
```

See the documentation for [enyo.Collection]($api/#/kind/enyo.Collection) for the
full list of APIs available for manipulating records.

### Creating Collection Subkinds

You may subkind `enyo.Collection` to indicate an explicit model type to be used
for wrapping its array data, or to override any other default behavior:

```javascript
    enyo.kind({
        name: "MyContactCollection",
        kind: "enyo.Collection",
        model: "MyContactModel"
    });

    var myCollection = new MyContactCollection([
        {
            name: "Kevin", 
            hometown: "San Francisco",
            avatar: "/assets/kevin.png",
            height: 6.0
        },
        ...
    ]);

    myCollection.at(0);        // returns instance of "MyContactModel" for "Kevin" record
```

### Fetching Collections from REST Endpoints

Like `enyo.Model`, `enyo.Collection` provides default support for fetching
array data from REST endpoints by specifying the resource's `url` and calling
`fetch()`.

In the following example, the collection is loaded from a fixed URL:

```javascript
    enyo.kind({
        name: "MyContactCollection",
        kind: "enyo.Collection",
        url: "http://myservice.com/users"
    });

    var myCollection = new MyContactCollection();
    myCollection.fetch();
```

If the URL for the collection needs to be customized, simply overload `getUrl()`
to provide a custom URL--based on properties of the collection, for example:

```javascript
    enyo.kind({
        name: "MyContactCollection",
        kind: "enyo.Collection",
        getUrl: function() {
            return "http://myservice.com/departments/" + this.get("dept_id") + "/users";
        }
    });

    new MyContactCollection({dept_id: 42});
    myCollection.fetch();
```

### Parsing and Converting Fetched Data

Also like `enyo.Model`, `enyo.Collection` has a `parse()` function to allow
fetched data to be processed before being used.

For example, if your service provided request metadata in addition to the data
array...

```
    {
        "status": {
            "error": "none",
            "last_request": 1230394903
        },
        "result": [
            {
                "user_id": 1234,
                "name": "Kevin",
                "hometown": "San Francisco"
                "avatar": "/images/kevin.png",
                "height": 6.0
            },
            {
                "user_id": 2345,
                "name": "Gray",
                "hometown": "San Jose"
                "avatar": "/images/gray.png",
                "height": 6.1
            },
            {
                "user_id": 4567,
                "name": "Cole",
                "hometown": "Santa Clara"
                "avatar": "/images/cole.png",
                "height": 5.9
            }
        ]
    }
```

...you could implement the following function to use only the `result` sub-array:

```javascript
    enyo.kind({
        name: "MyContactCollection",
        kind: "enyo.Collection",
        options: {parse: true},
        url: "http://myservice.com/users"
        parse: function(data) {        // incoming data contains {status:..., result:...}
            return data.result;        // returned data contains {[{user_id:..., name:...}, {...}]}
        }
    });
```

## Sources

### Overview

[enyo.Source]($api/#/kind/enyo.Source) is an abstraction provided by Enyo's data
layer that encapsulates knowledge of how to fetch models from and commit
collections to a data source.  The data source could be a remote service exposed
as REST endpoints accessed via Ajax or Jsonp, a complex Web API accessed through
a third-party JavaScript library, or even `localStorage`.

The abstract API for `enyo.Source` is as follows:

* `fetch()` - Retrieves a model or collection, typically based on a unique
    resource identifier.

* `commit()` - Persists a model's current state to the source, creating a new
    record on the source if the model was created locally and not originally
    fetched from the source (not required for read-only sources).

* `destroy()` - Deletes a model from the source (not required for read-only
    sources).

* `find()` - Queries the source for a model or collection based on query
    attributes (optional).

Enyo currently provides default sources for Ajax and Jsonp REST endpoints via
the [enyo.AjaxSource]($api/#/kind/enyo.AjaxSource) and
[enyo.JsonpSource]($api/#/kind/enyo.JsonpSource) subkinds, respectively.

### Specifying a source

When defining a custom `enyo.Model` or `enyo.Collection` subkind, you may
specify the `source` property to indicate which source to use for
fetching and committing records, using the shorthand name for the source (e.g.,
"`ajax`", "`jsonp`", etc.).

For example:

```javascript
    enyo.kind({
        name: "MyContactCollection",
        kind: "enyo.Collection",
        model: "MyContactModel",
        url: "http://myservice.com/users",
        source: "jsonp"        // use jsonp source instead of ajax for fetching
    });
```

### Creating Source Subkinds

You may subkind existing sources to specify options to configure the fetching
strategy, or to create brand new sources for accessing data not supported by
existing source kinds.  Newly-created sources must be registered with the data
layer by instantiating a source with a name.

For example, to create a subkind of `enyo.JsonpSource` to provide a custom
`callback` property required by the JSONP endpoint, you could do the following:

```javascript
    enyo.kind({
        name: "MyJsonpSource",
        kind: "enyo.JsonpSource",
        fetch: function(opts) {
            opts.callbackName = "kallback";
            this.inherited(arguments);
        }
    });
    new MyJsonpSource({name: "mysource"});
```

To create a brand new source, implement the abstract API as necessary:

```javascript
    enyo.kind({
        name: "MySource",
        kind: "enyo.Source",
        fetch: function(rec, opts) {
            // implement code to fetch records
            opts.success(data);        // call success callback to return data
        },
        commit: function(rec, opts) {
            // implement code to store records
            opts.success();        // call success callback
        },
        destroy: function(rec, opts) {
            // implement code to destroy records
            opts.success();        // call success callback
        },
        find: function(rec, opts) {
            // implement code to find records
            opts.success(data);        // call success callback to return data
        },
    });
    new MySource({name: "mysource"});
```

As an example, you could easily implement an `enyo.Source` that uses the
[Facebook JavaScript SDK](https://developers.facebook.com/docs/reference/javascript/)
to read or add posts to a user's news feed as follows. (Note that the
authentication required for this particular SDK is out of the scope of this
article.)

```javascript
    enyo.kind({
        name: "FacebookFeedSource",
        kind: "enyo.Source",
        fetch: function(rec, opts) {
            var resource;
            if (rec instanceof enyo.Collection) {
                var user = rec.get("user") || "me";
                resource = "/" + user + "/feed";
            } else {
                resource = "/" + rec.id;
            }
            FB.api(resource, function(response) {
                if (response && !response.error) {
                    opts.success(response);
                } else {
                    opts.fail(response);
                }
            });
        },
        commit: function(rec, opts) {
            if (rec.isNew) {
                FB.api("/me/feed", "POST", rec, function(response) {
                    if (response && !response.error) {
                        opts.success(response);
                    } else {
                        opts.fail(response);
                    }
                });
            } else {
                opts.fail();  // FB only supports adding new posts, not editing
            }
        },
        destroy: function(rec, opts) {
            FB.api(rec.id, "DELETE", function(response) {
                if (response && !response.error) {
                    opts.success(response);
                } else {
                    opts.fail(response);
                }
            });
        }
    });
    new FacebookFeedSource({name: "fbfeed"});
```

## Binding Models and Collections to Views

As discussed above, in Enyo we can easily bind properties from any `enyo.Object`
or `enyo.Model` to properties of the controls that make up your app views.
Without using bindings, one would typically initialize the view's properties
programmatically and handle view events programmatically to keep the view and
model data in sync.

### Binding to Normal View Properties

The following example features a view that gets its data from a model with
`name` and `value` properties.  The slider value, input value, and name label
are initialized based on the model at creation time.  The `value` property may
be changed by dragging the slider or typing in the input, and when the change is
complete, the new value should be reflected in the model.

This is the typical way to implement such a view without using bindings:

```javascript
    enyo.kind({
        name: "MyControl",
        model: null,
        components: [
            {kind: "enyo.Control", name: "nameLabel"},
            {kind: "onyx.Slider", name: "slider", onChanging: "sliderChanging"},
            {kind: "enyo.Input", name: "input", oninput: "inputChanged"}
        ],
        create: function() {
            this.inherited(arguments);
            this.set("$.nameLabel.content", this.get("model.name"));
            this.set("$.slider.value", this.get("model.value"));
            this.set("$.input.value", this.get("model.value"));
        },
        sliderChanging: function(inSender, inEvent) {
            this.set("$.input.value", inEvent.value);
            this.set("model.value", inEvent.value)
        },
        inputChanged: function(inSender, inEvent) {
            this.set("$.slider.value", inSender.get("value"));
            this.set("model.value", inSender.get("value"));
        }
    });
```

[Link to jsFiddle](http://jsfiddle.net/enyojs/Q45NW/)

Using bindings, the implementation requires significantly less code, and may be
done completely declaratively, making your code easier to read and maintain:

```javascript
    enyo.kind({
        name: "MyControl",
        model: null,
        components: [
            {kind: "enyo.Control", name: "nameLabel"},
            {kind: "onyx.Slider", name: "slider", onChanging: "sliderChanging"},
            {kind: "enyo.Input", name: "input", oninput: "inputChanged"}
        ],
        bindings: [
            {from: "model.name", to: "$.nameLabel.content"},
            {from: "model.value", to: "$.slider.value", oneWay: false},
            {from: "model.value", to: "$.input.value", oneWay: false}
        ]
    });
```

[Link to jsFiddle](http://jsfiddle.net/enyojs/4n343/)

### Binding in Collection-Aware Controls

Enyo includes several "collection-aware" controls, whose APIs allow you to pass
in an `enyo.Collection`; child controls are then automatically generated based
on the data in the collection, and are kept in sync with changes made to the
underlying collection and models.

The base kind for these controls is
[enyo.DataRepeater]($api/#/kind/enyo.DataRepeater).  This is similar to
[enyo.Repeater]($api/#/kind/enyo.Repeater) in that its child controls serve as
a template for controls to be generated by the repeater (one for each child in
the underlying data set).  However, instead of setting a count and responding to
`setupItem` events to sync generated controls to the data models,
`enyo.DataRepeater` generates one control for each model in the collection and
then assigns the corresponding model to each control, allowing bindings on that
control to sync data to and from the models.

Without collections or bindings, one might implement a simple repeater as follows:

```javascript
    enyo.kind({
        name: "",
        data: null, // expects plain JS array array
        components: [
            {kind: "enyo.Repeater", name: "repeater", onSetupItem: "setupItem", components: [
                {kind: "enyo.Control", name: "nameLabel"},
                {kind: "enyo.Control", name: "ageLabel"}
            ]}
        ],
        create: function() {
            this.inherited(arguments);
            this.dataChanged();
        },
        dataChanged: function() {
            if (this.data) {
                this.$.repeater.set("count", data.length);
            }
        },
        setupItem: function(inSender, inEvent) {
            var record = this.data[inEvent.index];
            this.$.nameLabel.set("content", record.name);
            this.$.ageLabel.set("content", record.age);
        }
    });
```

However, this code has a significant downside: if any records in the `data`
array change, this kind has no way of knowing.  Additional communication would
be needed between the kind that is changing records and this view in order to
know that the repeater needs to be refreshed.

By contrast, using the collection-aware `enyo.DataRepeater` with an
`enyo.Collection` will let us implement the view with much less code, with
the DataRepeater automatically keeping the view in sync when records in the
collection are changed:

```javascript
    enyo.kind({
        name: "",
        data: null, // expects an enyo.Collection
        components: [
            {kind: "enyo.DataRepeater", name: "repeater", components: [
                {
                    components: [
                        {kind: "enyo.Control", name: "nameLabel"},
                        {kind: "enyo.Control", name: "ageLabel"}
                    ],
                    bindings: [
                        {from: "model.name", to: "$.nameLabel.content"},
                        {from: "model.age", to: "$.ageLabel.content"}
                    ]
                }
            ]}
        ]
    });
```
