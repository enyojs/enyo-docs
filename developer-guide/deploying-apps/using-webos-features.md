% Using webOS Features

## Built-in webOS Events

Included within the webOS system itself are the following custom document
events:

* `webOSLaunch`: Dispatched when the application launches and the launch
    parameters are received.  The launch parameters are included within the
    event data.  Note that this does not necessarily mean that the application
    has been loaded or rendered.

* `webOSRelaunch`: Dispatched when an already-running application is launched,
    potentially with new launch parameters.

* `webOSLocaleChange`: Dispatched when the system changes its language settings.

## enyo-cordova

Cordova features a cross-platform standard for [various device
APIs](http://docs.phonegap.com/en/2.7.0/index.html) such as geolocation and
in-app-browser.  The Enyo library `enyo-cordova` encapsulates Cordova for all
platforms, dynamically choosing the right version based on the device running
the application (e.g., the webOS version of Cordova on webOS TVs).

In addition, [Enyo signals]($api/#/kind/enyo/Signals/Signals) are set up for all
[Cordova-based events](http://docs.phonegap.com/en/2.7.0/index.html) for easy
use within Enyo applications. For example:

```javascript
    var
        kind = require('enyo/kind'),
        Signals = require('enyo/Signals');

    module.exports = kind({
        name: "App",
        components: [
            {kind: Signals, ondeviceready: "deviceready"},
            ...
        ],
        deviceready: function(inSender, inEvent) {
            // After deviceready, Cordova is loaded and ready to be used
        }
    });
```

## enyo-webos

The `enyo-webos` library has a number of features designed exclusively for the
webOS platform.  These include components that make webOS service calls easier
to manage, as well as Enyo signal generation for the webOS events mentioned
above.

### ServiceRequest and LunaService

Two components that allow for integration of webOS services into Enyo
applications are [enyo-webos/ServiceRequest]($api/#/kind/enyo-webos/ServiceRequest/ServiceRequest)
and [enyo-webos/LunaService]($api/#/kind/enyo-webos/LunaService/LunaService).
They may be viewed as being analogous to [enyo/Ajax]($api/#/kind/enyo/Ajax/Ajax)
and [enyo/WebService]($api/#/kind/enyo/WebService/WebService), respectively.

ServiceRequest is based on [enyo/Async]($api/#/kind/enyo/Async/Async); the
constructor takes the service name, method, parameters, and an optional
subscription flag.

```javascript
    var
        ServiceRequest = require('enyo-webos/ServiceRequest');

    var request = new ServiceRequest({
        service: 'luna://com.palm.connectionmanager',
        method: 'getstatus'
    });
    request.response(this, function(inSender, inResponse) {
        // service request succeeded with returned data within inResponse
    });
    request.go({});
```

Building upon this, LunaService provides a reusable component for interacting
with webOS services.

```javascript
    var
        kind = require('enyo/kind'),
        LunaService = require('enyo-webos/LunaService');

    module.exports = kind({
        name: "App",
        components: [
            {name: 'netstat', kind: LunaService, service: 'luna://com.palm.connectionmanager',
                method: 'getstatus', onResponse: 'serviceResponse'},
            ...
        ],
        getConnectionStatus: function() {
            var request = this.$.netstat.send({});
        },
        serviceResponse: function(inSender, inResponse) {
            // service request succeeded with returned data within inResponse
        }
    });
```

### webOS.js

In much the same way that `enyo-cordova` includes the standalone Cordova
library, `enyo-webos` includes the standalone `webOS.js` library.  `webOS.js`
focuses on providing webOS-specific functionality in a streamlined package, with
support for both Open webOS and webOS for TV in a single API set.  Included in
`webOS.js` are the following modules:

* Application
* DeviceInfo
* PmLogLib
* Service Core
* System Notifications
* Window
