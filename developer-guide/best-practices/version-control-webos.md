% Version Control Topics for Enyo Apps

## Using Submodules

### Overview

Git submodules allow you to include code from one git repository into another,
which lets you easily update to new versions of external sources without needing
to check in new copies of the external code.

In a Bootplate-based app, we typically use the following structure, where the
items in _italics_ are folders checked into your app in the normal manner, and
the items in __bold__ are Git submodules that point to external repositories:

* [app-root]
    * _assets_
    * __enyo__ -> https://github.com/enyojs/enyo.git
    * _lib_
        * __enyo-cordova__ -> https://github.com/enyojs/enyo-cordova.git
        * __enyo-ilib__ -> https://github.com/enyojs/enyo-ilib.git
        * __enyo-webos__ -> https://github.com/enyojs/enyo-webos.git
        * __layout__ -> https://github.com/enyojs/layout.git
        * __moonstone__ -> https/github.com./enyojs/moonestone.git
        * __spotlight__ -> https://github.com//enyojs/spotlight.git
    * _source_
    * _tools_

Submodules are stored as three pieces of metadata in your project:

* The URL to the external Git repo
* The folder in your project to which the external repo will be checked out
* The version (Git SHA hash) of the external Git repo to use

### Adding Submodules

To add a submodule to your project, run the following command:

        git submodule add <url> <folder>

where `url` is the URL for the Git repo to include, and `folder` is the path in
your project where the repo's source should be checked out to.

For example: 

        git submodule add https://github.com/enyojs/moonstone.git lib/moonstone

### Changing Submodule Versions

To change the version of a submodule, use the `checkout` command:

        cd lib/moonstone
        git checkout pilot-5			# Switch to pilot-5 tag
        cd ../..

To update all submodules in your project to use a specific version, do the
following:

        git submodule foreach git checkout pilot-5

After updating the submodule version, you'll typically want to check in the
version used, so that the submodules will point to the new version the next time
the project is cloned or updated.  To do this, simply `git add`, `commit`, and
`push` the path to the folder containing the submodule as if it were a single
file.  (Git is only updating the your repo's metadata for the submodule to
contain the SHA hash for the new version; it is not updating the actual folder
or files.)

        git add enyo lib/*
        git commit
        git push

### Cloning Projects with Submodules

When you clone a Git project that includes submodules, use the `--recursive`
flag to make Git check out the submodules along with the repo, e.g.:

        git clone --recursive https://github.com/<project.name>/<repo.name>.git

### Converting Projects to Use Submodules

If you started your project by copying the `enyo` and the `lib` source into your
project as files, you'll want to follow these steps to convert the folders to
submodules:

        # Remove existing folders that will be replaced with submodules
        rm -rf enyo lib/*
        git add -u
        git commit

        # Add new submodules in their place
        git submodule add https://github.com/enyojs/enyo.git enyo
        git submodule add https://github.com/enyojs/enyo-cordova.git lib/enyo-cordova
        git submodule add https://github.com/enyojs/enyo-ilib.git lib/enyo-ilib
        git submodule add https://github.com/enyojs/enyo-webos.git lib/enyo-webos
        git submodule add https://github.com/enyojs/layout.git lib/layout
        git submodule add https://github.com/enyojs/moonstone.git lib/moonstone
        git submodule add https://github.com/enyojs/spotlight.git lib/spotlight

        # Check out the version you'd like to start with
        git submodule foreach git checkout pilot-5

        # Commit the new submodules to your project
        git commit -a
        git push

<hr>

## Shared Component Libraries

Enyo encourages the factoring of application functionality into reusable
components.  In order to share components between multiple applications, the
shared components should typically be committed to a shared repository set up as
a standard Enyo library, similar to other libraries used in Enyo (`layout`,
`moonstone`, etc.).  In this way, the shared library may be added to
applications as a Git submodule under the `lib` folder.

The following are guidelines for setting up a new Enyo library:

### Folder layout

The following is a typical structure for an Enyo library (although the developer
retains considerable discretion):

* `<library-root>`
    * `package.js` - *includes source, css*
    * `css`
        * `package.js`
        * *CSS/LESS source*
    * source
        * `package.js`
        * *JavaScript source*
    * images
        * *any images/assets*
    * `deploy.json` - Deployment configuration file

It is vitally important to remember the top-level `package.js` file (which
includes all required JavaScript and CSS) and the `deploy.json` file.

### Deployment

An important characteristic of Enyo libraries is that they should know how to
deploy themselves when included in a Bootplate app.  Although the standard
Bootplate `deploy` script will traverse the application's top-level `package.js`
and include all referenced library JavaScript or CSS in the final minified
files, it is the responsibility of the library to provide a `deploy.json` file
that specifies any additional deployment tasks that need to be performed, such
as copying assets (e.g., images) to the final output folder.

The simple `deploy.json` shown below provides the path to the library's main
`package.js` file and indicates that the `images` directory should be copied to
the output folder.  In addition, we can tell from the empty `"libs"` array that
there are no extra libraries that need to be copied to output.

        {
            "packagejs": "./package.js",
            "assets": ["images"],
            "libs": []
        }

If a library does not contain a `deploy.json` file, the entire library
will be copied to the output folder, which is wasteful from a package size point
of view, since it will include the un-minified source and any other extraneous
files, such as samples.

### Asset URLs

Relative paths to assets contained in libraries can be problematic, since the
non-minified folder structure can differ from the minified structure, and a
library may ultimately be deployed elsewhere (such as an on-device location
separate from the app).  In order to make libraries portable, Enyo employs
specific mechanisms for dealing with asset paths:

| URL Location | Developer Responsibility | Example | Notes |
|:-----|:---------------------------------|:--------|:------|
| CSS | Specify as relative path from CSS file as normal | `background-image:url(../images/foo.png)`) | URLs included in CSS are relative to the CSS file they are included in and are easy to parse/post-process.  As such, the Enyo minifier automatically rewrites URLs found in CSS files to be relative to the final minified CSS output file, such that no special consideration is needed on the part of the developer. |
| JavaScript (standard components) | Specify as relative path from lib folder using `$lib` token | `this.$.image.setSrc ("$lib/mylib/images/foo.png");` | URLs set via JavaScript are relative to the folder containing the HTML file that loaded the page.  For all standard component properties (e.g., `src`), Enyo rewrites URLs based on the final location of the library. |
| JavaScript (custom components) | Specify as relative path from lib folder using `$lib` token.  Pass to CSS/DOM after re-writing using `enyo.path.rewrite(<path>)`. | Assuming the caller of the custom API sets `this.urlProp` to include the `$lib` token in the URL: `this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.urlProp) + ")")` | When creating a custom component, you must ensure that any asset paths passed to CSS or DOM are rewritten using the `enyo.path.rewrite` API.
