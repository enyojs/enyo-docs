% Making Use of Cordova's Native Functions

In this document, we examine the relationship between Enyo and Cordova (a.k.a.
"PhoneGap"), making reference to a simple app that consists of the following
code inside an `index.html` file:

```html
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, height=device-height,
            initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>

        <title>Enyo and Cordova</title>

        <!-- Cordova (i.e., PhoneGap) -->
        <script src="cordova-1.8.1.js" type="text/javascript" charset="utf-8"></script>

        <!-- Enyo -->
        <script src="enyo/enyo.js" type="text/javascript"></script>
    </head>
    <body>
        <script>
            // Application kind
            enyo.kind({
                name: "App",
                components: [
                    {kind: "Signals", ondeviceready: "deviceReady"},
                    {content: "Hello, World!"}
                ],
                deviceReady: function() {
                    // respond to deviceready event
                }
            });
            new App().renderInto(document.body);
        </script>
    </body>
    </html>
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
[enyo.Signals]($api/#/kind/enyo.Signals) when certain Cordova events are
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

In order to respond to one of these events, we add an `enyo.Signals` instance to
our application, e.g.:

```javascript
    enyo.kind({
        name: "App",
        components: [
            {kind: "Signals", ondeviceready: "deviceReady"},
            {content: "Hello, World!"}
        ],
        deviceReady: function() {
            // respond to deviceready event
        }
    });
```

**Additional Reading**

* [Event Handling](../key-concepts/event-handling.html)
