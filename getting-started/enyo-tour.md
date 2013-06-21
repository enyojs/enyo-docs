# Enyo: A Brief Tour

Thanks for checking out Enyo!  This document will help you orient yourself with how the framework is organized and what each piece offers.  From there we encourage you to dig into the tutorials and other documentation and get started!

In a given Enyo release, you will find the following folders:

* **enyo** - the core
* **lib** - where all plugins and add-on libraries go
	* **onyx** - a toolbox of UI components
	* **layout** - a set of layout components
	* **canvas** - components for building HTML5-based canvas views
	* **extra** - additional utility components

## Enyo

The core of the framework, known simply as `enyo` in the source code, provides powerful features that enable complex applications and add-on libraries to be built atop the Web stack in a modular way:

* **Object encapsulation, inheritance, and ownership hierarchy** - Kinds and Components
* **View and DOM widget model** - UiComponent and Control
* **Event routing** - Dispatcher and Signals
* **Services model** - Async and Ajax
* **Basic HTML components** - Base UI
* **Touch support** - Touch scroller and gesture simulation
* **Package loader** - `enyo.depends()` and `package.js`

These pieces are actually separable (it's easy to make micro-builds of Enyo), but we believe they form a useful working set, so we provide them together as the Enyo core.

Everything else described below is an optional package built on top of the core.  You can choose to include these *&agrave; la carte* to fit your application's needs.  However, these are only reference libraries for what we envision will be a large ecosystem of add-on libraries that bring different look and feel, layout options, service wrappers, etc.  Check out the [Enyo Community Gallery](http://enyojs.com/gallery) to see just how easy it is to create and share new components and add-on libraries.

## Onyx

The Onyx library provides a toolbox of beautifully-styled UI components for building mobile and desktop applications.  It is ever-expanding, and currently includes the following:

* **Buttons** (plain, icon, radio, and toggle buttons)
* **Inputs** (text input field, text area, rich text area)
* **Popups**
* **Header bars**
* **Group boxes**
* **Progress bars**
* **Sliders**

Take a look at [Onyx Sampler](http://enyojs.com/samples/onyxsampler) to see the Onyx widget set in action.

## Layout

While Enyo components can be laid out using pure HTML/CSS techniques, we have provided a Layout library that gives you easy-to-use, performant, cross-browser compatible containers for your common layout needs:

* **Fittable Rows and Columns**
* **Lists**
* **Panels**

You can read up on these layout options [here](https://github.com/enyojs/layout).


## Canvas

Enyo's encapsulation model works equally well for structuring canvas-based components as it does for traditional UI, and we have provided a library that abstracts common canvas primitives as Enyo components:

* **Canvas and CanvasControl**
* **Shapes** (Circle, Rectangle)
* **Text**
* **Image**

You can easily extend these to create complex graphical applications and games, such as our [Pirate Pig](http://enyojs.com/samples/piratepig) canvas demo application.

## Extra

The "extra" library holds a number of useful utility-type components, which are used in various samples and demo applications.


## Bootplate

Bootplate is a template that provides a complete starter project containing
everything you need to develop and deploy Enyo apps out of the box, and is now
included in each release.  It contains current versions of Enyo and the most
common libraries for app developers (Onyx and Layout), as well as scripts to
minify and create deployable versions of the source and assets.  Get started
with Bootplate [here](bootplate.html).


# Learn More

From here, there are a number of guides you can continue reading to help ramp up into Enyo development:

* If you'd like a step-by-step introduction to Enyo, head to the [tutorials](../tutorials/tutorial.html).
* To get off to the races writing Enyo apps, check out [Bootplate](bootplate.html).
* To learn more about the nuts and bolts of Enyo app structure, read the [Getting Started](getting-started.html) guide.
* For the complete list of documentation, see the [Enyo documentation](../index.html) overview.
