% Bootplate

The enyojs project includes a set of application templates, known as "Bootplate"
(BOOTstrap + boilerPLATE) templates.  These may be used to facilitate both the
creation of new projects and their ultimate deployment.

## Quick Start with Bootplate

While each Bootplate template lives in its own GitHub repo (e.g.,
[bootplate](https://github.com/enyojs/bootplate) and
[bootplate-moonstone](https://github.com/enyojs/bootplate-moonstone)), we
provide two easy ways to use Bootplate without dealing directly with Git.

### generator-enyo

`generator-enyo` is the preferred method for starting an app with Bootplate.  It
is implemented using [Yeoman](http://yeoman.io/), an open-source suite of Web
development tools.

**Note:** To use `generator-enyo`, you will first need to have
[Node.js](http://nodejs.org) and the [Node Package Manager](https://npmjs.org)
installed on your Windows, Mac OS or Linux computer.

1. Use the Node Package Manager `(npm)` to install `generator-enyo` and associated tools:

	```
		sudo npm install -g generator-enyo yo bower cordova
	```

    Note that this will install Yeoman, Bower, and Cordova, if they are not already 
    installed.  (Also note that `sudo` may not be necessary on all platforms, such 
    as Windows.)

2. Run the generator, specifying the name of your new app:

	```
		yo enyo <myApp>
	```

    This will create the `<myApp>` directory and populate it with the necessary
    files for an Enyo application.  The Onyx UI library is included by default;
    to choose a different UI library, use the `-m` or `--mode` flag, e.g.:

	```
		yo enyo -m=moonstone <myApp>

		yo enyo --mode=moonstone <myApp>
	```

### The Other Way

1. Download a bootplate zip archive from
    [enyojs.com](http://enyojs.com/get-enyo/), unzip the archive, and open the
    `bootplate-moonstone` folder (or `bootplate` folder, for the Onyx version).

2. Load `debug.html` in a browser and see "Hello World".

## Development

At this point, you would refine your project through the normal cycle of
development and testing, starting with the `source/app.js` file provided in the
template.  As your app grows to include more and more JavaScript and CSS files,
and libraries with their own `package.js` files, make sure to include these in
your top-level `source/package.js` and the `deploy` script described below will
combine them all into optimized JavaScript and CSS files for deployment.

For the purposes of this article, let's assume that you've completed all of your
work on the "HelloWorld" app, and turn our attention to the deployment process.

## Deployment

### With generator-enyo

One advantage of installing `generator-enyo` is that it makes deploying your app
extremely easy.  Just enter the application directory and issue the command:

```
	yo enyo:deploy
```

The optimized app will be created in a directory called `deploy` within the
application directory.

Your project is now ready to deploy to various HTML5-ready targets.  For details
about deploying apps to specific platforms, see [Platform-Specific
Deployment](../deploying-apps/platform-specific-deployment.html).

### The Other Way

If you're not using `generator-enyo`, deploy your app by following these steps:

1. Make sure that you have the Node.js runtime (version 0.8 or later) installed
    on your system.

2. Make a deployment build as follows:

    * Open a command prompt (Windows) or terminal window (Mac/Linux).

    * On the command line, navigate to root of your bootplate folder.

    * Run the `tools\deploy.bat` script (Windows) or `./tools/deploy.sh`
        (Mac/Linux).

    When the build is complete, there will be two compressed JavaScript files
    and two compressed CSS files in a folder called `build`; `app.js` and
    `app.css` contain your application code, while `enyo.js` and `enyo.css`
    contain framework code.

    The `build` folder and a set of complementary files (an `index.html` file
    that loads your app, any images or other resources used by the app, etc.)
    are then copied into the final deployment folder, called `deploy`.

3. Open the `deploy` folder, load `index.html` in a browser, and see "Hello
    World" (but faster!).

## Additional Notes on Bootplate Projects

### Embedded Enyo

Bootplate projects are set up to use _embedded_ Enyo.  In other words, the Enyo
library and other dependencies are stored completely inside the project folder.
These resources are relatively small, and keeping all the dependencies together
allows the developer to control versions and to easily deploy sealed packages
(e.g., PhoneGap builds).

### Development vs. Deployment

When developing and debugging your project, it's common to need various source
files and helper tools that are not needed in the final package.  For this
reason, we have the concept of making an application _deployment_.   A
deployment refers to a final production package, ready for inclusion in an app
store or other method of distribution.

An important feature of bootplate projects is that you can generate deployments
from them with relative ease.

### Folder Structure

A bootplate project has the following structure:

```
	assets/
	build/
	enyo/
	lib/
	source/
	tools/
	debug.html
	index.html
```

* `assets` contains images or other data files for you projects. Files in this
    folder are intended to be necessary for deployment.

* `build` contains JavaScript and CSS source files that have passed through the
    optimization script.  If the `build` folder does not exist, it will be
    created when the `deploy` script is run.

* `enyo` contains the Enyo framework source files.  This folder is only
    necessary for debugging, and may be deleted for deployment.

* `lib` contains various plugin files.  Individual folders in `lib` may come
    from various sources and may have custom rules for deployment.  In general,
    `assets` or `images` folders are required, and other files are only for
    debugging.

* `source` contains the code source files or other debug-only materials.

* `tools` contains the `deploy` shell script.

* `debug.html` loads the application without using any built files; loading
    `debug.html` is generally the easiest way to debug.

* `index.html` loads the application using built files only.  If built files are
    not available, it will redirect to `debug.html`.

### Updating the Framework Code

`generator-enyo` uses the latest stable version of each Bootplate template.
(And each version of Bootplate, in turn, references a particular version of Enyo
core and each of its associated libraries.)  From time to time, the Bootplate
versions specified by the `generator-enyo` tool will be updated, as new stable
builds become available.

To check for updates to `generator-enyo`, use the command

```
	sudo npm update -g generator-enyo
```

If an updated version was found and installed, you may update the framework code
for a given application by entering the app's directory and issuing the command

```
	yo enyo:update
```

(Note that `generator-enyo` supports a number of additional options, which we
will be documenting shortly.)

**Additional Reading**

* [Moonstone App Tutorial](moonstone-app-tutorial.html)
* [Platform-Specific Deployment](../deploying-apps/platform-specific-deployment.html)
