% Bootplate

Bootplate (BOOTstrap + boilerPLATE) templates provide complete starter projects
with support for source control and cross-platform deployment out of the box.
They may be used to facilitate both the creation of new projects and the
preparation for those projects' eventual deployment.

## Quick Start with Bootplate

There are two ways to use a bootplate template to start a new project--one that
uses version-controlled source from GitHub, and another that does not.

### The GitHub Way

**Note:** The following command-line instructions should work on Mac OS X,
Linux, or Windows if the [official Git client](http://git-scm.com/download) is
installed.

1. Choose one of the bootplate template projects, such as
    [bootplate-moonstone](https://github.com/enyojs/bootplate-moonstone) or
    [bootplate](https://github.com/enyojs/bootplate), and use Git's `clone`
    command to obtain the source code, e.g.:

    ```
        git clone --recursive --branch 2.4.0 https://github.com/enyojs/bootplate-moonstone.git <myProjectName>
    ```

    By default, `bootplate-moonstone` includes a fair number of submodules
    (including the `enyo` framework core and `moonstone` UI library).  The
    `--recursive` flag in the preceding command tells Git to initialize the
    submodules when cloning the project, while `--branch 2.4.0` ensures that
    we'll obtain framework code from a stable release branch.

    At this point, you should be able to load `debug.html` in a browser and see
    "Hello World".

2. On github.com, [create a new repository](https://github.com/repositories/new)
    for your project.

3. Use the following command to point your clone of bootplate at your new GitHub
    repo (this changes where the code is pushed to and pulled from):

    ```
        git remote set-url origin git@github.com:<your user name>/<myProjectName>.git
    ```

    Alternatively, you may edit the config file, `<myProjectName>/.git/config`,
    directly:

    ```
        [remote "origin"]
            url = git@github.com:<your user name>/<myProjectName>.git
            ...
    ```

4. Push subsequent changes to the new repo.

Now, strictly speaking, the process described in steps 2-4 is only necessary if
you want your new project to exist as its own GitHub repository.  The Enyo team
has historically referred to this as "dupliforking", since it works around a
limitation in GitHub that would otherwise prevent the creation of multiple
(duplicate) forks from a single project.

### The Non-GitHub Way

1. Download a bootplate zip archive from
    [enyojs.com](http://enyojs.com/get-enyo/), unzip the archive, and open the
    `bootplate-moonstone` folder (or `bootplate` folder, for the Onyx version).

2. Load `debug.html` in a browser and see "Hello World".

## Development

At this point, you would refine your project through the normal cycle of
development and testing, starting with the `source/app.js` file provided in the
template.  As your app grows to include more and more JavaScript and CSS files,
and libraries with their own `package.js` files, make sure to include these in
your top-level `source/package.js` and the `deploy` script described below will
combine them all into optimized JavaScript and CSS files for deployment.

For the purposes of this article, let's assume that you've completed all of your
work on the "HelloWorld" app, and turn our attention to the deployment process.

## Preparing for Deployment

By following the structure established by the bootplate templates, you set
yourself up for a relatively pain-free experience when it comes time to prepare
your finished app for deployment:

1. Check that you have the node.js runtime installed on your system.  You'll
    need version 0.8 or later for the deployment script to work.  You can
    download it from [nodejs.org](http://nodejs.org).

2. Make a deployment build by doing the following:

    * Open a command prompt (Windows) or terminal window (Mac/Linux).

    * On the command line, navigate to root of your bootplate folder.

    * Run the `tools\deploy.bat` script (Windows) or `./tools/deploy.sh`
        (Mac/Linux).

    (Note: For releases prior to 2.1.1, navigate to the `tools` folder and
    run `deploy.bat` or `./deploy.sh`)

    When the build is complete, there will be two compressed JavaScript files
    and two compressed CSS files in a folder called `build`; `app.js` and
    `app.css` contain your application code, while `enyo.js` and `enyo.css`
    contain framework code.

    The `build` folder and a set of complementary files (an `index.html` file
    that loads your app, any images or other resources used by the app, etc.)
    are then copied into the final deployment folder, called `deploy`.

3. Open the deployment folder, load `index.html` in a browser, and see "Hello
    World" (but faster!).

Now your project is ready to deploy to various HTML5-ready targets.  For details
about deploying apps to specific platforms, see [Platform-Specific
Deployment](../deploying-apps/platform-specific-deployment.html).

## Additional Notes on Bootplate Projects

### Embedded Enyo

Bootplate projects are set up to use _embedded_ Enyo.  In other words, the Enyo
library and other dependencies are stored completely inside the project folder.
These resources are relatively small, and keeping all the dependencies together
allows the developer to control versions and to easily deploy sealed packages
(e.g., PhoneGap builds).

### Submodules for Versioning

Because resources from other repositories are included as submodules, you can
control the versions of these resources in your project directly from Git (e.g.,
you can lock to a version, update, or revert at will).

As touched upon earlier, the `enyo` folder and the package libraries in the
`lib` folder are actually submodules.

### Development vs. Deployment

When developing and debugging your project, it's common to need various source
files and helper tools that are not needed in the final package.  For this
reason, we have the concept of making an application _deployment_.   A
deployment refers to a final production package, ready for inclusion in an app
store or other method of distribution.

An important feature of bootplate projects is that you can generate deployments
from them with relative ease.

### Folder Structure

A bootplate project has the following structure:

```
	assets/
	build/
	enyo/
	lib/
	source/
	tools/
	debug.html
	index.html
```

* `assets` contains images or other data files for you projects. Files in this
    folder are intended to be necessary for deployment.

* `build` contains JavaScript and CSS source files that have passed through the
    optimization script.  If the `build` folder does not exist, it will be
    created when the `deploy` script is run.

* `enyo` contains the Enyo framework source files.  This folder is only
    necessary for debugging, and may be deleted for deployment.

* `lib` contains various plugin files.  Individual folders in `lib` may come
    from various sources and may have custom rules for deployment.  In general,
    `assets` or `images` folders are required, and other files are only for
    debugging.

* `source` contains the code source files or other debug-only materials.

* `tools` contains the `deploy` shell script.

* `debug.html` loads the application without using any built files; loading
    `debug.html` is generally the easiest way to debug.

* `index.html` loads the application using built files only.  If built files are
    not available, it will redirect to `debug.html`.

### Updating the Submodules Manually

If you want to use top-of-tree versions of Enyo, Moonstone, and the other
submodules, you can do this with a couple of Git commands:

```
    git submodule foreach 'git checkout master'
    git submodule foreach 'git pull'
```

The first command switches each submodule from being pinned to a specific commit
to being on the master branch, while the second pulls any new source changes
from GitHub.  You may also manually check out specific tags or branches if you
wish.

From time to time, the Enyo team manually updates the submodule links in the
bootplate templates, so if you want to stick with stable code, you can just pull
the `bootplate-moonstone` repo and then use `git submodule update` to refresh
your local tree.

### Submodules and Firewalls

References to submodules in the
[.gitmodules](https://github.com/enyojs/bootplate-moonstone/blob/master/.gitmodules)
file may not work if you're behind a firewall that affects HTTP communication.
You may manually edit this file in your local copy of bootplate to tailor it for
your specific environment.  For example, in our bootplate-based
[api-tool](https://github.com/enyojs/api-tool) and
[sampler](https://github.com/enyojs/sampler) repos, we've modified the
`.gitmodules` files to use relative URL references.  (Be aware, though, that
this particular change will only work for your project if you also fork `enyo`
and its libraries into your own GitHub account.)

**Additional Reading**

* [Moonstone App Tutorial](moonstone-app-tutorial.html)
* [Platform-Specific Deployment](../deploying-apps/platform-specific-deployment.html)
