% Enyo MVC: An Introduction

**In this doc:**

* Welcome
* Background
    * Enyo's Component Model
    * MVC
* MVC in Enyo
    * Design Goals
    * Overview
    * Bindings
    * Controllers
    * Models and Collections
    * Bootplate MVC
* Getting Started
    * Documentation
    * Feedback and Discussion

## Welcome

Welcome to Enyo MVC.  This document provides an overview of what we've built,
why we've built it, where things stand, and how you can help us move things
forward.

For the impatient, the following page describes how to get up and running:

https://github.com/enyojs/enyo/wiki/Enyo-MVC-Preview

## Background

[Separation of concerns](http://en.wikipedia.org/wiki/Separation_of_concerns) 
is a fundamental principle of good software design.  Generally speaking, you'll
write better and more manageable code if you break your project up into discrete
modules with well-defined purpose and scope, and strive to minimize redundancy
and dependencies between modules.

### Enyo's Component Model

If you've spent much time with Enyo, you've probably noticed that we talk a lot
about modularity and encapsulation.  Enyo promotes separation of concerns by
helping you factor your application into components.  Each component
encapsulates a subset of your app's functionality and exposes it to other
components via a public API (a set of properties, methods, and events).

For example, you might implement a specific part of your app's UI by defining an
`enyo.Control` (a kind of component).  This control would be responsible for
"composing" itself out of simpler components, rendering itself into the DOM,
capturing user input events, interacting with its parent and child components
using their APIs, and cleaning up after itself when its work is done.

Experience has shown us that apps made from thoughtfully-designed components are
easy to test and easy to modify to meet changing needs.  In addition, they often
yield building blocks that can be reused in other projects or shared with other
developers.

There's more than one way to separate concerns, though.  While Enyo has
always made it easy to organize your app along functional lines, historically,
it hasn't done anything to help you isolate app data and business logic from
presentation.  It's actually fairly common for a single Enyo component to
compose a view, handle input, manipulate data and update application state.

### MVC

What if you want to keep these different aspects separate?  That's where MVC
comes in.  MVC (Model-View-Controller) is a well-established pattern for
separating an app into distinct, loosely-coupled layers.  While frameworks vary
in their specific interpretations of MVC, the basic concepts are essentially the
same:

* **Models** define the types of data an app deals with and the rules/logic for
    manipulating that data. They are also responsible for interacting with the
    databases or other services that house the data.

* **Views** are responsible for presenting data to the user and providing ways
    to act on that data.

* **Controllers** mediate between models and views, manipulating models in
    response to user actions and updating views when models change.

MVC-style separation of concerns comes with its own set of benefits.  Perhaps
even more so than the component model, MVC enhances testability--models and
controllers readily lend themselves to automated testing, since they're
decoupled from UI.

MVC also makes it easier to have specialized roles within your team, with
different developers focusing on different layers.  In principle, MVC even makes
it possible to replace one layer entirely, with minimal impact on the other
layers.  You might reimplement your models to support a different backend
datastore, for example, or build an entirely new set of views to support a
radically different type of device.

## MVC in Enyo

Not surprisingly, MVC support has been one of our top feature requests since
Enyo 2 debuted last year.  Over the last few months, we've done a lot of
thinking about how MVC might best be expressed in an Enyo context.

We considered a number of possibilities, including doing nothing--after all,
we've seen developers employ MVC in Enyo apps without any help from us, often by
loosely coupling Enyo with Backbone.js.

Ultimately, though, we decided that there was much to be gained from adding
first-class MVC support to Enyo.

### Design Goals

Having decided to work on MVC, we identified the following design goals:

* **Make MVC in Enyo 100% optional.**  MVC is great, but it's not necessarily
    for every developer, or for every project.  Existing Enyo apps need to
    function exactly as before, and developers should be free to adopt MVC or
    not, as their tastes and needs dictate.

* **Maximize the benefits of both MVC and Enyo's component model.**  Most
    JavaScript MVC frameworks rely on some form of simple HTML template system
    for generating views.  However, much of Enyo's value comes from the way it
    moves beyond standard HTML elements to reusable, higher-level components
    that work together seamlessly and encapsulate best practices in structure,
    styling, behavior, and performance.  Our solution aims to deliver MVC's
    benefits without sacrificing the goodness of Enyo components.

* **Don't reinvent the wheel.**  Others have done good work on MVC, and we
    should leverage this work where we can--especially in areas of minimal
    overlap with existing Enyo functionality.

* **Offer a well-lit path, but be flexible.**  For developers who want an
    out-of-the-box MVC solution, we should provide an easy-to-use Enyo MVC app
    template.  But we should also make sure that the pieces of our MVC
    implementation are useful on their own and in various combinations, enabling
    developers to mix and match.

### Overview

Keeping these design goals in mind, we experimented with (and vigorously
debated) a variety of approaches.  In the end, we came up with a design that we
like a lot--one that enables MVC-based development while preserving the nature
and the unique strengths of Enyo.

In a nutshell, when you develop an Enyo app in the MVC pattern:

* You'll implement your model layer using two new Enyo kinds, `enyo.Model` and
    `enyo.Collection`.  These kinds derive directly from the Backbone.js classes
    of the same names.

* You'll build views that derive from `enyo.Control`.  As in "traditional" Enyo
    development, you'll compose views from widgets and subviews using the
    declarative `components` block.

* You'll use bindings to update your views automatically when underlying models
    and collections change.

* Events will travel up and down the component tree as always, but rather than
    handle them directly in your views, you'll generally delegate them to
    controllers.  

* You'll build controllers that derive from the new `enyo.Controller` kind.
    Controllers serve a variety of purposes; you might pair one with a view to
    handle all of the view's events, or you might instantiate a "global"
    controller to share data or services between different parts of your app.

We've built our MVC implementation directly in the Enyo core, primarily in the
`kernel` module.  We've also created an MVC-specific version of our Bootplate
app template to help get you started.

More detail is provided in the sections that follow.

### Bindings

The goal of bindings is to greatly simplify the plumbing needed to keep views in
sync with their underlying data, whether in the view's published properties,
properties on models and collections proxied via controllers, or even properties
of two components within a single view.

Starting in Enyo 2.2, bindings are a first-class feature of the Enyo core,
implemented in `enyo.Object`.  With bindings, any two properties of any two
instances of `enyo.Object` (or its subkinds) may be bound either
unidirectionally or bidirectionally, such that when the value of the source
property changes, the target property is automatically updated with the new
value.

Bindings may be managed directly via a low-level API, but more typically you'll
set up bindings within the definition of an `enyo.Component`, using the new
declarative `bindings` block.

### Controllers

In traditional Enyo development, instances of `enyo.Control` generally implement
their own event handlers and associated logic.  To support the MVC pattern,
instances and subkinds of `enyo.Control` now have the option to delegate their
events to controllers.

After defining the models and collections, Enyo controllers may proxy shared
models and collections to multiple views that are kept in sync via bindings.

### Models and Collections

`enyo.Model` and `enyo.Collection` are defined in the `data` submodule under
`kernel`.  They provide a simple API for loading remote data, observing changes,
providing validations, and so on.

We have also provided collection-aware Repeater and List controls, which
allow you to bind list template properties to model properties of a collection.
The repeater or list will monitor the underlying collection (or any models
contained within), re-rendering itself automatically if changes are detected.

### Bootplate MVC

Finally, we are releasing a new "Bootplate MVC" app template to complement the
existing "Bootplate".  The new template (found in the `bootplate-mvc` repo on
GitHub) is a ready-made generic Enyo app using MVC; it conveniently brings
together all the pieces you need to start developing your own MVC application.

## Getting Started

### Documentation

We're still working on a full set of documentation and samples.  For now:

* This document provides a top-down conceptual overview.

* Exploring the Bootplate MVC app is the best way to get a concrete picture of
    how MVC in Enyo works.  Not only does it illustrate how an MVC app should be
    structured, but it also provides an interactive "playground" you can use to
    see MVC features in action.

### Feedback and Discussion

Please use the enyo-dev Google Group for feedback and discussion:

https://groups.google.com/forum/#!forum/enyo-development
