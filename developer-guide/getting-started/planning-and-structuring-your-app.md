% Planning and Structuring Your App

While an Enyo application may be as simple as single HTML5 file, once we start
making more sophisticated apps, there are numerous resources to manage, versions
and dependencies to track, and debug switches to control.  To facilitate a
smooth workflow, the Enyo team has adopted a number of conventions regarding
application structure.  These are embodied in the [Bootplate](bootplate.html)
application template (available in both
[Moonstone](https://github.com/enyojs/bootplate-moonstone) and
[Onyx](https://github.com/enyojs/bootplate) variants), which you are encouraged
to base your own apps upon.  They are also described in some detail below.

## The Basic Scaffold

Enyo is designed so that plugin libraries, applications, and Enyo itself are all
portable resources.  The use of common folder conventions significantly
simplifies the management of these resources.

The suggested folder structure for a plugin library looks like this:

        <plugin>
            assets/
            source/
            package.js
            (readmes, licenses, nfos)

* `source` contains JavaScript modules, stylesheets, or other raw (code) materials
    for the plugin.

* `assets` typically contains images or other resources that the library will
    need in both production and development/debug environments.  There may be as
    many of these folders as you like, and the folder name is not special--a
    project might have folders called `images` and `json`, for example.
    However, we suggest that you keep all such items in one folder called
    `assets`, so end users will know right away that this folder is necessary
    for final deployment.

* `package.js` is a manifest listing the files in the library.

* The `<plugin>` folder will often contain other items, such as readmes,
    licenses, or other miscellaneous files.

The suggested setup for applications is similar, but includes some additions:

        <application>
            assets/
            enyo/
            lib/
            build/
            source/
            tools/
            (readmes, licenses, nfos)
            debug.html
            deploy.json
            index.html
            package.js

* The `enyo` folder contains a copy of the Enyo framework source.  As discussed
    below, it's possible to reference `enyo` from a common location instead of
    embedding it in the application proper, but for ease of versioning and
    sealing, we recommend that you keep a copy of Enyo with your application. 

* The `lib` folder contains any plugins or other resources used by the project.

* The `build` folder is the home for _minified_ resources, which are JavaScript
    and CSS files that have been optimized to remove comments, whitespace, and
    other features not critical to functionality.  In JavaScript files, syntax
    is sometimes changed (e.g., variable names may be shortened) to reduce file
    size.

    The minified files are produced when the `deploy` script is run.  This
    script reads configuration info from `deploy.json` and triggers a call to a
    separate `minify` script, which performs the actual optimization.  (Note
    that it generally isn't necessary to call `minify` directly.)

    After `deploy` is run successfully, the output in `build` consists of two
    JavaScript files (`app.js`, with your app code, and `enyo.js`, with the
    framework code) and two corresponding CSS files (`app.css` and `enyo.css`).

* The `tools` folder houses two versions of the aforementioned `deploy` script,
    `deploy.bat` (for use on Windows) and `deploy.sh` (for Mac and Linux).

    During development, you'll load the application directly from the `source`
    folder.  (If you're using a Bootplate template, you'll do this by loading
    `debug.html`.)  When you're ready to deploy the application, run the
    `deploy` script to create a version of the app with the code minified and
    non-essential files removed.

## The lib Folder and Plugins

Enyo's infrastructure is intended to support a wide variety of plugins.  While
it is not a technical requirement, the convention is to put plugins in a folder
called `lib` that is a peer to `enyo`:

        <application>
            enyo/
            lib/
                aPluginFolder/
                    assets/
                    source/
                    package.js
                    (readmes, licenses, nfos)

Again, notice that the standard scaffold has been used for this plugin.

## Standard Snapshot

If we combine the two preceding examples, we get the complete suggested folder
structure:

        <application>
            assets/
            build/
                enyo.js
                enyo.css
                app.js
                app.css
            enyo/
            lib/
                aPluginFolder/
                    assets/
                    source/
                    package.js
                    (readmes, licenses, nfos)
            source/
            tools/
            debug.html
            deploy.json
            index.html
            package.js
            (readmes, licenses, nfos)

As touched upon earlier, to construct a production version of the app, duplicate
the folder tree and then run `deploy` to generate a deployment build with debug
and development resources removed.  By default, this build will be created in a
folder called `deploy`.

Here's the deployment tree for the suggested folder structure:

        <application>/
            deploy/
                assets/
                build/
                    enyo.js
                    enyo.css
                    app.js
                    app.css
                lib/
                    aPluginFolder/
                        assets/
                        (licenses)
                index.html

Note that the `enyo` folder itself is not necessary for deployment.

## Sharing Enyo

As mentioned previously, it's also possible to build applications that refer to
shared copies of Enyo and/or plugins.  In this case, shared resources are found
in a common location.  This type of setup is most useful when developing
plugins, creating a suite of applications that will be deployed together, or
working on the Enyo source itself.

Here's an example of a shared app structure:

        <root>/
            <shared-root>/
                enyo/
                lib/
                    onyx/
                    layout/
            <apps-root>
                <app1>/
                <app2>/

The libraries under `<shared-root>` are cloned from GitHub individually.

Under `<apps-root>`, new apps (e.g., `<app1>`) may be created by cloning the
appropriate bootplate template.  In this case, the app is using the Onyx UI
library, so you would clone the `bootplate` template.  Within `<apps-root>`,
issue the command:

        git clone https://github.com/enyojs/bootplate.git <app1>

(To use the Moonstone UI library instead, clone `moonstone` within
`<shared-root>/lib` and clone `bootplate-moonstone` within `<apps-root>`.)

Within `<app1>`, the paths to `enyo` and the libraries will need to be updated
to reflect their non-standard, shared location.  Specifically, three files need
updating:

* In `deploy.json`, the library paths must be changed from `./lib` to
    `../../<shared-root>/lib`.

* In `debug.html`, the path to `enyo` must be changed from `./enyo` to
    `../../<shared-root>/enyo`.  (Note that `index.html` does not need to be
    changed.)

* In `tools/deploy.sh`, the path to `enyo` must be updated (from
    `"$SRC/enyo"` to `"$SRC/../../<shared-root>/enyo"`) and the output path
    for the `deploy.js` script must be overridden.  Override the output path
    using the deploy script's `-e` switch, changing `"$SRC/deploy" $@` to
    `"$SRC/deploy" -e "$ENYO" $@`.

(Note that a [patch file](https://paste.ee/p/51xpD) is available for use as a
guide when making these updates.)
