% Consuming Web Services

In this article, we look at how the Enyo framework enables apps to work with
services in general, and Web services in particular.

In Enyo, Web requests are made using either the
[enyo.Ajax]($api/#/kind/enyo.Ajax) object or the
[enyo.WebService]($api/#/kind/enyo.WebService) component.  `enyo.Ajax` derives
directly from [enyo.Async]($api/#/kind/enyo.Async), the base kind for handling
asynchronous operations.  `enyo.WebService` manages HTTP transactions by using
either `enyo.Ajax` or [enyo.JsonpRequest]($api/#/kind/enyo.JsonpRequest), which
is another subkind of `enyo.Async`.

Considering the central role of `Async`, it makes sense to begin our discussion
there.

## enyo.Async

[enyo.Async]($api/#/kind/enyo.Async), again, is a generalized kind for dealing
with asynchronous transactions.

`enyo.Async` is an **Object**, not a **Component**; thus, you may not declare an
`Async` in a `components` block.  If you want to use `Async` as a component, you
should probably be using [enyo.WebService]($api/#/kind/enyo.WebService) instead.
(See the section on `WebService` below.)

An Async object represents a task that has not yet completed.  You may attach
callback functions to an Async, to be called when the task completes or
encounters an error.

To use an Async, create a new instance of `enyo.Async` or a kind derived from
it, then register handlers in the `response()` and `error()` methods.

Start the asynchronous operation by calling `go()`.

Handlers may either be methods with the signature `(asyncObject, value)` or new
instances of `enyo.Async` or its subkinds.  This allows for chaining of Async
objects (e.g., when calling a Web API).

If a response method returns a value (other than `undefined`), that value is
sent to subsequent handlers in the chain, replacing the original value.

A failure method may call `recover()` to undo the error condition and switch
to calling response methods.

The default implementation of `go()` causes all the response handlers to be
called (asynchronously).

The following (rather complicated) example demonstrates many of the
aforementioned features:

```javascript
    var transaction = function() {
        // Create a transaction object.
        var async = new enyo.Async();
        // Cause handlers to fire asynchronously (sometime after we yield this thread).
        // "initial response" will be sent to handlers as inResponse
        async.go("intial response");
        // Until we yield the thread, we can continue to add handlers.
        async.response(function(inSender, inResponse) {
            console.log("first response: returning a string,",
                "subsequent handlers receive this value for 'inResponse'");
            return "some response";
        });
        return async;
    };
```

Users of the `transaction()` function may add handlers to the Async object
until all functions return (synchronously):

```javascript
    // Get a new transaction; it's been started, but we can add more handlers
    // synchronously.
    var x = transaction();

    // Add a handler that will be called if an error is detected. This handler
    // recovers and sends a custom message.
    x.error(function(inSender, inResponse) {
        console.log("error: calling recover", inResponse);
        this.recover();
        return "recovered message";
    });

    // Add a response handler that halts response handler and triggers the
    // error chain. The error will be sent to the error handler registered
    // above, which will restart the handler chain.
    x.response(function(inSender, inResponse) {
        console.log("response: calling fail");
        this.fail(inResponse);
    });

    // Recovered message will end up here.
    x.response(function(inSender, inResponse) {
        console.log("response: ", inResponse);
    });
```

## enyo.Ajax

[enyo.Ajax]($api/#/kind/enyo.Ajax) extends `enyo.Async`, providing a wrapper
for JavaScript's XmlHttpRequest (XHR) API.

`enyo.Ajax` publishes all the properties of the
[enyo.AjaxProperties]($api/#/namespace/enyo.AjaxProperties) object.  You may set
values for these properties to customize different aspects of your HTTP request,
such as the url, method, optional headers, and username and password for
authentication.

Like `enyo.Async`, `enyo.Ajax` is an Object, not a Component.  Do not try to
make `enyo.Ajax` objects inside a `components` block.

Also like `enyo.Async`, if you find yourself wanting to use `enyo.Ajax` as a
component, you should probably be using `WebService` instead.  (By default,
`WebService` uses `enyo.Ajax` internally to manage HTTP transactions.)

The following example uses `enyo.Ajax` to retrieve a unique id from Yahoo!
corresponding to the passed-in place name:

```javascript
    getWoeid: function(inPlace) {
        // set up enyo.AjaxProperties by sending them to the enyo.Ajax constructor
        var x = new enyo.Ajax({url: "http://query.yahooapis.com/v1/public/yql?format=json"});
        // send parameters the remote service using the 'go()' method
        x.go({
            q: 'select woeid from geo.placefinder where text="' + inPlace + '"'
        });
        // attach responders to the transaction object
        x.response(this, function(inSender, inResponse) {
            // extra information from response object
            var woeid = inResponse.data.query.results.Result.woeid;
            // do something with it
            this.setWoeid(inPlace, woeid);
        });
    }
```

For additional examples of `enyo.Ajax` in action, look under `"Enyo Core > Ajax"`
in the [Sampler app](http://enyojs.com/sampler/) on enyojs.com.  (The Sampler
also includes examples using `JsonpRequest` and `WebService`.)

## enyo.JsonpRequest

[enyo.JsonpRequest]($api/#/kind/enyo.JsonpRequest) is a specialized form of
`enyo.Async` used for making JSONP requests to a remote server (which must, of
course, support such requests).  This differs from the normal XmlHttpRequest
call in that the external resource is loaded using a `<script>` tag.

`enyo.JsonpRequest` is useful when an application needs to load data from a
different domain.  JSONP lets us work around the browser security model for
cross-origin requests, in which cross-origin XHRs can only be made to the same
server the page is loaded from (unless the server supports cross-origin
resource sharing, aka "CORS").  In a JSONP request, this restriction does not
come into play because a browser will load scripts from any address.

In addition to using `enyo.JsonpRequest` directly, you can make a JSONP request
using `WebService` by setting `jsonp: true` on the `WebService` instance.  When
you do this, `WebService` will use `enyo.JsonpRequest` internally to manage the
HTTP transaction.

## enyo.WebService

[enyo.WebService]($api/#/kind/enyo.WebService) is a component that performs XHR
requests; it acts as a wrapper for the `Async` subkinds `enyo.Ajax` and
`enyo.JsonpRequest`, using these subkinds internally to manage HTTP
transactions.

`enyo.WebService` uses `enyo.Ajax` by default and, like `enyo.Ajax`, it
publishes all the properties of the
[enyo.AjaxProperties]($api/#/namespace/enyo.AjaxProperties) object.  You may
customize your HTTP request by setting values for these properties on a given
`WebService` instance.

To have a `WebService` instance use `enyo.JsonpRequest` instead of `enyo.Ajax`,
set `jsonp: true` on the instance.

The `send()` method sends the request, returning the Async instance used.  The
response data comes in the `data` field of an incoming `onResponse` or `onError`
event object.

## enyo.Ajax vs. enyo.WebService

By this point, you may have noticed that there is a lot of overlap in what
`enyo.WebService` and `enyo.Ajax` can do.  In general, we recommend using
`enyo.Ajax`, as it has the advantage of not needing to be declared as a
component.  However, `enyo.WebService` works better if you want to declare your
AJAX endpoints as part of the `components` block.
