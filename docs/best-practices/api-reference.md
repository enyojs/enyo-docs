% The API Reference

The [Enyo API Reference](http://enyojs.com/api), also known as the API Viewer or
API Tool, provides detailed information on all of the framework's publicly
accessible kinds.  This data originates in comments found in the framework's
JavaScript source code.   (including inherited methods and properties).

For the curious, the code used to generate the reference is available on GitHub
in the enyojs project's [enyo-docs](https://github.com/enyojs/enyo-docs) repo.

## Using the API Reference

### Properties, Events, and Methods

The primary purpose of the API Reference is to give application developers an
easy way to find documentation for the object properties, events, and methods
made available by Enyo and its related libraries (e.g., Moonstone, Layout,
Onyx).  When you view the information for a particular kind, you'll see a brief
description of the kind, followed by a listing of its public elements, under the
headings "Properties", "Methods", and "Events".

To begin browsing the API, follow one of the top-level navigation links.  For
example, if you follow the "namespaces" link, you'll find all the public
elements of the framework, sorted according to namespace--i.e., `enyo`, `moon`
(for Moonstone), or `onyx`.  Each namespace is broken down into its constituent
parts, which may include controls (UI components), kinds (non-UI components),
methods and properties that exist directly on the namespace, mixins (shared
chunks of functionality that may be added to individual kinds as needed), and
sub-namespaces (e.g., the focus-state management library, `enyo.Spotlight`).

## Documenting Code for the API Reference

### What to Document

When contributing a new kind, be sure to include appropriate documentation in
JSDoc format.  This will typically include a summary of the kind, along with
comments describing all public properties, methods, and events.  Details on how
these API elements should be documented are provided in the following section,
[How to Document](#how-to-document).

Members that are private to the kind should be marked with the `@private` tag,
but any additional documentation is optional.

### How to Document

Here are some guidelines to follow when creating (and formatting) documentation
for Enyo kinds.

#### Summary/Description

When documenting a kind, start with a brief summary of what the kind is and what
it does.  Then provide additional information via JSDoc tags.

```javascript
    /**
        * {@link moon.ContextualPopup} is a popup window control with Moonstone
        * visual styling applied. It extends {@link enyo.Popup} and is designed
        * to be used with {@link moon.ContextualPopupDecorator}.
        *
        * @class moon.ContextualPopup
        * @extends enyo.Popup
        * @ui
        * @public
    */
```

This example shows the standard set of tags for an Enyo kind:

* `@class` indicates the kind name, including namespace.

* `@extends` indicates the superkind, i.e., the kind from which the current kind
    is derived.

* `@ui` is a tag applied to UI components.  For non-UI components, there is no
    equivalent tag; just omit the `'@ui'`.

* `@public` indicates that this kind is part of the public API.  As we will see,
    the `@public` and `@private` tags are also applied to properties, methods,
    and events.

#### Public Properties

For public properties, begin by providing a brief description of the property.
In most cases, the description should be a sentence or less in length.  If the
property cannot be adequately described in one sentence, try to keep the
description as concise as possible.

```javascript
    /**
    * A boolean parameter affecting the size of the button. If `true`, the
    * button's diameter will be set to 60px. However, the button's tap
    * target will still have a diameter of 78px, with an invisible DOM
    * element wrapping the small button to provide the larger tap zone.
    *
    * @type {Boolean}
    * @default false
    * @public
    */
    small: false,
    ...
```

Be sure to indicate the property's data type (using the `@type` tag), and its
default value (using `@default`).  Also be sure to include the `@public` tag so
that the property will be displayed by the API Reference.

If the property accepts only specific string values, list the valid values, e.g.:

```javascript
    /**
    * Position of the tooltip with respect to the activating control. Valid
    * values are `'above'`, `'below'`, and `'auto'`.
    *
    * @type {String}
    * @default 'auto'
    * @public
    */
    position: 'auto',
    ...
```

Note that single quotes are used to indicate that a value is a string (e.g.,
`@default 'auto'`).  Also note that, within the summary/description section, the
single quotes are enclosed in backticks ``(`)``, which make text appear as
`monospaced` in the API Viewer.

#### Public Methods

When documenting a public method, first provide a brief description of what the
method does.  By convention, the description begins with a verb in the present
tense and is punctuated as a full sentence, with a period at the end, e.g.:

```javascript
    /**
    * Determines whether this control currently has the [focus]{@glossary focus}.
    *
    * @returns {Boolean} Whether this control has focus. `true` if the control
    * has focus; otherwise, `false`.
    * @public
    */
    hasFocus: function () {
        if (this.hasNode()) return document.activeElement === this.node;
    },
    ...
```

If, as in this example, the method has a return value, the documentation should
include the `@returns` tag.  Use it to provide the data type and a brief
description of the data being returned.

(Notice that the Boolean values `true` and `false` are formatted with backticks.
When documenting Enyo source code, backticks should also be placed around the
names of kinds (if the namespace is included--e.g., `enyo.Control`,
`moon.Button`), properties, methods, and CSS classes.)

In some cases, in addition to describing what a method does, it is helpful to
specify when it is used.

```javascript
    /**
    * A function that fires after the control has rendered. This performs a
    * reflow.
    *
    * @public
    */
    rendered: function () {
        ...
    },
    ...
```

#### Events

In the Enyo framework, events are typically declared at the top of each
JavaScript file, before the definition of the kind that generates them.

```javascript
    /**
    * Fires when either the main drawer or the control drawer is activated. No
    * event-specific data is sent with this event.
    *
    * @event moon.Drawer#onActivate
    * @type {Object}
    * @public
    */
```

In the example above, we see the basic JSDoc tags associated with an event.

* `@event` contains the name of the event `(onActivate)`, along with its
    generating kind `(moon.Drawer)`, with the two being separated by the `#`
    character.

* `@type` contains the data type; for events, this should be `Object`, since
    Enyo events are passed around as objects.

* `@public` marks the event as part of the public API.

An event object will often contain information specific to that event, which a
handler method might find useful, e.g.:

```javascript
    /**
    * Fires once per row at render time.
    *
    * @event enyo.List#onSetupItem
    * @type {Object}
    * @property {Number} index - The current row index.
    * @public
    */
```

Here the `@property` tag indicates that the event object has a property called
`index`, which contains the index of the row currently being rendered by an
`enyo.List`.  This property may be accessed by methods that handle the
`onSetupItem` event.

### Formatting (Markdown)

In addition to supporting JSDoc tags, the API Reference includes support for
[Markdown](http://daringfireball.net/projects/markdown/), a lightweight
language for formatting text.

Markdown may be used within API comments for simple formatting tasks such as
italicizing text and creating bulleted lists.

### Coding

For guidelines on writing code, see the [Coding Style Guide](style-guide.html).
