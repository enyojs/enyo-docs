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
    * __enyo__ -> ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo.git
    * _lib_
        * __enyo-cordova__ -> ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo-cordova.git
        * __enyo-ilib__ -> ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo-ilib.git
        * __enyo-webos__ -> ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo-webos.git
        * __layout__ -> ssh://polar.lge.com:29438/zz-github_mirror/enyojs/layout.git
        * __moonstone__ -> ssh://polar.lge.com:29438/zz-github_mirror/enyojs/moonstone.git
        * __spotlight__ ->ssh://polar.lge.com:29438/zz-github_mirror/enyojs/spotlight.git
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

        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/moonstone.git lib/moonstone

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

        git clone --recursive ssh://wall.lge.com:29448/app/com.webos.app.livetv.git

### Converting Projects to Use Submodules

If you started your project by copying the `enyo` and the `lib` source into your
project as files, you'll want to follow these steps to convert the folders to
submodules:

        # Remove existing folders that will be replaced with submodules
        rm -rf enyo lib/*
        git add -u
        git commit

        # Add new submodules in their place
        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo.git enyo
        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo-cordova.git lib/enyo-cordova
        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo-ilib.git lib/enyo-ilib
        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/enyo-webos.git lib/enyo-webos
        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/layout.git lib/layout
        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/moonstone.git lib/moonstone
        git submodule add ssh://polar.lge.com:29438/zz-github_mirror/enyojs/spotlight.git lib/spotlight

        # Check out the version you'd like to start with
        git submodule foreach git checkout pilot-5

        # Commit the new submodules to your project
        git commit -a
        git push

<hr>

## Adding Enyo Apps to Starfish

The Starfish build is now able to deploy your Enyo app and services into the
proper ROM location directly from un-minified source in your Bootplate-based
repo using the `ares-package` command from the [Ares CLI
tools](https://gecko.palm.com/jenkins/view/Enyo/job/enyo-package-ares-sdk-xplat/).
Thus you should not commit minified/deployed source to your application repo,
since this step will be done automatically as part of the build.  

Additionally, when building for device, you may specify parameters in your
`appinfo.json` file that redirect your app to use Enyo source located in the
device ROM under `/usr/palm/frameworks/enyo/...`.  No manual modification of
your `index.html` file is necessary.

### Adding Build Recipes

Enyo apps should be added to the Starfish build by adding a new bitbake recipe for your app
in the `recipes-webos/enyojs-apps` directory of the `meta-starfish` repo, using [this bitbake recipe
template](https://gpro.palm.com/gitweb?p=webos-pro/meta-webos-pro.git;a=blob;f=recipes-webos/enyojs-apps/com.palm.app.TEMPLATE.bbx;hb=HEAD),
whose contents are shown below:

        # Copyright (c) 2013 LG Electronics, Inc.

        SUMMARY = "Your new bootplate application"
        SECTION = "webos/apps"
        LICENSE = "CLOSED"

        PR = "r0"

        inherit webos_component
        inherit webos_enhanced_submissions
        inherit webos_enyojs_app
        inherit webos_arch_indep

        WEBOS_GIT_TAG = "submission/${WEBOS_SUBMISSION}"
        SRC_URI = "${STARFISH_EXTENDED_APP_GIT_REPO_COMPLETE}"
        S = "${WORKDIR}/git"

In particular, note that Enyo app recipes should include the
`inherit webos_enyojs_app` line, as opposed to `inherit webos_cmake`.  No
`CMakeLists.txt` file is required in your repo.

Note: The variable in `SRC_URI` should be updated to match the server
where your app repo lives.  Examples:

| Variable | Repo |
|----------|------|
| `ENYOJS_GIT_REPO_COMPLETE` | enyojs on github |
| `STARFISH_EXTENDED_APP_GIT_REPO_COMPLETE` | TV Lab app repo |

### Using On-Device Enyo Framework Source

Unless your app has special requirements, it should generally be built using a
version of the on-device Enyo framework source.  Shortly after each pilot
release, the Enyo team adds pre-minified versions of the Enyo framework and all
libraries used by `bootplate-moonstone` apps to the Starfish build under the
`/usr/palm/frameworks/enyo/<version>` folder.  Since packaging Enyo and all of
its libraries inside the app package can consume ~20MB of flash per app, all
applications will eventually need to be packaged using the shared on-device
source.

An Enyo app may opt-in to using on-device source by adding the following hash to
its `appinfo.json` file:

        "onDeviceSource": {
            "enyo": 			"$enyo-framework/2.3.0-pre.5/enyo",
            "lib/layout": 		"$enyo-framework/2.3.0-pre.5/lib/layout",
            "lib/moonstone": 	"$enyo-framework/2.3.0-pre.5/lib/moonstone",
            "lib/spotlight": 	"$enyo-framework/2.3.0-pre.5/lib/spotlight",
            "lib/enyo-cordova":	"$enyo-framework/2.3.0-pre.5/lib/enyo-cordova",
            "lib/enyo-webos": 	"$enyo-framework/2.3.0-pre.5/lib/enyo-webos",
            "lib/enyo-ilib": 	"$enyo-framework/2.3.0-pre.5/lib/enyo-ilib"
        }

In the example above, the application will be built using version `2.3.0-pre.5`
(aka "pilot-5") for Enyo and all of the libraries, overriding any version that
may have been present in the application repo.

As of this writing (2013 Aug 29), the following folders may be specified in the
`onDeviceSource` hash in `appinfo.json`:

| Folder | Tag | Notes |
|--------|-----|-------|
| `$enyo-framework/2.3.0-pre.5` | pilot-5 | Officially released |
| `$enyo-framework/2.3.0-pre.6` | pilot-6 | Officially released |
| `$enyo-framework/2.3.0-pre.7` | pilot-7 | Officially released |
| `$enyo-framework/latest` | pilot-7 | Symlink to latest pilot release; not recommended for most apps |
| `$enyo-framework/development` | master | Master branch at last update of on-device source; do not use |

### Building Apps with Non-onDeviceSource Submodules

__IMPORTANT:__ Currently, the OE build fetcher is unable to check out Git
submodules by default.  Most apps that are building with onDeviceSource will not
need their submodules checked out at all, since they will be redirected to the
on-device location and not packaged with your app.  However, if your app uses
a submodule that is not included in the onDeviceSources, then you will need to
add the following additional items to your bitbake recipe:

Add the variables below, where `<submodule>` and `<submodule2>` are example submodules
that should be checked out, and `<hash1>` and `<hash2>` are the Git SHA1 commit hash of
the version of each submodule to check out (change these to the name and hash of your 
actual repo/submodule):

        SRC_URI_append = "\
            ${STARFISH_EXTENDED_APP_GIT_REPO_PREFIX}/<submodule1>;tag=<hash1>;protocol=git;destsuffix=git/lib/<submodule1> \
            ${STARFISH_EXTENDED_APP_GIT_REPO_PREFIX}/<submodule2>;tag=<hash2>;protocol=git;destsuffix=git/lib/<submodule2> \
            " 

You should change `${STARFISH_EXTENDED_APP_GIT_REPO}` to use the bitbake
variable that points to the Git server that contains your repo.  Examples:

| Variable | Repo |
|----------|------|
| `${ENYOJS_GIT_REPO}` | enyojs on github.com |
| `${STARFISH_EXTENDED_APP_GIT_REPO_PREFIX}` | TV Lab Git server |

To determine the current hash of the submodule in your app repo, use the following command:

      $ git submodule

Note: The SVL build team will provide a script in the future that will assist in automatically
generating updates to the recipies when creating a new submission, to eliminate the need
to manually update SHA1 hashes in your recipe.


### Example

For a sample application below, we want the "lib/mylib" to be checked out from git,
and all other submodules to be built using the pilot-6 on-device source.  First, run git submodule:

      $ git submodule
       264d97bad1bf5daceec468d2e3cc5a477ee6c954 enyo (2.3.0-pre.6)
       2bce4f97e8d4b7705fab64c30ec135ccfbab8a03 lib/enyo-cordova (2.3.0-pre.6)
       dd44f224bda38eee5ae6a831ad320842ea6c13b4 lib/enyo-ilib (2.3.0-pre.6)
       6301fe04ab574f2fed75ff4d5186780c0d9f612d lib/enyo-webos (2.3.0-pre.6)
       1e0dc2813b86b0e0f74a59916f61bdf082c0fbb5 lib/layout (2.3.0-pre.6)
       b5550ec9693408408ae6aef07b56afc855ac98dd lib/moonstone (2.3.0-pre.6)
       153b2ab90e090976cffc211662c4c8389a7793fc lib/spotlight (2.3.0-pre.6)
       62c4c8389a7793fc153b2ab90e090976cffc2116 lib/mylib

Next, add the following to your app recipe to checkout mylib:
       
      SRC_URI_append = "\
            ${STARFISH_EXTENDED_APP_GIT_REPO_PREFIX}/mylib;tag=62c4c8389a7793fc153b2ab90e090976cffc2116;protocol=git;destsuffix=git/lib/mylib \
            " 

Finally, add the following to `appinfo.json`, to direct all other submodules to use pilot-6:

        "onDeviceSource": {
            "enyo": 			      "$enyo-framework/2.3.0-pre.6/enyo",
            "lib/layout": 	   	"$enyo-framework/2.3.0-pre.6/lib/layout",
            "lib/moonstone":  	"$enyo-framework/2.3.0-pre.6/lib/moonstone",
            "lib/spotlight": 	   "$enyo-framework/2.3.0-pre.6/lib/spotlight",
            "lib/enyo-cordova":	"$enyo-framework/2.3.0-pre.6/lib/enyo-cordova",
            "lib/enyo-webos": 	"$enyo-framework/2.3.0-pre.6/lib/enyo-webos",
            "lib/enyo-ilib": 	   "$enyo-framework/2.3.0-pre.6/lib/enyo-ilib"
        }

### Additional Requirements for App Build

The Enyo app build support in the OE build (based on the `ares-package` tool) makes certain assumptions
about your app layout.  If you have followed the Bootplate template, you should generally be fine.
However, please note the following:

* No modifications should be made to Bootplate's `index.html`.  The
    `ares-package` step will rewrite paths in this file for you based on the
    `onDeviceSource` directive in `appinfo.json`.

* The `appinfo.json` file should point to the root `index.html`.

* All JavaScript/CSS files should be loaded through `package.js`, if possible.

* Any non-JavaScript/CSS files required by your app (images, JSON data, etc.)
    should be placed under the `assets` folder; otherwise they will not be
    copied into the deployed version of your app.

* Any JavaScript/CSS files not loaded through `package.js` should also be placed
    under the `assets` folder, and loaded from there.

* Your app repo should generally only contain your app source, with no
    built/minified source (since this is automatically generated for you by the
    build).  You should not need to commit any `build` or `deploy` folder to
    your repo.

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
    * `deploy.sh` - *bash (Mac/Linux) deploy script - copies images to output folder*
    * `deploy.bat` - *Windows deploy script - copies images to output folder*

It is vitally important to remember the top-level `package.js` file (which
includes all required JavaScript and CSS) and the `deploy` scripts (see below).

### Deploy Scripts

An important aspect of Enyo libraries is that they should know how to deploy
themselves when included in a Bootplate app.  Although the standard Bootplate
`deploy`/`minify` scripts will traverse the top-level application `package.js`
and include all referenced library JavaScript or CSS in the final minified
files, it is the responsibility of the library to perform any additional
deployment steps, such as copying assets (e.g., images) to the final output
folder.  If a library does not contain a `deploy` script, the entire library
will be copied to the output folder, which is wasteful from a package size point
of view, since it will include the un-minified source and any other extraneous
files, such as samples.

As part of the app minification/deployment process, the Enyo Bootplate `deploy`
script will automatically find and call any `deploy.sh`/`deploy.bat` files found
in subfolders of the `lib` folder.  As such, a library should typically copy the
`images` folder from `lib/<library>` to the `<output>/lib/<library>` folder,
along with any other assets, like fonts, localization files, etc.  Please refer
to the Onyx library's [Unix](https://github.com/enyojs/onyx/blob/master/deploy.sh)
and [Windows](https://github.com/enyojs/onyx/blob/master/deploy.bat) `deploy`
scripts for reference. 

If a library contains no assets to copy, it should still include blank `deploy`
scripts to prevent the copying of the entire repository contents.  Also, please
remember to set the `+x` bit for bash script files so that they are executable
on Mac/Linux machines.

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
