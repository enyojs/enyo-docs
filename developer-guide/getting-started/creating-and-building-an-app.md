# Creating and Building an App

## Creating an App (enyo init)

Once you've completed the setup tasks outlined in [First Steps with
Enyo](first-steps.html), you're ready to create an application.  To initialize a
project, use the `enyo init` command from the
[enyo-dev](https://github.com/enyojs/enyo-dev) toolset.  `enyo init` creates the
standard Enyo directory structure and populates it with framework code and
configuration files.

As an example, let's initialize a project called "my-project":

```
    enyo init my-project
```

`enyo init`, with the default template, provides us with the following directory structure:

```
    my-project/
        .enyoconfig    // Enyo configuration file
        .gitignore     // Git configuration file
        index.js       // The main source file
        lib/           // Enyo and its libraries
            enyo/
        package.json   // App and build configuration
```

Within the project directory (`my-project`), there are basic versions of several
configuration files--`.enyoconfig`, `.gitignore`, and `package.json`.  We also
have the Enyo framework library, installed under `my-project/lib/`.

Before we continue, let's look briefly at `package.json`.  Each app must contain
a `package.json` file in its root directory.  Here are the contents of the
default `package.json` installed by `enyo init`:

```json
{
    "name": "my-project",
    "main": "index.js",
    "assets": [],
    "styles": [],
    "devAssets": [],
    "moduleDir": "src"
}
```

`package.json` must contain a `main` key indicating the entry point for the
application (`"index.js"` by default).  It may also include paths to assets and
stylesheets, in the `assets` and `styles` arrays, respectively.  The `moduleDir`
key specifies the location of additional app source code; you will generally want
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
may be as simple as a single `index.js` file.  To see for yourself, modify
`my-project/index.js` to have the following contents:

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
testing.  The `enyo-dev` tools provide the `enyo pack` command for this.

### enyo pack

`enyo pack` creates an optimized build of your application, using only the
required source.  The output, which includes the combined JavaScript as well as
combined/compiled CSS/LESS, is written to `./dist` by default; the output directory
may be configured using the `-d` switch.  The JavaScript and CSS may either be
inlined in the HTML (the default for production) or, in development mode, stored in external
files (via the `--no-inline-css` and `--no-inline-js` options).  In addition,
any assets declared in the app's `package.json` file will be copied to the
output directory.

For example, the following command will create output in `build/app.css` and
`build/app.js`.

```
    enyo pack --production -d ./build --no-inline-css --css-outfile app.css --no-inline-js --js-outfile app.js
```

Note that any `enyo pack` option available on the command line may also be set in
the project's `package.json` file.  Options specified on the command line will
always override those defined in `package.json`.

The following `package.json` will produce the same output as the preceding
command-line build, if `enyo pack` is run without any options:

```json
{
    "name": "my-project",
    "main": "index.js",
    "assets": [
        "assets/icon.png"
    ],
    "styles": [
        "src/app.less"
    ],
    "production": true,
    "outDir": "./build",
    "inlineCss": false,
    "outCssFile": "app.css",
    "inlineJs": false,
    "outJsFile": "app.js"
}
```

You can try `enyo pack` for yourself using `my-project` and the `index.js` file
from our example.  Enter the `my-project` directory and run `enyo pack`.  Then
check out the built application under `my-project/build`.
