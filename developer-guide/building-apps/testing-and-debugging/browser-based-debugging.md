% Browser-Based Debugging

While acknowledging that debugging is a subject on which entire books are
written, and that each software project presents its own unique challenges, the
Enyo team would like to offer some general guidance as you work to perfect your
application.

Whatever the details of your situation, there are two essential rules of Enyo
debugging:

* It's much easier to debug an Enyo app running in a desktop browser than one
    running on a device, so debug in a desktop browser whenever possible.

* When debugging, load your app's `debug.html` file and not its `index.html`
    file.

We'll discuss both of these points in detail below.

Of course, there will likely be times when debugging in a browser won't satisfy
your needs--if your app interacts with on-device services, for example, or if
it exhibits bad behavior only when running on a particular device platform.  So
we'll also look at the options available for debugging Enyo apps running on
devices.

## Desktop Browsers

As an Enyo app developer, you have an assortment of powerful, free debugging
tools at your disposal, since all of the major desktop browsers now have
built-in tools for JavaScript developers.  Modern browsers combine standard
debug tools--a console for displaying log output (from calls to
[enyo.log]($api/#/namespace/enyo:log)), the ability to set breakpoints, and so
on--with Web-specific tools, such as DOM and CSS inspectors (which are
particularly useful for tracking down UI glitches).

Refer to the following instructions to access the developer tools in your
browser of choice.

### Chrome

To access the WebKit Inspector, enter `Command-Option-I` on Mac or
`Control-Shift-I` on Windows.

### Safari

To enable the `Develop` menu, select `Edit > Preferences > Advanced`; then check
the box marked `"Show Develop menu in menu bar"`.

To access the WebKit Inspector, enter `Command-Option-I` on Mac, or
`Control-Alt-I` on Windows.

### Firefox

To install the Firebug debugger, open `Firefox > Web Developer > Get More Tools`;
then click the `Add to Firefox` button.

Once installed, access Firebug by opening `Firefox > Web Developer > Firebug >
Open Firebug`.

To access the Developer Toolbar, enter `Shift-F2` on Mac or Windows.

### Internet Explorer

To access the Developer Tools, enter `F12`.

## Mobile Browsers

Whenever you debug an app that's running on a device, you'll follow the same
basic process--first, establish a connection between the device and a more
powerful machine (typically a desktop or laptop computer), then use tools on
that machine to remotely monitor output from your app on the device.

For detailed information on how to proceed on a variety of mobile platforms,
follow the links listed below.

### iOS

#### iOS 6+

In iOS 6 and later, you can debug a Safari or Cordova/PhoneGap app on a device
or in the simulator through a remote WebKit Inspector connection via Safari 6 on
Mac.

* On the device, select `Settings > Safari > Advanced > Enable Web Inspector`.
* Connect the device to your Mac via USB.
* In Safari 6 on your Mac, select `Develop menu > select iOS Device`.
* [More details](http://webdesign.tutsplus.com/tutorials/workflow-tutorials/quick-tip-using-web-inspector-to-debug-mobile-safari/)

#### iOS 5

In iOS 5, you can debug a Safari or Cordova/PhoneGap app in the simulator only
(not on a device) using [iWebInspector](http://www.iwebinspector.com/).

### Android

#### Chrome for Android

* [Guide to Remote Debugging](https://developers.google.com/chrome/mobile/docs/debugging)

#### Firefox for Android

* [Setting Up Remote Debugging](https://hacks.mozilla.org/2012/08/remote-debugging-on-firefox-for-android/)
* [Remote Web Console](http://starkravingfinkle.org/blog/2012/10/firefox-for-android-remote-web-console-is-here)

### Cross-Platform

* [Weinre](http://debug.phonegap.com/): Remote debugging for mobile Web apps.
    Part of the [Cordova](http://incubator.apache.org/cordova/) (PhoneGap) open
    source project.

* [Socketbug](http://socketbug.com): An open-source remote debugging utility
    using [Socket.IO](http://socket.io/)

## Other Tools

* Some third-party JavaScript IDEs include their own debuggers.  One example is
    [JetBrains WebStorm](http://www.jetbrains.com/webstorm/), a commercial
    product compatible with Windows, Mac, and Linux.

* [JSONLint](http://www.jsonlint.com/): This Web site takes amorphous blobs of
    JSON data and makes them readable.  It complains about JSONP results, but
    still manages to reformat all of the internals for viewing.

## Loading Debug Source (debug.html)

If your app is based on `bootplate-moonstone` (or some other variation of the
Bootplate template), be sure to load the `debug.html` file (rather than
`index.html`) when debugging.  This will ensure that the app is loaded without
using any minimized files (i.e., the optimized versions of `app.js`, `app.css`,
`enyo.js`, and `enyo.css` that are created when you run the `deploy` script).
These files are best suited to final deployment; when loaded during
development, they make it harder to pin down the source of any errors that
occur.  Moreover, even if you debug with the optimized files loaded, any fixes
you make will eventually need to go in the original, non-optimized source
code--so it makes sense to work with the original source throughout the
debugging process.

If you're not using the Bootplate template, you can still prevent your app from
loading the minimized files by editing your host HTML file.  Be sure to load
`enyo.js` from the top level of a full `enyo` distribution and `package.js` from
your application's source folder.  For example, the `<head>` section of the host
HTML file might contain the following:

```html
    <!-- enyo (debug) -->
    <script src="enyo/enyo.js"></script>
    <!-- application (debug) -->
    <script src="source/package.js" type="text/javascript"></script>
```

## Basic Tips

Most of the time, your Enyo app will be running in one of two states--initial
application generation or normal runtime event handling.  If you suspect a
problem is occurring during app creation, you could put a breakpoint on the main
`renderInto()` call for your app object and step through the code from there.
However, this will take you through a lot of internal framework code.  Instead,
you may find it helpful to set breakpoints on particularly complex `create()` or
`rendered()` calls in your kinds.

(Keep in mind that you may invoke the JavaScript keyword `"debugger"` in your
code to force a break at a given line, in addition to using the
breakpoint-setting capabilities of your browser's debugger.)

All named Enyo components are available from the `enyo.$` hash, so inspecting
that variable will show all the created objects in your application.  The
generated ids are based on the hierarchy of your application, so you can use
names to help with auto-completion.  For an individual Enyo object, its own `$`
hash shows what is owned by that object.

For tracing events, it's often useful to set a conditional breakpoint on
`enyo.dispatcher.dispatch` based on the value of `e.type`.  This will let you
avoid stopping on events you don't care about.  You can then step through the
code to see how the event is routed from its original target up through the
ownership hierarchy.

## Console Debugging

By watching the console in the debugger, you can sometimes detect errors from
the JavaScript engine that aren't caught by exception handlers.

In general, you should use the [enyo.log]($api/#/namespace/enyo:log) methods
(`enyo.log()`, `enyo.warn()`, and `enyo.error()`) instead of calling
`console.log()` directly, since `enyo.log()` has better cross-platform support.
(For example, you'll get errors in IE8 if you call `console.log()` when the
Developer Tools aren't open, since the act of opening the tools creates the
`window.console` object, which otherwise doesn't exist.)

A little-known (but very useful) fact is that calling `this.log()` from any Enyo
kind will prepend the kind and function names to the log message, saving you the
time and effort of manually logging that basic data.

## Common Pitfalls

### Startup

* Remember to call `this.inherited(arguments)` when overriding `create()`.
    Failure to do this usually results in bad references on `this.$`, since the
    owned components aren't instantiated.

### Rendering

*	Remember to call `this.inherited(arguments)` when overriding `render()`.
    Failure to do so usually results in layout code's failing to run, resulting
    in bad layout, but often no errors.

### Layout

*	Scrollers and Lists always need a height.  This is typically assigned in one
    of the following ways:

    * By specifying an explicit CSS height
    * By applying the `'enyo-fit'` class
    * By setting `'fit: true'` on the object in a
        [Fittable layout]($api/#/kind/enyo.FittableLayout)
    * By being placed in an [enyo.Panels]($api/#/kind/enyo.Panels)
        whose arranger fits the panel height

*	A Fittable may only have `'fit: true'` set for one component; doing so for
    multiple components will result in bad layout.
