# Managing Data in Enyo

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
are changed using the `set()` method of [enyo.Object](../../api.html#enyo.Object).
However, to make changes to properties observable on plain old JavaScript
objects (e.g., JSON objects loaded from a back-end service), Enyo also provides
[enyo.Model](../../api.html#enyo.Model), an object that wraps a plain JavaScript
object and adds support for observation, thus allowing your back-end data to be
easily bound to Enyo objects and controls.  In addition, Enyo provides
[enyo.Collection](../../api.html#enyo.Collection), which wraps arrays of models
and allows observation of additions to (and removals from) the collection.

Using these features, the properties of `enyo.Object` and `enyo.Model` instances
may be bound to any view properties (which will then be automatically kept in
sync with any object or model changes).  Furthermore, "collection-aware" view
kinds such as [enyo.DataRepeater](../../api.html#enyo.DataRepeater),
[enyo.DataList](../../api.html#enyo.DataList) and
[enyo.DataGridList](../../api.html#enyo.DataGridList), which generate repeated
controls based on a list of data, may be bound to an `enyo.Collection`.  The
views will then be automatically re-rendered when the models in the collection
change.

Finally, Enyo provides APIs on `enyo.Model` and `enyo.Collection` that let you
easily fetch data from (and persist data to) back-end sources such as HTTP-based
Ajax and Jsonp endpoints.  You may also customize these APIs to accommodate
other data sources, such as third-party libraries or SDKs, by subclassing and
registering new [enyo.Source](../../api.html#enyo.Source) objects.

## Observers, Bindings, and Computed Properties

[enyo.Component](../../api.html#enyo.Component) provides both declarative and
programmatic APIs for observing property changes and binding properties of
objects in the scope of the component.

### Observers

In Enyo, an observer is simply a function that is called when the value of a
property being observed changes.  By convention, Enyo automatically provides
change observers for published properties in the form of `<property>Changed()`
functions.  For example:

```
enyo.kind({
    name: "MyControl",
    published: {
        foo: ""
    },
    fooChanged: function(inOld) {    // Called when foo changes
        // Do something with "this.foo"
    }
});
```

In this example, `fooChanged()` will be called when the `foo` setter is called:

```
    tapHandler: function() {
        this.set("foo", "bar");      // Causes fooChanged() to be called
    }
```

You may declare your own property change observers by adding entries to your
kind's `observers` block:

```
enyo.kind({
    name: "MyControl",
    published: {
        publicProperty: 10
    },
    _protectedProperty: 42,
    observers: {
        watchValues: ["publicProperty", "_protectedProperty"]
    },
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
(provided by the [enyo.ObserverSupport](../../api.html#enyo.ObserverSupport) mixin).

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

```
enyo.kind({
    name: "MyValueSlider",
    components: [
        {kind: "moon.Slider", name: "slider"},
        {kind: "enyo.Control", name: "label"}
    ],
    bindings: [
        {from: ".$.slider.value", to: ".$.label.content"}
    ]
});
```
Note that the source (`from`) and target (`to`) properties of the binding are
specified as string paths.  By convention, when the path starts with a dot (`.`)
as in this example, the path is relative to `this`.  If the path starts with a
caret (`^`), the path is relative to the global scope.

By default, bindings are one-way, from the source to the target.  However,
a binding may be specified as "two-way" by setting the `oneWay` flag to `false`:

```
enyo.kind({
    name: "MyValueSlider",
    published: {
        sliderValue: 10    // Initial value of slider
    },
    components: [
        {kind: "moon.Slider", name:"slider"},
        {kind: "enyo.Control", name:"label"}
    ],
    bindings: [
        {from: ".sliderValue", to: ".$.slider.value", oneWay: false},    // two-way binding
        {from: ".$.slider.value", to: ".$.label.content"}                // one-way binding
    ]
});
```

Note that in two-way bindings, the order of the `from` and `to` values is still
meaningful, since the initial value will be determined by the source (`from`)
end.  In the current example, we are binding the `sliderValue` published
property to the child slider's `value` property.  At creation time, the binding
will propagate the value of `sliderValue` to the child slider's `value` property
(not the other way around), but on any subsequent changes to the child slider,
`value` will be propagated from `value` back to `sliderValue`.

An optional `transform` function may be provided for a binding to transform the
value as it passes from the source to the target (and vice-versa, for two-way
bindings):

```
enyo.kind({
    name: "MyValueSlider",
    components: [
        {kind: "moon.Slider", name:"slider", min: 0, max: 1},
        {kind: "enyo.Control", name:"label"}
    ],
    bindings: [
        {from: ".$.slider.value", to: ".$.label.content", transform: function(val) {
            return "The slider value is " + Math.round(val * 100) + "%";
        }}
    ]
});
```

If necessary, a bi-directional transform may be provided for a two-way binding;
check the second argument to the `transform` function to determine the direction
in which the binding is firing: 

```
        {from: ".$.slider.value", to: ".$.input.value", oneWay:false, transform: function(val, dir) {
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

Here's a simple example of a computed property based on two published properties:

```
enyo.kind({
    name: "MyForecastControl",
    published: {
        weather: "sunny",
        city: "San Francisco"
    },
    computed: {
        forecast: ["weather", "city"]    // "forecast" function depends on properties in list
    },
    forecast: function() {
        return "It's always " + this.get("weather") + " in " + this.get("city")
    }
}); 
```

We may now bind the computed `forecast` property to a view control, e.g.:

```
enyo.kind({
    name: "MyForecastControl",
    published: {
        weather: "sunny",
        city: "San Francisco"
    },
    components: [
        {kind: "enyo.Control", name: "forecastLabel"}
    ],
    bindings: {
        {from: ".forecast", to: ".$.forecastLabel.content"}
    },
    computed: {
        forecast: ["weather", "city"]
    },
    forecast: function() {
        return "It's always " + this.get("weather") + " in " + this.get("city")
    }
});
```

Then, when either dependent property changes, the view will automatically update:

```
this.set("weather", "rainy");    
// forecastLabel's content becomes "It's always rainy in San Francisco"

this.set("city", "Seattle");
// forecastLabel's content becomes "It's always rainy in Seattle"
```

## Models

[enyo.Model](../../api.html#enyo.Model) is a very lightweight base kind that is
specially designed to wrap POJOs (plain-old JavaScript objects) such as data
fetched as JSON from a remote server.  It allows for observation and binding
using the APIs described above.

Note that `enyo.Model` is **NOT** an `enyo.Component`; it may not be used within
declarative `components` blocks, but is instead instanced using the `new`
keyword.  In fact, `enyo.Model` is not even derived from `enyo.Object`, as it is
intended to be as lightweight as possible.

### Creating and using models

A generic `enyo.Model` may be instanced and initialized by simply using the
`new` keyword and passing the constructor an optional object containing the
desired initial attribute values:

```
var myModel = new enyo.Model({
    name: "Kevin", 
    hometown: "San Francisco",
    avatar: "/assets/kevin.png",
    height: 6.0
});
```

We may get and set properties of the model using the `set()` and `get()`
functions, just as we would do with `enyo.Object`:

```
myModel.get("name"); // returns "Kevin"
myModel.set("name", "Bob");
myModel.get("name"); // returns "Bob"
```

The properties of the model may be observed or bound to properties of components
or other models using the same API described above:

```
enyo.kind({
    name: "ContactView",
    published: {
        personModel: null
    },
    components: [
        {kind: "enyo.Image", name: "avatar"},
        {kind: "enyo.Control", name: "nameLabel"},
        {kind: "enyo.Control", name: "townLabel"}
    ],
    bindings: [
        {from: ".personModel.name", to: ".$.nameLabel.content"},
        {from: ".personModel.hometown", to: ".$.townLabel.content"},
        {from: ".personModel.avatar", to: ".$.avatar.src"}
    ]
});
```

If we set the `personModel` property of a `ContactView` instance to a model with
the expected schema, the avatar, name, and town components of the view will
automatically be synced with the corresponding properties of the model:

```
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

```
myModel.set("name", "Bob");        // The "nameLabel" component of the view will update
```

### Creating model subkinds

You may subkind `enyo.Model` to provide an explicit schema and default values
via the `defaults` property, or to override any other default behavior:

```
enyo.kind({
    name: "ContactModel",
    kind: "enyo.Model",
    defaults: {
        name: "Unknown",
        hometown: "Unknown",
        avatar: "/assets/unknown.png"
    }
});

var myModel = new ContactModel({
    name: "Bob"        // other attributes will reflect the defaults in ContactModel
});
```

### Fetching models from REST endpoints

Although it is often useful to initialize a model using an object literal (as
seen above), `enyo.Model` instances are often populated based on data from a
remote source.  To simplify this process, the Enyo data layer includes support
for fetching models from Ajax and Jsonp REST endpoints by default, and may be
easily customized for other source types (see [Sources](#sources) below for more
details).

In the following example, we create a `ContactModel` subkind, providing a URL to
the REST endpoint for this resource, along with the `primaryKey` (which will be
appended to the end of the `url` property):

```
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

```
enyo.kind({
    name: "ProductModel",
    kind: "enyo.Model",
    getUrl: function() {
        return "http://myservice.com/products/" + this.get("department_id") + "/" + this.get("product_id");
    }
});
```

### Parsing and converting fetched data

Often, you may need to adjust or convert the structure of data returned from a
service (especially one that you don't control) in order to make it suitable for
use in your application.  For this reason, `enyo.Model` provides a `parse()`
API, to be called after the data is fetched but before the data is transferred
to the internal `attributes` hash and observers are notified.

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

```
enyo.kind({
    name: "ContactModel",
    kind: "enyo.Model",
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

```
enyo.kind({
    name: "ContactModel",
    kind: "enyo.Model",
    url: "http://myservice.com/users",
    primaryKey: "user_id",
    parser: new X2JS(),
    parse: function(data) {        // incoming data: "<root><user_id>1234</user_id><name>...</name>...</root>"
        var json = this.parser.xml_str2json(data);
        return json.root;        // returned data: {user_id:..., name:..., ...}
    }
});
```

Finally, `enyo.Model` does not currently support binding to nested data
structures within a model.  If a service returns nested data that your app needs
to bind to, you could use the `parse()` function to flatten the structure.  For
example, if the fetched model data looked like this:

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

```
enyo.kind({
    name: "ContactModel",
    kind: "enyo.Model",
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

While `enyo.Object` wraps plain JavaScript objects to make them observable, `enyo.Collection` wraps arrays of JavaScript objects, and provides observation support for adding and removing objects to the array, as well as automatic "upgrading" of plain JavaScript objects to `enyo.Model`s.  

_Note: although collections have many features and API's in common with `enyo.Model` such as the ability to fetch and parse data from a back-end server, `enyo.Collection` is actually a sub-kind of `enyo.Component`, and may be instantiated declaratively in the `components` block of other components or controls, in addition to being instanced programmatically using the normal `new` keyword._

### Creating and using collections

A generic `enyo.Collection` can be instanced and passed initial model data by simply using the `new` keyword and optionally passing array containing the initial model data to the constructor:

```
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
We can retrieve models from the collection using the `at` function:

```
myCollection.at(0);                 // returns enyo.Model instance for "Kevin" record
myCollection.at(2).get("name");      // returns "Cole"
```
We can add models using the `add` function.  Note, collections accept either `enyo.Model`s directly, or plain JS objects (which are upgraded to `enyo.Models` when first retrieved).

```
myCollection.add({name: "Ben", hometown: "Austin"});
myCollection.at(myCollection.length-1).get("name"); // returns "Ben"

myCollection.add(new ContactModel({name: "Aaron", hometown: "San Mateo"}));
myCollection.at(myCollection.length-1).get("name"); // returns "Aaron"
```
See the [enyo.Collection](http://) API reference for the full list of API's provided by `enyo.Collection` for manipulating records.

### Creating collection sub-kinds

You may sub-kind `enyo.Collection` as you would any kind, to indicate an explicit model type to be used to wrap its array data, or to override any other default behavior:

```
enyo.kind({
    name: "MyContactCollection",
    kind: "enyo.Collection",
    model: "MyContactModel"
});

var myCollection = new enyo.Collection([
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

### Fetching collections from REST endpoints

Similar to `enyo.Model`, `enyo.Collection` provides default support for fetching array data from REST endpoints by providing the resource `url` property and using the `fetch` function.

In the following example, the colleciton is loaded from a fixed url:

```
enyo.kind({
    name: "MyContactCollection",
    kind: "enyo.Collection",
    url: "http://myservice.com/users"
});

var myCollection = new MyContactCollection();
myCollection.fetch();

```

If the url for the collection needs to be customized, simply overload the `getUrl` function to provide a custom URL, based on properties of the collection, for example:

```
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
### Parsing and converting fetched data

Similar to `enyo.Model`, `enyo.Collection` a `parse` function to allow fetched data to be parsed or converted before being used.

For example, if your service provided request metadata in addition to the data array the collection would wrap:

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
            "height": 6.1
        },
        {
            "user_id": 2345,
            "name": "Gray",
            "hometown": "San Jose"
            "avatar": "/images/gray.png",
            "height": 6.0
        },
        {
            "user_id": 4567,
            "name": "Cole",
            "hometown": "San Clara"
            "avatar": "/images/cole.png",
            "height": 5.9
        }
    ]
}
```

... you could implement the following function to use only the `result` sub-array:

```
enyo.kind({
    name: "MyContactCollection",
    kind: "enyo.Collection",
    url: "http://myservice.com/users"
    parse: function(data) {        // incoming data contains {status:..., result:...}
        return data.result;        // returned data contains {[{user_id:..., name:...}, {...}]}
    }
});
```

## Sources

### Overview

`enyo.Source` is an abstraction provided by Enyo's data layer that encapsulates knowledge of how to fetch and commit models and collections to/from a data source.  The data "source" could be a remote service exposed as REST endpoints accessed via Ajax or Jsonp, a complex web API accessed through a 3rd-party JavaScript library, or even localStorage.

The abstract API for `enyo.Source` is as follows:

* `fetch` - Retrieves a model or collection, typically based on a unique resource identifier
* `commit` - Persists a model's current state to the source, creating a new record on the source if the model was created locally and not originally fetched from the source (not required for read-only sources)
* `destroy` - Deletes a model from the source (not required for read-only sources)
* `find` - Queries the source for a model or collection based on query attributes (optional)

Enyo 2.3 currently provides default sources for Ajax and Jsonp REST endpoints, via the `enyo.AjaxSource` ("`ajax`") and `enyo.JsonpSource` ("`jsonp`") sub-kinds.

### Specifying a source

When defining a custom `enyo.Model` or `enyo.Collection` sub-kind, you may specify the `defaultSource` property to indicate which source to use for fetching and committing records, using the short-hand name of the source (e.g. "`ajax`", "`jsonp`", etc.).

For example:

```
enyo.kind({
    name: "MyContactCollection",
    kind: "enyo.Collection",
    model: "MyContactModel",
    url: "http://myservice.com/users",
    source: "jsonp"        // use jsonp source instead of ajax for fetching
});
```
### Creating source sub-kinds

You may sub-kind existing sources to specify options to configure the fetching strategy, or to create brand new sources for accessing data not supported by existing source kinds.  Newly created sources must be registered with the data layer by calling the `enyo.store.addSources()` API.

For example, to create a sub-kind of `enyo.JsonpSource` to provide a custom `callback` property required by the JSONP endpoint, you could do the following:

```
enyo.kind({
    name: "MyJsonpSource",
    kind: "enyo.JsonpSource",
    // FIXME: shouldn't be this hard *****************************************
    constructor: function() {
        this.inherited(arguments);
        this._ajaxOptions = enyo.clone(this._ajaxOptions);
        this._ajaxOptions.push("callbackName");
    },
    callbackName: "kallback"
});
enyo.store.addSources({mysource: "MyJsonpSource"});
```

To create a brand-new source, implement the abstract API as necessary:

```
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
enyo.store.addSources({mysource: "MySource"});
```

For example, you could easily implement an `enyo.Source` that uses the [Facebook JavaScript SDK](https://developers.facebook.com/docs/reference/javascript/) to read/add posts a user's news feed as follows (note: authentication using that particular SDK is out of the scope of this section):

```
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
enyo.store.addSources({fbfeed: "FacebookFeedSource"});
```
## Binding models and collections to views

As already discussed above, using bindings in Enyo, we can easily bind properties from any `enyo.Object` or `enyo.Model` to properties of controls that make up your app views.  Without using bindings, one would typically programmatically initialize view properties and handle view events to keep the view and model data in sync programmatically.

### Binding to normal view properties

As an example, below is a view that gets its data from a model with `name` and `value` properties.  The slider value, input value, and name label are initialized based on the model at create time. The value property can be changed by dragging the slider or typing in the input, and the value shold be reflected in the model again.  This would be the typical way to implement such a view without using bindings:

```
enyo.kind({
    name: "MyControl",
    published: {
        model: ""
    },
    components: [
        {kind: "enyo.Control", name: "nameLabel"},
        {kind: "onyx.Slider", name: "slider", onChanging: "sliderChanging"},
        {kind: "enyo.Input", name: "input", oninput: "inputChanged"}
    ],
    create: function() {
        this.inherited(arguments);
        this.$.nameLabel("content", this.model.get("name"));
        this.$.slider.set("value", this.model.get("value"));
        this.$.input.set("value", this.model.get("value"));
    },
    sliderChanging: function(inSender, inEvent) {
        this.$.input.set("value", inEvent.value);
        this.model.set("value", inEvent.value)
    },
    inputChanged: function(inSender, inEvent) {
        this.$.slider.set("value", inSender.get("value"));
        this.model.set("value", inSender.get("value"));
    }
}); 
```
[Link to jsFiddle](http://jsfiddle.net/enyojs/Q45NW/)

Using bindings, this requires significantly less code, and can be done completely declaratively, making your code more readable and maintainable:

```
enyo.kind({
    name: "MyControl",
    published: {
        model: ""
    },
    components: [
        {kind: "enyo.Control", name: "nameLabel"},
        {kind: "onyx.Slider", name: "slider", onChanging: "sliderChanging"},
        {kind: "enyo.Input", name: "input", oninput: "inputChanged"}
    ],
    bindings: [
        {from: ".model.name", to: ".$.nameLabel.content"},
        {from: ".model.value", to: ".$.slider.value", oneWay: false},
        {from: ".model.value", to: ".$.input.value", oneWay: false}
    ]
}); 
```
[Link to jsFiddle](http://jsfiddle.net/enyojs/4n343/)

### Binding in collection-aware controls

Enyo also provides several "collection-aware" controls, which accept an `enyo.Collection` on their API, and then automatically generate controls based on data in the collection, and keep the child controls in sync with changes to the underlying collection and models.

The base-kind for these controls is `enyo.DataRepeater`.  This control is similar to `enyo.Repeater`, in that its child controls serve as a template for controls to be generated by the repeater, one for each child in the underlying data set.  However, instead of setting a count and responding to `setupItem` events to sync generated controls to the data models, `enyo.DataRepeater` generates one control for each model in the collection, and then assigns the corresponding model to each control, allowing bindings on that control to sync data to/from the models.

Again, without Collections or Bindings one might implement a simple repeater as follows:

```
enyo.kind({
    name: "",
    published: {
        data: null // expects plain JS array array
    },
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
However, the above code has a significant downside: if any records in the `data` array change, this kind has no way of knowing.  So it would require further communication between the kind that may be changing records and this view, to know that the repeater needs to be refreshed.

However, using the Collection-aware `enyo.DataRepeater` with an `enyo.Collection`, we can implement this view with much less code, and DataRepeater will keep the view in sync with changes to records in the collection:

```
enyo.kind({
    name: "",
    published: {
        data: null // expects an enyo.Collection
    },
    components: [
        {kind: "enyo.DataRepeater", name: "repeater", components: [
            {components: [
	            {kind: "enyo.Control", name: "nameLabel"},
	            {kind: "enyo.Control", name: "ageLabel"}
            ], bindings: [
            	{from: ".model.name", to: ".$.nameLabel.content"},
            	{from: ".model.age", to: ".$.ageLabel.content"}
            ]}
        ]}
    ],
}); 
```
