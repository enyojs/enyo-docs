% Platform-Specific Deployment

The instructions that follow assume that you have completed the development phase
of an Enyo-based application as well as the optimization phase (i.e., running the
`deploy` script and removing any unnecessary files from the project) and that you
are now ready to create a final product for deployment to your platform of choice.

## Deploying as a Mobile Application

### Deploying to iOS Using Cordova (PhoneGap)

1. Follow the instructions in the [Cordova Getting Started
    Guide][getting-started]
    to install Cordova and create a basic iOS Cordova app.

2. Now drop your Enyo-based app files into the `www` directory created in step 1.

3. Add the following `<meta>` tag to `index.html` for proper display on device:

        <meta name="viewport"; content="width=device-width, initial-scale=1.0,
            maximum-scale=1.0, user-scalable=no" />

From here you can follow the instructions in the Cordova Getting Started Guide
to deploy to the simulator or device.  To submit your app to the Apple App
Store, you'll need to sign up for a developer account and review the
documentation provided at <http://developer.apple.com>.

Finally, if your project requires access to Cordova's native functionality,
follow the directions in [Making Use of Cordova's Native Functions][native-functions].

### Deploying to Android Using Cordova

1. Follow the instructions in the [Cordova Getting Started
    Guide][getting-started] to install Cordova and create a basic Android
    Cordova app.

2. Now drop your Enyo-based app files into the `www` directory created in step 1.

3. Add the following `<meta>` tag to `index.html` for proper display on device:

        <meta name="viewport"; content="width=device-width, initial-scale=1.0,
            maximum-scale=1.0, user-scalable=no" />

From here you can follow the instructions in the Cordova Getting Started Guide
to deploy to the emulator or device.  To publish your app on Google Play, you'll
need to sign up for a developer account and review the documentation provided at
<http://developer.android.com>.

Finally, if your project requires access to Cordova's native functionality,
follow the directions in [Making Use of Cordova's Native Functions][native-functions].

### Deploying to Windows Phone Using Cordova

1. Follow the instructions in the [Cordova Getting Started
    Guide][getting-started] to install Cordova and create a basic Windows Phone
    Cordova app.

2. Now drop your Enyo-based app files into the `www` directory created in step 1.

3.	Add the following viewport rule to `css/index.css` for proper display on device:

        @-ms-viewport {
            width: device-width;
            height: device-height;
            user-zoom: fixed;
            max-zoom: 1;
            min-zoom: 1;
        }

From here you can follow the instructions in the Cordova Getting Started Guide
to deploy to the simulator or device.  To submit your app to the Microsoft
Windows Phone Store, you'll need to sign up for a developer account and review
the documentation provided at <https://dev.windowsphone.com/en-us>.

Finally, if your project requires access to Cordova's native functionality,
follow the directions in [Making Use of Cordova's Native Functions][native-functions].

### Deploying to Open webOS Using Cordova

You may recall that Enyo 1.0 was the preferred framework for developing
applications in webOS 3.0.x.  Enyo 1.0 was tightly integrated with the operating
system, providing many webOS-specific features to facilitate app development.

With Enyo 2 and Open webOS, however, the framework and OS have been decoupled;
you are free to use either one alone, or both of them together.  If you use them
together, please be aware that Enyo 2 no longer contains functionality specific
to webOS.

The Open webOS team recommends that you use the [Cordova JavaScript
library](http://phonegap.com/download/) to provide the layer connecting
application and device.

If, for example, you want to use the
[Bootplate](https://github.com/enyojs/enyo/wiki/Bootplate) template app with
Open webOS, first modify the `<head>` section of Bootplate's `index.html` file
by inserting the following line to load Cordova before Enyo:

        <script src="cordova-2.7.0.js"></script>

Enyo supports Cordova events out of the box; you may subscribe to them using
`enyo.Signals`.  To listen for Cordova's startup event (`onDeviceReady`), add
the following to your main app kind's `components` block:

        {kind: "Signals", ondeviceready: "deviceready"}

`onDeviceReady` will be sent as soon as Cordova detects that the device is
ready.  If you need to call any Cordova functions on initialization, simply
place them in the `deviceready()` function.

Additional information on using Enyo with Open webOS is available on the [Open
webOS Web site](http://blog.openwebosproject.org/post/39278618299/javascript-apps-for-open-webos-with-enyo-and-cordova).

### Deploying as a Mobile App Using PhoneGap Build

1. Create a zip file of your project.

2. Upload the zip file into your PhoneGap Build application (follow the
    instructions on the [Web site](https://build.phonegap.com/)).

3. PhoneGap Build outputs application packages for various platforms.

## Deploying as a Google Chrome Application

1. Create a `manifest.json` file in your application's root directory, e.g.:

        {
            "name": "Testplate",
            "version": "1.0",
            "manifest_version": 1,
            "description": "Enyo extension.",
            "app": {
                "launch": {
                    "local_path": "index.html"
                }
            }
        }

2. In Google Chrome, choose **Tools|Extensions**, then pick **Load Unpacked
    Extension** and select your deployment folder (e.g., `myapp-deploy`).

3. A generic application icon appears on your Chrome Apps page that will invoke
    this app.

4. Refer to the
    [Chrome documentation](https://developer.chrome.com/apps/about_apps.html)
    for more information on manifest files and the actual packaging of an
    application.

## Deploying as a Windows 8 App

For information on building apps for PCs and tablets running Windows 8, to be
deployed via the Windows Store, please see
[Enyo Apps on Windows 8](enyo-apps-on-windows-8.html).

## Deploying as an Installable Windows Application

Intel has discontinued its online Encapsulator tool for creating Windows
executables from Web applications.  However, they have published an article on
their Web site providing detailed [instructions for building your own app
container](http://software.intel.com/en-us/articles/do-it-yourself-chromium-base-web-application-container).

**Additional Reading**

* [Cordova Native Functions][native-functions]

[native-functions]: cordova-native-functions.html
[getting-started]: http://docs.phonegap.com/en/2.7.0/guide_getting-started_index.md.html#Getting%20Started%20Guides