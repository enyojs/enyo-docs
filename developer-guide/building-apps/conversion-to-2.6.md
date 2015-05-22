# Converting Your Existing App to 2.6

Enyo's 2.6 release introduces some significant changes to the way applications
are structured and built. While the actual code in an Enyo app will be mostly
the same, the new build system enables apps to be built with only the required
sources, styles, and assets, resulting in smaller builds and faster load times.

To convert an existing Enyo app to the new scheme, you'll need to make modifications in the following areas:

1. App Creation and Structure
2. Package Definition `(package.json)`
3. Updating Source Files to Use `require()`
4. Building the App

## App Creation and Structure

If you've worked with Enyo apps in the past, you should be familiar with the
bootplate app templates--i.e., the `bootplate` and `bootplate-moonstone` repos
from the enyojs project on GitHub.  These were created to provide a quick and
easy way to start work on your own Enyo app--simply clone one of the repos and
pull down the framework code by initializing the submodules.

The bootplate templates were easy to use, but certainly had their limitations.
The new app development scheme gives us considerably more freedom, while
maintaining a similar level of convenience.

One significant change you'll notice is in how apps are created.  While Enyo's
build system is still based on [Node.js](http://nodejs.org) (which still needs
to be installed on your development machine), the new scheme no longer relies on
Git submodules for initial app setup; in fact, _we no longer recommend using
submodules in your projects_.  Instead, for intial setup, we now use
[Bower](http://bower.io/), a versatile package manager that has become a
standard tool for Web development.  (If you don't already have Bower installed,
you can get it quickly using the Node Package Manager (npm): `npm install -g bower`.)

As a developer, you may either use Bower directly, or use the new tools provided
by the [enyo-dev](https://github.com/enyojs/enyo-dev) module.  (More on this
below.)

Another important change is in the application structure.  Here's the Enyo
framework's traditional app structure, as reflected in the bootplate templates:

```
    my-app/
        assets/
        enyo/
        lib/
        source/
        tools/
        debug.html
        index.html
        package.js
        package.json
```

In Enyo 2.6, the standard Enyo project structure looks like this:

```
    my-app/
        assets/        // Images and other resources for your app
        lib/           // Enyo and its libraries
        src/           // App source
        index.js       // App entry point
        package.json   // App and build configuration
```

Let's look at the differences:

* The build tools (under `tools/`) have been removed (they have been replaced by new tools that live in a different module, [enyo-dev](https://github.com/enyojs/enyo-dev)).

* The `debug.html` and `index.html` files have been removed, as they are no longer needed. An appropriate index will be generated (or a template may be specified).

* The `package.js` file has been removed, as it is no longer needed.

* The `enyo` core library has been moved under `lib/`, where it becomes a peer to `moonstone`, `layout`, `spotlight`, etc.

* The `source/` directory retains its old function (i.e., housing app source), but has been renamed `src/`.

* The app entry point is now `index.js`.  (In most apps, the file formerly found at `source/app.js` will likely become the new `index.js`.)

* While `package.json` exists in both schemes (it is not strictly required in the old scheme, but happens to exist in the bootplate templates), it takes on new importance in Enyo 2.6, becoming the app's main configuration file.

The `assets` directory is essentially unchanged.

### App Conversion Tools

The [enyo-gen init](https://github.com/enyojs/enyo-dev#init) command, which
helps manage a project's dependencies, is a useful tool when converting existing
applications to the new scheme.  Before you can use it, though, you'll need to
do some preparatory work.

If your project is based on one of the bootplate repositories, you will first
need to remove the Git submodules and their references from your Git history.
To do this, follow the pattern below, in which we remove the `enyo` submodule
from a bootplate-based project (note that this requires Git version `1.8.5` or
later):

```bash
	# from your project's root directory
	git submodule deinit enyo
	# do not use a "/" at the end!
	git rm enyo
	rm -rf .git/modules/enyo
	# if the enyo/ directory still exists, do this
	rm -rf enyo
```

Once you have done this for each of your submodules, be sure to commit the
changes so that the submodules do not reappear in your project by accident.

Next, if you haven't yet installed the `enyo-dev` module, you will need to do
so.  Use the following command to retrieve and install the module:

```bash
    git clone https://github.com/enyojs/enyo-dev.git && \
        cd enyo-dev && \
        npm link
```

(**Note:** Depending on your development environment, you may need to run
`npm link` as root--i.e., `sudo npm link`.  In addition, in the future, we are
likely to make `enyo-dev` available as an npm package, installable via
`npm install -g enyo-dev`; however, this has not yet been implemented.)

Now you are ready to use `enyo-gen` to manage your Enyo dependencies.  For
convenience, `enyo-gen` is aliased to `egen`, so you can simply run the
following command:

```bash
	# depending on connection speed, this may take a few minutes
	egen init --save
```

That's it!  Once the command finishes executing, your dependencies will be
installed.  You can use `git status` to see what changed.  All _Moonstone
application-related dependencies_ will be installed in your project's `lib`
directory.  By default, there will also be a new entry added to your
`.gitignore` file to ensure that you don't accidentally commit these
dependencies to your project source.

At this time, the default is to use the `HEAD` of the `2.6.0-dev` branch for all
dependencies.  This should be sufficient until the official release of `2.6.0`.

Note that it is actually quite easy to test specific development branches other
than `2.6.0-dev`.  For example, if you want to test a bug fix for `enyo` that
was made in a branch called `ENYO-1675-coledavis`, do the following:

```bash
	egen init --libs=enyo#ENYO-1675-coledavis
```

Or, if there are dependencies on multiple updated branches:

```bash
	egen init --libs=enyo#ENYO-1675-coledavis,moonstone#ENYO-1759-blakestephens
```

If you want to officially bump _and save_ an updated version of a dependency,
make sure to include the `--save` flag.  The requested dependency version/target
will be stored in your `bower.json` file.

Another useful thing you can do with `egen init` is to temporarily force the use
of a local copy of one or more of your dependencies.  For instance, let's say
you have a local clone of the `enyo` repository, and you check out a specific
branch that you want to test in a build of your application.  You could do the
following:

```bash
	# This command only needs to be executed one time (ever) from the local
	# repository, so that bower knows about the repo for purposes of local
	# linking (i.e., linking from inside your local copy of enyo).
	bower link
	# now navigate to your application directory
	cd ../path/to/application
	# The following command will temporarily link to your local version of enyo
	# instead of the default version you have installed.
	egen init --libs=enyo --link-libs=enyo
```

This lets you change branches in your local `enyo` repository, rebuild your app,
and see the changes immediately.

## Package Definition `(package.json)`

Your app must have at least one `package.json` at the root of the project.  It
must contain a `main` key indicating the entry point for the application
(`index.js` in the example above).  It may also include assets and stylesheets,
in the `assets` and `styles` arrays, respectively.  These are the configuration
options you are most to likely use, but there are others that can be found in
the [enyo-dev](https://github.com/enyojs/enyo-dev) module's `enyo-pack --help`
command-line output (or by looking at the [source
code](https://github.com/enyojs/enyo-dev#enyo-pack)).  Each command-line option
can be expressed as an [equivalent option](https://github.com/enyojs/enyo-dev#the-packagejson-options)
in `package.json`.

```json
    {
        "main": "index.js",
        "assets": [
            "assets/*.png"
        ],
        "styles": [
            "src/*.less"
        ]
    }
```

These properties are important for what they communicate to the build tools.
The `assets` array tells the build tools which additional files should be
included in the final package.

The `styles` array specifies the stylesheets
that should be included, as well the order in which they are included.  (So if
there is a specific load order needed, the styles must be listed in that order.)
Both the `assets` and `styles` properties accept literal string values or
_glob-pattern_ matches.  Explicit ordering is far less common for assets (such
as images) than it is for stylesheets.

Here is an example of mixed ordering and _globbing_:

```json
	{
    	"main": "index.js",
    	"assets": [
    		"assets/*.png",
    		"assets/*.ico"
		],
		"styles": [
			"css/root.less",
			"css/rules.less",
			"css/*.less"
		]
	}
```

In this example, the `css/root.less` and `css/rules.less` files would be loaded
first, followed by the remaining less files in any order.  Note that _globbing_
is very powerful; options may be found [here](https://github.com/isaacs/node-glob#glob-primer).

Also note that use of the `@import` directive in css/less should mostly be
avoided now that the load order is controlled by `package.json`.  Using
`@import` for remote includes is still acceptable.

## Updating Source Files to Use `require()`

When updating source code, there are two important changes to remember--that
there is no longer anything from Enyo or its libraries in the global scope, and
that all source files should be in
[CommonJS](http://know.cujojs.com/tutorials/modules/authoring-cjs-modules) format.

The fact that Enyo no longer exports anything in the global scope means that any
kinds or methods used via `enyo.`, `moon.`, or `onyx.` (e.g., `enyo.Button`,
`enyo.kind()`, `moon.Scroller`) will no longer work.  Instead, you must specify
the relevant submodule in your source, within a call to `require()`.

When requiring a submodule, specify the library that defines it, followed by a
forward slash, and then the submodule's name.  Some examples:

* `enyo/Button`
* `enyo/kind`
* `layout/FittableRows`
* `moonstone/DataGridList`
* `onyx/GroupboxHeader`

Note that two libraries, `spotlight` and `enyo-ilib`, do not have any submodules
and may be required using just the library name (e.g.,
`var Spotlight = require('spotlight');`).

Consult the online documentation to identify the module corresponding to each
kind and method.

Here's an example showing the use of `require()` calls in framework code:

```javascript
    var
        kind = require('enyo/kind'),
        utils = require('enyo/utils'),
        Button = require('enyo/Button');

    var
        FittableRows = require('layout/FittableRows');

    var
        Toolbar = require('onyx/Toolbar');

    // By returning the result of kind() to module.exports, other files that require this file will
    // gain access to the kind (like the kinds required above)
    module.exports = kind({
        name: 'ex.App',
        // Note that the 'kind' property should always be a reference to the constructor
        // (in this case via the local variable FittableRows), rather than a string
        // (e.g., 'enyo.FittableRows') or global reference (e.g., enyo.FittableRows).
        kind: FittableRows,
        components: [
            {kind: Toolbar, components: [
                {content: 'Welcome to Enyo 2.6!'}
            ]},
            {fit: true, components: [
                {content: 'Default kinds are supported so we can omit the kind key of the config'},
                {kind: Button, content: 'Continue', ontap: 'continueTapped'}
            ]}
        ],
        continueTapped: function (sender, event) {
            utils.asyncMethod(this, function () {
                this.log('Log this message in just a moment');
            });
        }
    });
```

Here's a simple example of a custom kind defined in application code:

```javascript
    // my-project/src/controls.js
    var OneKind = kind({ /* kind config */ });

    module.exports = {
        OneKind: OneKind
    };
```

To import `OneKind` into another module, we `require()` it, as we did with the
Enyo kinds above.  The only difference is that, instead of the library name, we
specify the relative path to the file.

```javascript
    // my-project/src/view.js
    var
        kind = require('enyo/kind');

    var
        // pull in a reference to the exported kind
        controls = require('./controls');

    module.exports = kind({
        name: 'ex.View',
        // extend OneKind
        kind: controls.OneKind,
        components: [
            // add custom stuff
        ]
    });
```

## Building the App

As mentioned above, the new Enyo build tools require that both `Node.js` and the
`enyo-dev` module be installed.  Once they are, you'll be able to build your
application, either manually (using `enyo-pack`), or with a development server
(`enyo-serve`).

### enyo-pack (epack)

[enyo-pack](https://github.com/enyojs/enyo-dev#enyo-pack) (aliased to `epack`)
creates an optimized build of your application, using only the required source.
The output, in which all JavaScript is combined and all CSS/LESS is combined,
is written to `./dist` by default; the output directory may be configured using
the `-d` switch.  The JavaScript and CSS may either be inlined in the HTML (the
default) or stored in external files (via the `-j` and `-c` options).  In
addition, any assets declared in the app's `package.json` file(s) will be copied
to the output directory.

For example, the following command will create output in `build/app.css` and
`build/app.js`.

```
    enyo-pack -d ./build -c app.css -j app.js
```

To simplify builds, any option available on the command line may also be set in
the project's `package.json` file.  Command line options will always override
`package.json` options.

```json
{
    "main": "index.js",
    "assets": [
        "assets/icon.png"
    ],
    "styles": [
        "src/app.less"
    ],
    "outdir": "./build",
    "outCssFile": "app.css",
    "outJsFile": "app.js"
}
```

If a project with this `package.json` is built using `enyo-pack` without any
options, it will produce the same output as the preceding command-line build.

To see a working example of this use case, see the [enyo-strawman QA/Samples
application](https://github.com/enyojs/enyo-strawman).  Once you have a local
copy of the repository, run `epack` to see its output in `dist`, and check out
the `package.json` file.

### enyo-serve (eserve)

`enyo-serve` (aliased to `eserve`) is a tool that builds your application and
makes it available via a Web server (running on port 8000 by default).  The tool
monitors the files used in the build (JavaScript, CSS, and `package.json`) and
rebuilds the application if one of the files is changed or deleted.
`enyo-serve` supports the same options as `enyo-pack`, along with a few others
related to the Web server.  Unlike `enyo-pack`, these options *cannot* be
specified in the project's `package.json` file.

Please note that `enyo-serve` only creates development builds; for production
builds, you'll need to use `enyo-pack`/`epack` (specifically,
`epack --no-dev-mode`).

Also note that a bug in `browserify` (a Node module used by `eserve`) can cause
`EMFILE` errors to occur when `eserve` is run.  These are OS errors indicating
that you have too many files open.  You may work around the error by using the
`ulimit` command to raise the open file limit (e.g., `ulimit -n 4096`).
