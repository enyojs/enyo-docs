% Structuring Your Project

While an Enyo application may be as simple as single HTML5 file, once we start
making more sophisticated apps, there are numerous resources to manage, versions
and dependencies to track, and debug switches to control.  This document covers
a number of conventions adopted by the Enyo team to facilitate a smooth
workflow.

## The Basic Scaffold

Enyo is designed so that plugins, applications, and Enyo itself are portable
resources.  The use of common folder conventions significantly simplifies the
management of these resources.

The suggested folder structure for a plugin looks like this:

        <plugin>
            assets/
            source/
            (readmes, licenses, nfos)

* `source` contains JavaScript modules, stylesheets, or other raw (code) materials
    for the application.

* `assets` typically contains images or other resources needed by both
    production and debug versions of the application.  There may be as many of
    these folders as you like, and the folder name is not special--a project
    might have folders called `images` and `json`, for example.  However, our
    suggestion is that you keep all such items in one folder called `assets`, so
    end users will know right away that this folder is necessary for final
    deployment.

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
            index.html

* The `enyo` folder contains a copy of the Enyo framework source.  As discussed
    below, it's possible to reference `enyo` from a common location instead of
    embedding it in the application proper, but for ease of versioning and
    sealing, we recommend that you keep a copy of Enyo with your application. 

* The `lib` folder contains any plugins or other resources used by the project.

* The `build` folder is the home for _minified_ resources.  _Minified_ resources
    have been processed (by the `minify` script) to remove comments, whitespace,
    and other features that are not critical to functionality.  In JavaScript
    files, syntax is sometimes changed (e.g., variable names may be shortened)
    to reduce file size.

    When `minify` is run successfully, the output in `build` is one JavaScript
    file and one CSS file.

* The `tools` folder houses the aforementioned `minify` script, along with
    another script called `deploy`.

    During development, you'll load material directly from the `source` folder.
    When you're ready to deploy the application, run the `deploy` script to
    create a version of the app with the code minified and non-essential files
    removed.

    (Note that `deploy` calls `minify`, so it generally isn't necessary to call
    `minify` directly.)

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
                    (readmes, licenses, nfos)
		
Again, notice that the standard scaffold has been used for this plugin.

## Standard Snapshot

If we combine the two preceding examples, we get the complete suggested folder
structure:

        <application>
            assets/
            build/
                enyo-<version>.js
                enyo-<version>.css
                app.js
                app.css
            enyo/
            lib/
                aPluginFolder/
                    assets/
                    source/
                    (readmes, licenses, nfos)
            source/
            tools/
            index.html
            (readmes, licenses, nfos)

As touched upon earlier, to construct a production version of the app, duplicate
the folder tree and then run `deploy` to generate a deployment build with debug
and development resources removed.

Here's the deployment tree for the suggested folder structure:

        <application>
            assets/
            build/
                enyo-<version>.js
                enyo-<version>.css
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
in a common location:

        <shared-root>/
            enyo/
            lib/
                aPlugin/

The following structure shows two applications, both of which load Enyo and
plugins from `<shared-root>`:

        <apps-root>
            app1/
                assets/
                source/
                index.html
            app2/
                assets/
                source/

This type of setup is most useful when developing plugins, creating a suite of
applications that will be deployed together, or working on the Enyo source
itself.