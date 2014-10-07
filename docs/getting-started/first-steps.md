% First Steps with Enyo

## Preparing Your Development Environment

As an Enyo developer, you have a great deal of freedom in choosing the platform
and tools you use to code your applications.  You may work in a Windows, Mac, or
Linux environment.  Only a few simple tools are needed to get up and running.

### Text Editor

To write Enyo code, the only requirement is a text editor.  Just
about any text editor will suffice, including basic freeware options such as
[Notepad++](http://notepad-plus-plus.org/) (Windows) or
[TextWrangler](http://www.barebones.com/products/textwrangler/) (Mac).  For what
it's worth, members of the Enyo team tend to use either [Sublime
Text](http://www.sublimetext.com/), which is available for Mac and Windows, or
the Mac-only [TextMate](http://macromates.com/).

### Git Client

Currently, the primary mechanism for distribution of Enyo core, libraries, and
"bootplate" project templates is via GitHub, so you'll need to have a modern Git
client installed on your machine.  In our documentation, we present git commands
on the command line, but you are free to use your favorite GUI Git client as
well.

You can download the latest Git client for your operating system at
[git-scm.com](http://git-scm.com/downloads).

(Note that the Enyo "bootplate" templates are also distributed in the **LG webOS
TV SDK** and may be generated using the `ares-generate` command line tool
included in the SDK, without the use of Git.  If you are using the **LG webOS TV
SDK** and don't plan to version-control your application in Git, you won't need
to install a Git client.

### Node.js

The Enyo framework includes tools based on `Node.js` for minifying and deploying
your applications.  `Node.js` is a server-side JavaScript runtime (similar to
the server-side interpreters for Perl, Python, Ruby, and other languages) used
for running JavaScript scripts on a server.  It's even possible to use `Node.js`
itself as a barebones Web server (as we'll see below).

You can download the latest version of `Node.js` for your operating system at
[nodejs.org](http://nodejs.org/).

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

If you are not currently running a local Web server, you may find it convenient
to install an Apache/MySQL/PHP software bundle, such as [BitNami
WAMPStack](http://bitnami.org/stack/wampstack) (Windows) or
[MAMP](http://www.mamp.info/en/index.html) (Mac).

As mentioned earlier, another alternative is to create your own simple HTTP
server using `Node.js`.  Here's how to do it:

* Install `Node.js`.

* Use npm to install the `serve` package:

            npm install -g serve

* Create a directory to house your application files, then enter that directory
    and start the server by running `serve`, e.g.:

    + `mkdir my_doc_root`
    + `cd my_doc_root`
    + `serve`

* Your application will be accessible on port 3000, at a URL such as `http://localhost:3000/debug.html`.

## Obtaining the Enyo Source Code

### Bootplate

If you are new to Enyo development, you will want to obtain the Enyo source as
part of a ready-made project template.  The enyojs project includes a number of
these, which we refer to as "bootplate" (BOOTstrap + boilerPLATE) templates.
Each bootplate template comes with the Enyo core code, one or more optional
libraries relevant to the project type, a "Hello World"-type application, and a
recommended folder structure for organizing your application files.  (You can
read more about bootplate templates and what they provide in [Bootplate: 0-60
with Enyo in 5 Minutes](bootplate.html).)

To start an app using the Moonstone UI library, clone the `bootplate-moonstone`
repository to your local machine:

        git clone --recursive --branch 2.4.0 https://github.com/enyojs/bootplate-moonstone.git <myapp>

(**Expert tip:** If you'd like to version-control the newly-cloned project
under your own GitHub account, follow the instructions in the [Bootplate
documentation](bootplate.html#the-github-way).)

Once the cloning is complete, you should be able to open the `debug.html` file
from the root of the `<myapp>` folder in your browser.  If you see the "Hello
World" screen, congratulations!  You're ready to start coding!

### Individual Repos

Of course, you're also free to clone `enyo` or any of the library repos
individually, e.g.:

        git clone https://github.com/enyojs/enyo.git <myEnyoDirectory>

If you plan to submit changes back to a repository, be sure to create your own
fork of the repository and clone the fork to your local machine.

## Next Steps

If you haven't already done so, read through the [Moonstone App
Tutorial](moonstone-app-tutorial.html).  Now that you have all the necessary
tools, try following the steps in the tutorial to run the code on your own
computer.

If you get stuck, or you'd rather explore on your own, see the
[Bootplate](bootplate.html) documentation for some useful pointers.
