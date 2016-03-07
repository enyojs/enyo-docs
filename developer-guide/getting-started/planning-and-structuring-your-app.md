% Planning and Structuring Your App

While an Enyo application may be as simple as single JavaScript file, once we start
making more sophisticated apps, there are numerous resources to manage, versions
and dependencies to track, and debug switches to control.  To facilitate a
smooth workflow, the Enyo team has adopted a number of conventions regarding
application structure.  These are embodied in the templates included with the
`enyo-dev` tool. They are also described in some detail below.

## The Basic Scaffold

Enyo is designed so that plugin libraries, applications, and Enyo itself are all
portable resources.  The use of common folder conventions significantly
simplifies the management of these resources.

The suggested folder structure for a plugin library looks like this:

        <plugin>
            assets/
            src/
            package.json
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

* `package.json` is a project description file.

* The `<plugin>` folder will often contain other items, such as readmes,
    licenses, or other miscellaneous files.

A sample library template (without the src and assets directories) can be generated with the following command:

```bash
    enyo init --template default-library
```

The suggested setup for applications is similar, but includes some additions:

        <application>
            assets/
            dist/
            lib/
            src/
            (readmes, licenses, nfos)
            index.js
            package.json

* The `lib` folder contains any plugins or other resources used by the project. It also
    includes the core Enyo framework.

* The `dist` folder is the home for your compiled application. The output is generated whenever
    the `enyo pack` command is run. This directory contains the complete app, including
    an `index.html` as well as any JavaScript and CSS files.

To initialize a new app project (without the directories), use the following command:

```bash
    enyo init
```

## The lib Folder and Plugins

Enyo's infrastructure is intended to support a wide variety of plugins.  While
it is not a technical requirement, the convention is to put plugins in a folder
called `lib`.

        <application>
            lib/
                enyo/
                aPluginFolder/
                    assets/
                    src/
                    package.json
                    (readmes, licenses, nfos)

Again, notice that the standard scaffold has been used for this plugin.

## Standard Snapshot

If we combine the two preceding examples, we get the complete suggested folder
structure:

        <application>
            assets/
            dist/
                index.html
                enyo.js
                enyo.css
                app.js
                app.css
            lib/
                enyo/
                aPluginFolder/
                    assets/
                    source/
                    package.js
                    (readmes, licenses, nfos)
            src/
            index.js
            package.json
            (readmes, licenses, nfos)

Note that all that is needed for deployment is located in the `dist` directory.
