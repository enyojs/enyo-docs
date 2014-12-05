% Enyo: A Brief Tour

Thanks for checking out Enyo!  This document will help you familiarize yourself
with how the framework is organized and what each piece offers.

In a given Enyo release, you will find the following folders:

* **enyo** - The core
* **lib** - Where all plugins and add-on libraries live
* **moonstone** - A toolbox of UI components, optimized for TV
* **onyx** - Enyo's original UI library, optimized for mobile devices
* **spotlight** - A specialized library for handling focus state
* **layout** - A set of layout components
* **enyo-ilib** - A library providing localization services
* **canvas** - Components for building HTML5-based canvas views
* **extra** - Additional utility components

## Enyo

The core of the framework, known simply as `enyo` in the source code, provides
powerful features that enable complex applications and add-on libraries that
build on the Web stack in a modular way:

* **Object encapsulation, inheritance, and ownership hierarchy** - Kinds and Components
* **View and DOM widget model** - UiComponent and Control
* **Event routing** - Dispatcher and Signals
* **Services model** - Async and Ajax
* **Data Modeling and Data Binding** - Model, Collection, Binding, and more
* **Basic HTML components** - Base UI
* **Touch support** - Touch scroller and gesture simulation
* **Package loader** - `enyo.depends()` and `package.js`

These pieces are actually separable (it's easy to make micro-builds of Enyo),
but we believe they form a useful working set, so we provide them together as
the Enyo core.

Everything else described below is an optional package built on top of the core.
You may choose to include these *&agrave; la carte* to fit your application's
needs.  However, these are only reference libraries for what we envision will be
a large ecosystem of add-on libraries that bring different look and feel, layout
options, service wrappers, etc.  Check out the [Enyo Community
Gallery](http://enyojs.com/gallery) to see just how easy it is to create and
share new components and add-on libraries.

## Moonstone

The Moonstone library provides a toolbox of beautifully-styled UI components for
building applications.  Specially designed and optimized for TV-based apps,
Moonstone is ever-expanding, and currently includes the following:

* **Buttons** (plain, icon, radio, and toggle buttons)
* **Inputs** (text input field, text area, rich text area)
* **Lists**
* **Popups**
* **Header bars**
* **Group boxes**
* **Progress bars**
* **Sliders**

## Onyx

Onyx, the original UI library that shipped with the Enyo framework, remains the
library of choice for mobile device apps.  While Moonstone has generated most of
the publicity recently, new Onyx development is also in the works.  We encourage
you to check out the [Onyx source](https://github.com/enyojs/onyx), and stay
tuned.

## Spotlight

The Spotlight library manages focus state, enabling users to navigate through
Enyo applications in either 5-way mode (using the directional arrow and Return
keys on a keyboard, or the corresponding buttons on a traditional television
remote control) or pointer mode (using a mouse or touchscreen).

## Layout

While Enyo components may be laid out using pure HTML/CSS techniques, we have
provided a Layout library that gives you easy-to-use, performant, cross-browser
compatible containers for your common layout needs:

* **Fittable Rows and Columns**
* **Lists**
* **Panels**

You can read up on these layout options [here](https://github.com/enyojs/layout).

## enyo-ilib

The `enyo-ilib` library provides localization support for the Enyo framework.
The heavy lifting is done by the open-source `iLib` library; `enyo-ilib` is
essentially a compatibility layer, making it easy for Enyo app developers to
access the powerful features of `iLib` without having to deal with messy,
locale-specific details.

## Canvas

Enyo's encapsulation model works equally well for structuring canvas-based
components as it does for traditional UI, and we have provided a library that
abstracts common canvas primitives as Enyo components:

* **Canvas and CanvasControl**
* **Shapes** (Circle, Rectangle)
* **Text**
* **Image**

You can easily extend these to create complex graphical applications and games,
such as our [Pirate Pig](http://enyojs.com/samples/piratepig) canvas demo app.

## Extra

The "extra" library holds a number of useful utility-type components, which are
used in various samples and demo applications.

## Bootplate

The [Bootplate](bootplate.html) templates provide complete starter projects
containing everything you need to develop and deploy Enyo apps out of the box.
These templates contain current versions of Enyo, along with the most common
libraries used by app developers (Moonstone or Onyx, Layout, etc.) and scripts
to minify and create deployable versions of the source and assets.

## Additional Reading

From here, there are several paths you can take to ramp up as an Enyo developer.
A few suggestions:

* For a step-by-step introduction to Enyo, head to the [Moonstone App
    Tutorial](moonstone-app-tutorial.html).
* To get off to the races writing Enyo apps, check out [Bootplate](bootplate.html).
* To learn more about the nuts and bolts of Enyo app structure, read [Planning
    and Structuring Your App](planning-and-structuring-your-app.html).
* Can't make up your mind?  See the [complete list](../index.html) of available
    documentation.
