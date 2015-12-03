% Version Control Topics for Enyo Apps

## What Belongs in Version Control

In most cases, it is not necessary, or desirable, to commit the Enyo framework
source to version control along with your app. The `enyo init` command will
add the needed libraries for a project whenever it is checked out from version
control and it is possible to even specify specific versions of the libraries
to use. The `enyo init` command also creates a *.gitignore* file that automatically
ignores directories and files that should not generally be committed with app
source.  These include:

* The *lib* directory, where the framework source is stored
* The *node_modules* directory that holds node modules needed for test and deployment
* Build targets (such as the *dist* directory) and artifacts

When using other version control systems, these same directories should be excluded.

For more information on specifying Enyo libraries and versions, refer to the enyo-dev documentation.

## Shared Component Libraries

Enyo encourages the factoring of application functionality into reusable
components.  In order to share components between multiple applications, the
shared components should typically be committed to a shared repository set up as
a standard Enyo library, similar to other libraries used in Enyo (`layout`,
`moonstone`, etc.).  In this way, the shared library may be added to
applications with the enyo-dev tool.

The following are guidelines for setting up a new Enyo library:

### Folder layout

The following is a typical structure for an Enyo library (although the developer
retains considerable discretion):

* `<library-root>`
    * `package.json` - *Project definitions*
    * `css`
        * *CSS/LESS source*
    * `src`
        * *JavaScript source*
    * `images`
        * *any images/assets*
    * `index.js`

It is vitally important to remember the top-level `package.json` as this file
includes all the information about the project dependencies and tells the dev
tools which assets and css files to include.

A new library can be created by issuing the `enyo init --library` command. This will set the proper settings in *.enyoconfig*, but does not create any of the directories.

### Asset URLs

Relative paths to assets contained in libraries can be problematic, since the
non-minified folder structure can differ from the minified structure, and a
library may ultimately be deployed elsewhere (such as an on-device location
separate from the app).  In order to make libraries portable, Enyo employs
specific mechanisms for dealing with asset paths:

| URL Location | Developer Responsibility | Example | Notes |
|:-----|:---------------------------------|:--------|:------|
| CSS | Specify as relative path from CSS file as normal | `background-image:url(../images/foo.png)`) | URLs included in CSS are relative to the CSS file they are included in and are easy to parse/post-process.  As such, the Enyo minifier automatically rewrites URLs found in CSS files to be relative to the final minified CSS output file, such that no special consideration is needed on the part of the developer. |
| JavaScript | Specify as relative path from the source file using `@` token | `this.$.image.setSrc ("@../images/foo.png");` | URLs set via JavaScript are relative to the folder containing the HTML file that loaded the page.  For all standard component properties (e.g., `src`), Enyo rewrites URLs based on the final location of the library. |
