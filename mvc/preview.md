% Enyo MVC Preview

## Exploring the Preview Release

While Enyo MVC is still under development, you are welcome to try it out in its
current state by doing the following:

* Clone the `bootplate-mvc` repository to your local machine.  If you have a
    command-line Git client installed, you can do this by issuing the following
    command:

        git clone git://github.com/enyojs/bootplate-mvc.git

* Enter the newly-created `bootplate-mvc` directory and initialize the
    submodules:

        git submodule update --init --recursive

    Note that the `--recursive` flag is mandatory.

* Set up a Web server to serve the app via http.

You should now be able to run the MVC startup app by loading `index.html` or
`debug.html` via http.

To create a new app based on `bootplate-mvc`, remove all the files from each
subdirectory of `source` and modify `source/package.js` and `source/start.js` to
suit your needs.
