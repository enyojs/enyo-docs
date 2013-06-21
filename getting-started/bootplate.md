# Bootplate

The **Bootplate** template provides a complete starter project that supports
source control and cross-platform deployment out of the box.  It can be used to
facilitate both the creation of a new project and the preparation for its
eventual deployment.

## Quick Start with Bootplate

There are two ways to use the Bootplate template to start a new project.
Whether or not you want your project to live on GitHub will determine which one
is right for you.

### The GitHub Way

1. If you want your new project to be created as its own GitHub repository, the
    first step is to fork, or duplicate, the
    [Bootplate template project](https://github.com/enyojs/bootplate).

    Refer to the document on [Dupliforking](dupliforking.html) for instructions
    on how to spawn a new repository from the Bootplate project.

2. Load `debug.html` in a browser and see "Hello World".

Even if you don't plan to "duplifork" Bootplate so you can push back to GitHub,
note that if you pull the `bootplate` repo from GitHub, you will still need to
initialize the `enyo/lib` submodules by running the following command from
within the Bootplate app's directory:

    git submodule update --init

By default, Bootplate includes the `layout` and `onyx` libraries as submodules.
We've chosen not to include `g11n` in the base project, since it's a fairly
large library that not everyone will use.  You may add it as a submodule in your
by issuing the command:

    git submodule add https://github.com/enyojs/g11n.git lib/g11n

and then editing the root package.js file to include the `$lib/g11n` folder in
the list of dependencies.

Also note that the references to the submodules in the
[.gitmodules](https://github.com/enyojs/bootplate/blob/master/.gitmodules) file
may not work if you're behind a firewall that affects HTTP communication.  You
may manually edit this file in your local copy of Bootplate to tailor it for
your specific environment.  For example, in our Bootplate-based `api-tool` and
`sampler` repos, we've modified the `.gitmodules` files to use relative URL
references.  (Be aware, however, that this particular change will only work for
your project if you also fork `enyo` and its libraries into your own GitHub
account.)

### The Non-GitHub Way

1. If you have downloaded the Enyo source from [enyojs.com](http://enyojs.com),
    the zip archive should contain a copy of the Bootplate template (without the
    source control hooks) in a top-level directory called `bootplate`.  Locate
    this folder and open it.

2. Load `debug.html` in a browser and see "Hello World".

## Development

At this point, you would refine your project through the normal cycle of
development and testing, starting with the `source/App.js` and `source/App.css`
files provided in the template.  As your app grows to include more and more
JavaScript and CSS files, and libraries with their own `package.js` files, make
sure to include these in your top-level `source/package.js` and the `minify` and
`deploy` scripts described below will combine them all into a single JavaScript
file and a single CSS file for deployment.

For the purposes of this article, let's assume that you've completed all of your
work on the "HelloWorld" app, and turn our attention to the deployment process.

## Preparing for Deployment

By following the structure established by the Bootplate template, you set
yourself up for a relatively pain-free experience when it comes time to prepare
your finished app for deployment:

1. Check that you have the node.js runtime installed on your system.  You'll
    need version 0.6 or later for the deployment scripts to work.  You can
    download it from [nodejs.org](http://nodejs.org).

2. Make a deployment build by doing the following:

        * Open a command prompt (Windows) or terminal window (Mac/Linux).
        
        * On the command line, navigate to root of your bootplate folder.

        * Run the `tools\deploy.bat` script (Windows) or `./tools/deploy.sh`
        (Mac/Linux).

        (Note: For releases prior to 2.1.1, navigate to the `tools` folder and
        run `deploy.bat` or `./deploy.sh`)

    The `deploy` script invokes the `minify` script; it is typically not
    necessary to call `minify` directly.

    `minify` creates one compressed JavaScript file and one compressed CSS file
    for your app, which it then writes to a folder called `build`.

    After `minify` completes, `deploy` copies a subset of the project files
    (including the `build` folder) into a subfolder within the `deploy` folder.

3. Open the deployment folder, load `index.html` in a browser, and see "Hello
    World" (but faster!).

Now your project is ready to deploy to various HTML5-ready targets.  For details
about deploying an app to specific platforms, see
[Platform-Specific Deployment](../deploying-apps/platform-specific-deployment.html).

## Additional Notes on Bootplate Projects

### Embedded Enyo

Bootplate projects are set up to use _embedded_ Enyo.  In other words, the Enyo
library and other dependencies are stored completely inside the project folder.
These resources are relatively small, and keeping all the dependencies together
allows the developer to control versions and to easily deploy sealed packages
(e.g., PhoneGap builds).

### Submodules for Versioning

Resources from other repositories are included as git submodules.  This way, you
can control the versions of those resources in your project directly from git
(you can lock to a version, update, or revert at will).

In particular, the `enyo` folder and package libraries in the `lib` folder are
actually submodules.

### Development vs. Deployment

When developing and debugging your project, it's common to need various source
files and helper tools that are not needed in the final package.  For this
reason, we have the concept of making an application _deployment_.   A
deployment refers to a final production package, ready for inclusion in an app
store or other method of distribution.

An important feature of Bootplate projects is that you can generate deployments
from them with relative ease.

### Folder Structure

A Bootplate project has the following structure:

	api/
	assets/
	build/
	enyo/
	lib/
	source/
	tools/
	debug.html
	index.html

* `api` has a minified version of the EnyoJS API tool with its manifest pointing
    to the copy of enyo and its libraries that come with Bootplate.

* `assets` contains images or other data files for you projects. Files in this
    folder are intended to be necessary for deployment.

* `build` contains JavaScript and CSS source files that have passed through the
    Enyo minifier script.  If the `build` folder does not exist, it will be
    created when the minifier is run.

* `enyo` contains the Enyo framework source files.  This folder is only
    necessary for debugging, and can be deleted for deployment.

* `lib` contains various plugin files.  Individual folders in `lib` can come
    from various sources and may have custom rules for deployment.  In general,
    `assets` or `images` folders are required, and other files are only for
    debugging.

* `source` contains the code source files or other debug-only materials.

* `tools` contains the `deploy` and `minify` shell scripts.

* `debug.html` loads the application without using any built files; loading
    `debug.html` is generally the easiest way to debug.

* `index.html` loads the application using built files only.  If built files are
    not available, it will redirect to `debug.html`.

### Updating the Submodules Manually

If you want to use top-of-tree versions of Enyo, Layout, and Onyx, you can do
this with a couple of git commands:

    git submodule foreach 'git checkout master'
    git submodule foreach 'git pull'

The first command switches each submodule from being pinned to a specific commit
to being on the master branch, while the second pulls any new source changes
from GitHub.  You can also manually check out specific tags or branches if you
wish.

If you want to use stable code, the Enyo team manually updates the submodules
links from time to time as we make updates to Bootplate, so you can just pull
the `bootplate` repo and then use `git submodule update` to refresh your local
tree.

**Additional Reading**

* [Enyo Tutorial](../tutorials/tutorial.html)
* [Platform-Specific Deployment](../deploying-apps/platform-specific-deployment.html)
