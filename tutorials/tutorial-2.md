% Tutorial, Part 2: Adding Onyx and Layout

## Onyx and Layout

In [Part 1](tutorial.html) of the tutorial, we built a Twitter search application
using just the core Enyo 2 library.  Since that initial installment first
appeared, we've released a set of controls and styles, called "Onyx".  In this
extension of the tutorial, we'll use Onyx to update our application with a nice
look and feel.

## Loading Onyx

Onyx exists outside of the Enyo core, so it has to be loaded with its own
script and link tags.  Because Onyx is normally loaded as a library, we'll add
a reference to that library in our `package.js` file.  Our updated version of
`package.js` looks like this:

    enyo.depends(
      "$lib/onyx",
      "Tweet.js",
      "TwitterSearchApp.js"
    );

At the moment, Onyx is closely synced with Enyo, so we'll update the links in
the `<head>` section of `app.html` to pull in version 2.1 from the Enyo Web
site:

    <head>
      <title>My Twitter Search</title>
	    <link rel="stylesheet" href="http://enyojs.com/enyo-2.1/enyo.css">
	    <script src="http://enyojs.com/enyo-2.1/enyo.js"></script>
	    <script src="package.js"></script>
    </head>

## Updating the Application

In order for Onyx styles to work correctly, you need to apply the "onyx"
class to your application object.  You can do this by adding

    classes: "onyx"

to your application kind definition, so that `TwitterSearchApp.js` begins with
the following:

    enyo.kind({
      name: "TwitterSearchApp",
      kind: enyo.Control,
      classes: "onyx",

      ...

    });

(Note: If you're already using other classes, just add "onyx" to the end of the
list.)

Now, the existing `TwitterSearchApp` kind has a `components` block that looks
like this:

    components: [
        { tag: "input", name: "searchTerm" },
        { tag: "button", content: "Search", ontap: "search" },
        { tag: "div", name: "tweetList" }
      ],

The button and input field are raw HTML controls.  To convert these to their
Onyx equivalents, replace the `tag` attributes of the input and button with
the corresponding Onyx kind names:

    components: [
        { kind: "onyx.Input", name: "searchTerm" },
        { kind: "onyx.Button", content: "Search", ontap: "search" },
        { tag: "div", name: "tweetList" }
      ],

## Adding Features Using Onyx Controls

At this point, one of the first things we notice is that there's no prompting
to indicate what the search box is for.  Since
[onyx.Input](http://enyojs.com/api/#onyx.Input) is derived from
[enyo.Input](http://enyojs.com/api/#enyo.Input), we can use the `placeholder`
property to provide text that will be displayed (with grayed-out styling) when
the user hasn't entered anything in the search box:

    { kind: "onyx.Input", name: "searchTerm", placeholder: "Search on Twitter" },

Better still, we can use the `placeholder` property in conjunction with a styled
search widget ([onyx.InputDecorator](http://enyojs.com/api/#onyx.InputDecorator))
that already exists in the "OnyxSampler" app.  We'll borrow that code, while
making a few modifications:

    components: [
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", name: "searchTerm", 
          placeholder: "Search on Twitter", onkeydown: "searchOnEnter"},
        {kind: "Image", src: "search-input-search.png", ontap: "search"}
      ]},
      { tag: "div", name: "tweetList" }
    ],
    
    ...

    searchOnEnter: function(inSender, inEvent) {
      if (inEvent.keyCode === 13) {
        this.search();
        return true;
      }
    },

The `InputDecorator` kind combines an `onyx.Input` object with other controls
in a single frame.  For the magnifying glass icon (`search-input-search.png`),
we 'll just make a local copy of the file from "OnyxSampler".

Notice that we've hooked up our `search` method to respond to both taps on the
icon and presses of the `Enter` key in the search field.  We detect the latter
by intercepting the `onkeydown` event and looking for a `keyCode` value equal to
13.  If there's a match, we return `true` to stop the `keydown` event from going
any further.

## Lonely at the Top

The search box looks lonely at the top of the page, so let's give it a
border to make it pop.  Onyx provides several nice grouping options.  In this
case, we'll use the [onyx.Toolbar](http://enyojs.com/api/#onyx.Toolbar) kind to
highlight the name of the application, while providing a pleasing amount of
space between the app name and search box.

Our input controls become components within the `onyx.Toolbar` control, making
our application kind's `components` block look like this:

    components: [
      {kind: "onyx.Toolbar", components: [
          {content: "Twitter Search", style: "padding-right: 30px"},
          {kind: "onyx.InputDecorator", components: [
            {kind: "onyx.Input", name: "searchTerm", 
              placeholder: "Search on Twitter", onkeydown: "searchOnEnter"},
            {kind: "Image", src: "search-input-search.png", ontap: "search"}
          ]}
        ]},
      { tag: "div", name: "tweetList" }
    ],

## Fixing the Toolbar

We've made good progress on our app, but in its current state, it still has
one big flaw--if we get more results than will fit on a screen, scrolling down
to see more tweets will cause the toolbar to be obscured.  We'll fix this by
using the layout/fittable library.

To pull the library into our app, we'll add "$lib/layout/fittable" to our
`package.js` file:

    enyo.depends(
      "$lib/onyx",
      "$lib/layout/fittable",
      "Tweet.js",
      "TwitterSearchApp.js"
    );

(The `layout` folder is meant to hold a collection of different layout
libraries; the first one that we've published is "fittable".)

The idea behind the fittable layout is that you have a set of rows or columns,
with most of the items having a natural size, but one item expanding to fill the
remaining space.  The one that grows is labeled with the attribute `fit: true`.

To use the fittable layout, we can change the base kind of `TwitterSearchApp`
from "[enyo.Control](http://enyojs.com/api/#enyo.Control)" to
"[enyo.FittableRows](http://enyojs.com/api/#enyo.FittableRows)"...

    enyo.kind({
      name: "TwitterSearchApp",
      kind: enyo.FittableRows,
      classes: "onyx",
      
      ...
      
    });

...or we can add the attribute `layoutKind: "FittableRowsLayout"`, while leaving
the base kind as `enyo.Control`:

    enyo.kind({
      name: "TwitterSearchApp",
      kind: enyo.Control,
      layoutKind: "FittableRowsLayout",
      classes: "onyx",
      
      ...
      
    });

(For Enyo controls, the `layoutKind` property provides a way to add layout
behavior in a pluggable fashion.  Behind the scenes, the
[enyo.FittableRowsLayout](http://enyojs.com/api/#enyo.FittableRowsLayout) kind
works by measuring the natural size of all of its child objects, then adjusting
the size of the "fit" object to use up the remaining space.)

Then we'll wrap the tweetList in an
[enyo.Scroller](http://enyojs.com/api/#enyo.Scroller) and set `fit: true` on the
scroller to mark it as the layout element that expands:

    { kind: "enyo.Scroller", fit: true, components: [
      { tag: "div", name: "tweetList" }
    ]}

This will let the user scroll through the full list of tweets using a scrollbar
or touch, depending on the device.

In order for the fitting action to work, the `enyo.FittableRows` control needs
to occupy a set amount of space.  This works for applications because when
the control is rendered into the `<body>` tag, Enyo automatically applies an
`enyo-document-fit` class to the body and `enyo-fit` and `enyo-stretch`
classes to the application div that's inserted into the body.  If you're using
the fittable layout for an item inside your application, you'll need to
either define explicit width and height for the control or have it be sized by a
parent fittable control.  (A common mistake is to have an `enyo.FittableRows`
or [enyo.FittableColumns](http://enyojs.com/api/#enyo.FittableColumns) control
as a child of your application kind with its `fit: true` control sized at 0
pixels.)

## Until Next Time

You can view the updated tutorial application online at
<http://enyojs.com/tutorial/onyx/search.html>.  Compare it to the
[original version](http://enyojs.com/tutorial/search.html) and you'll
see how good controls and styles can make an app both more functional
and more enjoyable to use.

**Additional Reading**

* [Creating Components](../key-concepts/creating-components.html)
* [Creating Controls](../key-concepts/creating-controls.html)
* [Creating Kinds](../key-concepts/creating-kinds.html)