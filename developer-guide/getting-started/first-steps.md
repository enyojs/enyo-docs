% First Steps with Enyo

## Preparing Your Development Environment

As an Enyo developer, you have a great deal of freedom in choosing the platform
and tools you use to code your applications.  You may work in a Windows, Mac, or
Linux environment.  Only a few simple tools are needed to get up and running.

### Text Editor

Strictly speaking, the only requirement to write Enyo code is a text editor.
Just about any text editor will suffice, including basic freeware options such
as [Notepad++](http://notepad-plus-plus.org/) (Windows) or
[TextWrangler](http://www.barebones.com/products/textwrangler/) (Mac).  For what
it's worth, most developers on the Enyo team use either [Sublime
Text](http://www.sublimetext.com/), which is available for Mac, Windows, and
Linux, or the Mac-only [TextMate](http://macromates.com/).  We have also heard
good things about the multi-platform [WebStorm](https://www.jetbrains.com/webstorm/)
IDE.

### Node.js

Next, you'll need to have [Node.js](http://nodejs.org) installed on your
development machine.  Enyo's build system requires Node version `4.0` or
later.  If Node is not installed, you will need to install it; if you have an
outdated version, you will need to update it.  To check the version of a Node
installation, use the command `node --version`.

### enyo-dev

Once Node is in place, you'll need the tools provided by the
[enyo-dev](https://github.com/enyojs/enyo-dev) module.  Use the following
command to install the `enyo-dev` tool:

```
    npm install -g enyo-dev
```

You may need to run `npm install` as `root`, i.e., `sudo npm install -g enyo-dev`.)

### Web Browser and Web Server

During your development process, you may test your code using any modern Web
browser.  While it is possible to test by loading files into the browser
directly from the local file system, we strongly suggest that you access the
application through an HTTP server.  This approach provides numerous benefits,
including the ability to test from remote devices.

Running your app on a Web server will also let you avoid dealing with the Chrome
browser's AJAX security restrictions.  If you choose to develop in Chrome *and*
load your app directly from the file system, you'll need to launch the browser
using the command-line switch `"--allow-file-access-from-files"`.  (On Windows,
you can do this by creating a shortcut to `chrome.exe` and adding the switch to
the end of the shortcut's Target property.  Then use the shortcut each time you
launch the browser.  A similar approach should work on Mac and Linux as well.)

If you are not currently running a local Web server, you may want to use
a stand-alone server that can be launched where and when needed. One such option
is the npm module [serve](https://www.npmjs.com/package/serve). Install it
using the following command:

```
    npm install -g serve
```

This module can launch a web server (by default on port 3000) in the directory
of your choice. For example, `serve dist` will serve your built enyo
application.

Alternatively, if you need a more robust solution, you may want to install an
Apache/MySQL/PHP software bundle, such as [BitNami
WAMPStack](http://bitnami.org/stack/wampstack) (Windows) or
[MAMP](http://www.mamp.info/en/index.html) (Mac).

## Next Steps

Now that you have all the necessary tools, try creating a new app using the
instructions in [Creating and Building an App](creating-and-building-an-app.html).

Or, if you haven't already done so, take a look at the [Moonstone App
Tutorial](moonstone-app-tutorial.html).
