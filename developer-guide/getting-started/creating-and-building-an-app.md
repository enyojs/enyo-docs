# Creating and Building an App

## Creating an App (enyo init)

Once you've completed the setup tasks outlined in [First Steps with
Enyo](first-steps.html), you're ready to create an application.  To initialize a
project, use the `enyo init` command from the `enyo-dev` tools.  `enyo init`
creates the standard Enyo directory structure and populates it with framework
code and configuration files.

As an example, let's initialize a project called "my-project":

```
    enyo init my-project
```

`enyo init` provides us with the following directory structure:

```
    my-project/
        .enyoconfig    // Enyo configuration file
        .gitignore     // Git configuration file
        lib/           // Enyo and its libraries
            enyo/
            moonstone/
            ...
        package.json   // App and build configuration
```

Within the project directory (`my-project`), there are basic versions of several
configuration files--`.enyoconfig`, `.gitignore`, and `package.json`.  We also
have the Enyo framework libraries, installed under `my-project/lib/`.

Before we continue, let's look briefly at `package.json`.  Each app must contain
a `package.json` file in its root directory.  Here are the contents of the
default `package.json` installed by `enyo init`:

```json
    {
        "name": "my-project",
        "assets": [],
        "devAssets": [],
        "styles": [],
        "main": "index.js",
        "moduleDir": "src"
    }
```

`package.json` must contain a `main` key indicating the entry point for the
application (`"index.js"` by default).  It may also include paths to assets and
stylesheets, in the `assets` and `styles` arrays, respectively.  The `moduleDir`
key specifies the location of the Enyo framework code; you will generally want
to keep the default value, `"src"`.

## Filling Out the App Structure

You are now ready to complete the standard Enyo application structure by
plugging in your own app-specific logic, assets, and so on:

```
    my-project/
        .enyoconfig
        .gitignore
        assets/        // Images and other resources for your app
        lib/
        src/           // App source
        index.js       // App entry point
        package.json
```

Most Enyo apps will have their logic stored in files under `src/`, but an app
may be as simple as a single `index.js` file.  To see for yourself, create a
file at `my-project/index.js` with the following contents:

```
    var Control = require('enyo/Control');
    var ready = require('enyo/ready');

    var HelloWorld = Control.kind({
        content: 'Hello, World!'
    });

    ready(function () {
        new HelloWorld().renderInto(document.body);
    });
```

In the next section, we'll learn how to turn this into a working "Hello, World!"
app.

## Building an App

As you develop your application, you'll want to (periodically) build the app for
testing.  The `enyo-dev` tools provide two options for doing this--manually,
using `enyo pack`, or with a development server, using `enyo serve`.

### enyo pack (epack)

`enyo pack` (aliased to `epack`) creates an optimized build of your application,
using only the required source.  The output, in which all JavaScript is combined
and all CSS/LESS is combined, is written to `./dist` by default; the output
directory may be configured using the `-d` switch.  The JavaScript and CSS may
either be inlined in the HTML (the default) or stored in external files (via the
`-j` and `-c` options).  In addition, any assets declared in the app's
`package.json` file will be copied to the output directory.

For example, the following command will create output in `build/app.css` and
`build/app.js`.

```
    epack -d ./build -c app.css -j app.js
```

Note that any `epack` option available on the command line may also be set in
the project's `package.json` file.  Options specified on the command line will
always override those defined in `package.json`.

The following `package.json` will produce the same output as the preceding
command-line build, if `epack` is run without any options:

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

You can try `epack` for yourself using `my-project` and the `index.js` file from
our example.  Enter the `my-project` directory and run `epack`.  Then check out
the built application under `my-project/dist`.

Alternatively, try building the [enyo-strawman sample
application](https://github.com/enyojs/enyo-strawman).  Clone the repository and
take a look at the `package.json` file in the root directory.  Then run `epack`
and find the built app under `dist/`.

### enyo serve (eserve)

`enyo serve` (aliased to `eserve`) is a tool that builds your application and
makes it available via a Web server (running on port 8000 by default). `eserve`
monitors the files used in the build (JavaScript, CSS, and `package.json`) and
rebuilds the application if one of the files is changed or deleted.
`eserve` supports the same options as `epack`, along with a few others
related to the Web server.  Unlike `epack`, these options *cannot* be
specified in the project's `package.json` file.

To try `eserve` with our "Hello, World!" example, enter the `my-project`
directory and run `eserve`.  Then point your Web browser at port 8000 on your
development machine.

Please note that `eserve` only creates development builds; for production
builds, you'll need to use `epack` (specifically, `epack --no-dev-mode`).
