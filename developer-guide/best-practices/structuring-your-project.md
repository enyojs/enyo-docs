% Structuring Your Project

While an Enyo application may be as simple as single HTML5 file, once we start
making more sophisticated apps, there are numerous resources to manage, versions
and dependencies to track, and debug switches to control.  To facilitate a
smooth workflow, the Enyo team created the `enyo dev` tool.  In addition to
installing dependencies and packaging your app, this tool can create a basic
app structure.  The default structure is described below.

## The Basic Scaffold

Enyo is designed so that plugin libraries, applications, and Enyo itself are all
portable resources.  The use of common folder conventions significantly
simplifies the management of these resources.

The suggested folder structure for a plugin library looks like this:

        <plugin>
            assets/
            src/
            package.json
            index.js
            (readmes, licenses, nfos)

* `src` contains JavaScript modules, stylesheets, or other raw (code) materials
    for the plugin.

* `assets` typically contains images or other resources that the library will
    need in both production and development/debug environments.  There may be as
    many of these folders as you like, and the folder name is not special--a
    project might have folders called `images` and `json`, for example.
    However, we suggest that you keep all such items in one folder called
    `assets`, so end users will know right away that this folder is necessary
    for final deployment.

* `package.json` is a manifest describing the library.

* The `<plugin>` folder will often contain other items, such as readmes,
    licenses, or other miscellaneous files.

The suggested setup for applications is similar, but includes some additions:

        <application>
            assets/
            lib/
            dist/
            src/
            (readmes, licenses, nfos)
            package.json
            index.js

* The `lib` folder contains a copy of the Enyo framework source and any plugin
    libraries used by the project.

* The `dist` folder is the home for _minified_ resources, which are JavaScript
    and CSS files that have been optimized to remove comments, whitespace, and
    other features not critical to functionality.  In JavaScript files, syntax
    is sometimes changed (e.g., variable names may be shortened) to reduce file
    size.

    The minified files are produced when `enyo pack` is run.

    After `enyo pack` is run successfully, the `dist` directory contains the
    built application, ready for testing or deployment. The contents include
    an `index.html`, `enyo.js`, `enyo.css` and the source and assets for other
    libraries included in your app. There will also be corresponding `.js` and
    `.css` files named for your app.

## The lib Folder and Plugins

Enyo's infrastructure is intended to support a wide variety of plugins.  While
it is not a technical requirement, the convention is to put plugins in a folder
called `lib`:

        <application>
            lib/
                aPluginFolder/
                    assets/
                    src/
                    package.json
                    index.js
                    (readmes, licenses, nfos)

Again, notice that the standard scaffold has been used for this plugin.

## Standard Snapshot

If we combine the two preceding examples, we get the complete suggested folder
structure:

        <application>
            assets/
            dist/
                enyo.js
                enyo.css
                app.js
                app.css
            lib/
                enyo/
                aPluginFolder/
                    assets/
                    src/
                    package.json
                    index.js
                    (readmes, licenses, nfos)
            src/
            index.js
            package.json
            (readmes, licenses, nfos)

As touched upon earlier, to construct a production version of the app, use the `enyo pack`
tool with the `--production` option.  By default, this build will be created in a
folder called `dist`.

Here's the deployment tree for the suggested folder structure:

        <application>/
            dist/
                assets/
                enyo.js
                enyo.css
                app.js
                app.css
                aPluginFolder/
                    assets/
                    (licenses)
                index.html

Note that none of the files outside the `dist` directory are necessary for deployment.
