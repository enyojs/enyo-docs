# Getting Started with Enyo 2

## Development Environment

As an Enyo developer, you have a great deal of freedom in choosing the platform
and tools you use to code your applications.  You may work in a Windows, Mac, or
Linux environment; to write Enyo code, all you need is a text editor.  Just
about any text editor will suffice, including basic freeware options such as
[Notepad++](http://notepad-plus-plus.org/) (Windows) or
[TextWrangler](http://www.barebones.com/products/textwrangler/) (Mac).

During your development, you may test your code using any modern Web browser.
While it is possible to test by loading files into the browser directly from the
local file system, we strongly suggest that you access the application through
an http server.  This approach provides numerous benefits, including the ability
to test from remote devices.

If you are not currently running a local Web server, you may find it convenient
to install an Apache/MySQL/PHP software bundle, such as
[BitNami WAMPStack](http://bitnami.org/stack/wampstack) (Windows) or
[MAMP](http://www.mamp.info/en/index.html) (Mac).

**Note:** Because of security restrictions, if you choose to develop in Chrome
*and* load your app directly from the file system, you'll need to launch the
browser using the command-line switch `"--allow-file-access-from-files"`.  On
Windows, you can do this by creating a shortcut to `chrome.exe` and adding the
switch to the end of the shortcut's Target property. Then use the shortcut each
time you launch the browser.  A similar approach should work on Mac and Linux as
well.

## Obtaining the Enyo Source Code

(**Note:** Instructions for grabbing the Enyo code and starting an app as quickly
as possible are available in the [Bootplate](bootplate.html) and
[Dupliforking](dupliforking.html) documents.  This article provides more detailed
background information and, as such, you may benefit from reading through it at
least once before making use of the bootplate template.)

The Enyo source is available as a downloadable zip archive from
[enyojs.com](http://enyojs.com), or via git source control from the
[enyojs project](http://github.com/enyojs) on GitHub.

If you decide to work with the Enyo repositories on GitHub, the code retrieval
process follows standard practice.

For example, from a command-line git client,

        git clone --recursive git@github.com:enyojs/bootplate.git <myapp>

will clone the "bootplate" app template to a directory called `<myapp>` on your
local computer, and

        git clone git@github.com:enyojs/enyo.git <local-enyo-dir>

will clone the core Enyo code to a local directory called `<local-enyo-dir>`.

(**Note:** If you plan to submit changes back to a repository, create your own
fork of the repository and clone the fork to your local machine.)

## Enyo Core and Plugins

Whichever way you obtain the source, if you are developing an application, you
will most likely want to embed a copy of the core Enyo code in the app.  By
convention, this code resides in a directory called `enyo` within the application
directory.

It can sometimes be helpful to think of Enyo projects in terms of discrete tiers
of code, with the Enyo core forming the foundation.  A typical Enyo application
will have two additional tiers--one consisting of reusable libraries (or
"plugins"), and the other of actual application source.

Plugin code may come from the Enyo project itself (e.g., the Onyx widget
library), from the open source community, or from one's own development efforts.
By convention, plugins are placed in a directory called `lib`, giving us the
following app structure:

        <app>
            enyo/
            lib/

(**Note:** A more detailed discussion of application structure may be found in
[Structuring Your Project](../best-practices/structuring-your-project.html).)

## Starting an App

At this point, everything is in place for you to begin writing Enyo
applications.  Your first app can be as simple as a single HTML file.

For example, we can create a minimal "HelloWorld" app by placing the following
code in `index.html`:

        <!doctype html>
        <html>
        <head>
            <title>Enyo Hello</title>
            <!-- load debug version of Enyo -->
            <script src="enyo/enyo.js"></script>
        </head>
        <body>
            <script>new enyo.Control({content: "Hello From Enyo"}).write();</script>
        </body>
        </html>

Now our app folder looks like this:

        <app>
            enyo/
            lib/
            index.html

If we decide to use a plugin, we can load it directly via `<script>` tag, e.g.:

        <!doctype html>
        <html>
        <head>
            <title>Enyo Hello</title>
            <!-- load debug version of Enyo -->
            <script src="enyo/enyo.js"></script>
            <!-- load debug version of plugin -->
            <script src="lib/aPlugin/source/package.js"></script>
        </head>
        <body>
        <script>
            // make a custom Control based on CoolKind from aPlugin
            enyo.kind({
                name: "App",
                kind: "aPlugin.CoolKind",
                coolness: true
            });
            new App().write();
        </script>
        </body>
        </html>

Notice that to load the plugin, we load a `package.js` file.  An Enyo resource
can use a `package.js` file as a manifest--that is, a description of what is
needed to load the plugin.  Typically, it's a list of scripts and stylesheets.
(`package.js` is discussed in greater detail in its own section below.) 

## Factoring Into Files

In the early stages of development, it's not unusual to create a fair amount of
application code directly in this HTML file.  However, we soon reach a point
where the single file becomes unmanageable and we want to split its contents
into separate files.

The convention in Enyo is to place an application's source code in a
subdirectory called `source`.  The `source` directory typically starts out with
a file of application source code (`App.js`) and a file of CSS styles
(`App.css`).

Once the app source and styles have been factored out, we have the following
file structure:

        <app>
            enyo/
            lib/
            source/
                App.js
                App.css
            index.html

And our `index.html` has the following contents:

        <!doctype html>
        <html>
        <head>
            <title>Enyo Hello</title>
            <!-- load debug version of Enyo -->
            <script src="enyo/enyo.js"></script>
            <!-- load debug version of plugin -->
            <script src="lib/aPlugin/source/package.js"></script>
            <!-- load our application css -->
            <script src="source/App.css"></script>
            <!-- load our application source -->
            <script src="source/App.js"></script>
        </head>
        <body>
            <script>new App().write();</script>
        </body>
        </html>

Notice that as the application grows in complexity, so, too, does the `<head>`
section of the index file.

## package.js

We saw earlier that `aPlugin` has a `package.js` file with instructions for
loading the plugin; now it makes sense to create a `package.js` file for the
application itself:

        enyo.depends(
            "$lib/aPlugin/source",
            "App.css",
            "App.js"
        );

Some things to note about this file:

* **THE FILE NAME MUST NOT BE CHANGED.**  If you change the name to something
    other than `package.js`, your application will almost certainly fail to
    load.

* The `$lib` alias: Enyo uses `$` aliases to simplify paths.  By default, there
    are only two such aliases, `$enyo`, which refers to the `enyo` root folder, and
    `$lib`, which refers to a `lib` folder, peer to `enyo` (aka `$enyo/../lib`).

* Loading a plugin will create an alias for that plugin.  After loading the
    `package.js` file for aPlugin, we will have the alias `$aPlugin`.  Such
    aliases are particularly useful for referencing static content from the
    referenced folders (e.g., images or JSON data).

* Non-absolute paths are relative to the folder containing `package.js`, so
    `App.css` and `App.js` are in the same folder as `package.js`.  (In this
    example, they are all in the `source` folder.)

* This package file can be used as input to the _minifier_ tool.  The minifier
    concatenates and compresses source files into one file each for JavaScript
    and CSS.  The two concatenated and compressed files load much faster than
    numerous regular files would, but they are much less readable and are
    therefore bad for debugging.  Typically, we use compressed files only when
    we are nearly done with our application and want to optimize load-time
    performance.

* As your application grows, be sure to add the new files and plugins to `package.js`, e.g.:

        enyo.depends(
            "$lib/aPlugin/source",
            "$lib/bPlugin/source",
            "$lib/cPlugin/source",
            "MyView.js",
            "App.css",
            "App.js"
        );

## Ready for Growth

Now our HTML file looks something like this:

        <!doctype html>
        <html>
        <head>
            <title>Enyo Hello</title>
            <!-- load debug version of enyo -->
            <script src="enyo/enyo.js"></script>
            <!-- load debug version of application-->
            <script src="source/package.js"></script>
        </head>
        <body>
            <script>new App().write();</script>
        </body>
        </html>

And our application folder looks like this:

        <app>
            enyo/
            lib/
            source/
                MyView.js
                App.css
                App.js
                package.js
            index.html

At this point, our app's structure closely resembles the basic scaffold
described in [Structuring Your Project](../best-practices/structuring-your-project.html)
and embodied in the [bootplate template](bootplate.html).  The stage is now set
for the project to grow to an arbitrary level of complexity.  Source files may
be added and arranged in `source` (or subdirectories thereof), additional
libraries may be added, and the project is set up correctly for pre-deployment
optimization (minification).