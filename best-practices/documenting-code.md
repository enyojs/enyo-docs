# Documenting Code

## What to Document

The [Enyo API Viewer](http://enyojs.com/api) enables a live view of
documentation drawn from the source code of Enyo core and its related libraries.

The API Viewer looks at all publicly visible kinds, functions, and properties,
and displays them along with their documentation comments.  In addition, the
ancestry of kinds is shown, including inherited methods and properties.

When contributing a new kind, be sure to include a summary of the kind, along
with documentation for all events, published properties, and public methods.

Also, to ensure that the viewer will be able to display your documentation,
please follow the formatting guidelines outlined below.

## Markdown

All documentation for the viewer is written in
[Markdown](http://daringfireball.net/projects/markdown/), a lightweight
formatting language.

Enyo uses a special commenting syntax that allows for differentiation between
comments that are to be included in documentation and those that are not.

To have a Markdown-formatted comment appear as documentation in the API Viewer,
add a `*` to the comment syntax:

- Single Line Comment

        //* This is an Enyo documentation comment in _Markdown_.

- Multiline Comment

        /**
            This is an Enyo documentation comment in _Markdown_ that spans
            multiple lines.
        */

## Visibility

There are two visibility states in Enyo, denoted by pragmas that control the
visibility of the properties they precede.

* **Public**

    This is the default visibility state.  Any public code will be shown in the
    API Viewer.

    To mark an item as public, use the pragma `//* @public`:

        //* @public
        //* Returns true if the control is focused.
        hasFocus: function() {
            if (this.hasNode()) {
                return document.activeElement === this.node;
            }
        }

* **Protected**

    In this state, items are hidden from the API viewer.  Protected status is
    usually used for functions and properties that are not meant to be modified.

    To mark an item as protected, use the pragma `//* @protected`:

        //* @protected
        tag: "img",
        attributes: {
            draggable: "false"
        },
        create: function() {
            if (this.noEvents) {
                delete this.attributes.onload;
                delete this.attributes.onerror;
            }
            this.inherited(arguments);
        }

## Coding

For guidelines on writing code, see the [Coding Style Guide](style-guide.html).