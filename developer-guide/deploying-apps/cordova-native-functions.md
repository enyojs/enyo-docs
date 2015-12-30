% Making Use of Cordova's Native Functions

In this document, we examine the relationship between Enyo and Cordova (a.k.a.
"PhoneGap"), making reference to a simple app that consists of the following
code inside an `app.js` file:

```javascript
    var kind = require('enyo/kind'),
        Signals = require('enyo/Signals'),
        ready = require('enyo/ready');

    ready(function() {
        kind({
            name: "App",
            components: [
                {kind: Signals, ondeviceready: "deviceReady"},
                {content: "Hello, World!"}
            ],
            deviceReady: function() {
                // respond to deviceready event
            }
        });
        new App().renderInto(document.body);
    });
```

## Enyo and Cordova

When an application is first launched, Cordova sends a `"deviceready"` event to
the document body.  This event tells us that the application has been launched
and Cordova has been loaded.  It is at this point that we can use Enyo to render
the application.

Fortunately, Enyo 2 has added native support for listening to this event.  If
you are using the [latest Enyo 2 build](https://github.com/enyojs/enyo) from
GitHub, you already have the file that provides this ability, namely,
`enyo/source/dom/cordova.js`.

In Enyo 2, `cordova.js` automatically sends notifications via
[enyo/Signals]($api/#/kind/Signals/Signals) when certain Cordova events are
detected.

The following Cordova events are supported:

* deviceready
* pause
* resume
* online
* offline
* backbutton
* batterycritical
* batterylow
* batterystatus
* menubutton
* searchbutton
* startcallbutton
* endcallbutton
* volumedownbutton
* volumeupbutton

**Additional Reading**

* [Event Handling](../key-concepts/event-handling.html)
