# Converting Your Existing App to 2.6

Enyo's 2.6 release introduces some significant changes to the way applications
are structured and built. While the actual code in an Enyo app will be mostly
the same, the new build system enables apps to be built with only the required
sources, styles, and assets, resulting in smaller builds and faster load times.

To convert an existing Enyo app to the new scheme, you'll need to make modifications in the following areas:

1. App Creation and Structure
2. Package Definition `(package.json)`
3. Updating Application Code
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
submodules in your projects_.  Instead, use the new tools provided by the
[enyo-dev](https://github.com/enyojs/enyo-dev) module.  Detailed instructions
for installing `enyo-dev` may be found in [First Steps with
Enyo](../getting-started/first-steps.html).

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

The [enyo init](https://github.com/enyojs/enyo-dev#commands-init) command, which
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

Now you are ready to use `enyo init` to manage your Enyo dependencies.  Simply
run the following command:

```bash
    # depending on connection speed, this may take a few minutes
    enyo init --save
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
    enyo init --libraries=enyo#ENYO-1675-coledavis
```

Or, if there are dependencies on multiple updated branches:

```bash
    enyo init --libraries=enyo#ENYO-1675-coledavis,moonstone#ENYO-1759-blakestephens
```

If you want to officially bump _and save_ an updated version of a dependency,
make sure to include the `--save` flag.

Another useful tool is `enyo link`, which temporarily forces the use of a local
copy of one or more of your dependencies.  For instance, let's say you have a
local clone of the `enyo` repository, and you check out a specific branch that
you want to test in a build of your application.  You could do the following:

```bash
    # navigate to the root directory of your cloned enyo repo
    cd enyo
    enyo link
    # now navigate to your application directory
    cd ../path/to/application
    # The following command will temporarily link to your local version of enyo
    # instead of the default version you have installed.
    enyo init --links=enyo
```

This lets you change branches in your local `enyo` repository, rebuild your app,
and see the changes immediately.

## Package Definition (package.json)

Your app must have at least one `package.json` at the root of the project.  It
must contain a `main` key indicating the entry point for the application
(`index.js` in the example above).  It may also include assets and stylesheets,
in the `assets` and `styles` arrays, respectively.  These are the configuration
options you are most to likely use, but there are others that can be found in
the [enyo-dev](https://github.com/enyojs/enyo-dev) module's `enyo pack --help`
command-line output (or by looking at the [source
code](https://github.com/enyojs/enyo-dev#project)).  Each command-line
option can be expressed as an [equivalent
option](https://github.com/enyojs/enyo-dev#the-packagejson-options) in
`package.json`.

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

## Updating Application Code

### Updating Source Files to Use require()

When updating existing application code for Enyo 2.6, there are two fundamental
changes to remember--there is no longer anything from Enyo or its libraries in
the global scope, and all source files should now be in
[CommonJS](http://know.cujojs.com/tutorials/modules/authoring-cjs-modules)
format.

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

### Determining the Kind of an Object

Because of internal changes made in 2.6, application code should not rely on
either the `kind` or `kindName` property to determine whether an object instance
is of a specific kind.  (In fact, in many cases, the `kind` property will not
exist at all.)

If you need to perform this sort of test, do a direct comparison between
constructors, e.g.:

```javascript
    if (inEvent.originator instanceof ExpectedKindCtor) {
        // do something
    }
```

or

```javascript
    if (inEvent.originator.ctor === ExpectedKindCtor) {
        // do something
    }
```

### Resolution Independence Changes

If you are converting an Enyo 2.5.x app to use Enyo 2.6.x, please note that the
`moon-res-*` CSS classes are no longer available in Enyo 2.6.x.

## Building the App

As mentioned above, the new Enyo build tools require that both `Node.js` and the
`enyo-dev` module be installed.  Once they are, you'll be able to build your
application, either manually (using `enyo pack`), or with a development server
(`enyo serve`).

For a detailed look at the new build process, see the section titled "Building
an App" in the document [Creating and Building an
App](../getting-started/creating-and-building-an-app.html).
