% Spotlight

1. [What Is Spotlight?](#1)
2. [Modes](#2)
3. [Navigation](#3)
4. [Containers](#4)
5. [Nesting](#5)
6. [Events](#6)
	1. [List of Spotlight Events](#6.1)
	2. [Preventing/Allowing Default DOM Events](#6.2)
	3. [Sequence of Spotlight Events](#6.3)
	4. [Accelerated keydown Events](#6.4)
	5. [Scroll Events](#6.5)
	6. [Customizing Response to 5-way Events](#6.6)
7. [Extending Spotlight](#7)
	1. [Extending Controls](#7.1)
8. [Control Parameters](#8)

<a name="1"></a>

## What Is Spotlight?

Spotlight is an extensible utility that enables users to navigate Enyo
applications using a keyboard or television remote control.  Responding to input
from the **UP**, **DOWN**, **LEFT**, **RIGHT**, and **RETURN** keys, Spotlight
provides a navigation experience that compares favorably to that of a
computer-with-mouse.

In addition, Spotlight includes support for point-and-click events, so all bases
are covered.

To add Spotlight to an application, simply require `spotlight` in one of your
source files:

```javascript
    var Spotlight = require('spotlight');
```

<a name="2"></a>

## Modes

Spotlight operates in two mutually exclusive modes: **5-way mode** and **Pointer
mode**.  By default, Spotlight is configured to switch between these modes
whenever suitable input is received--i.e., it switches to pointer mode on
`mousemove` and back to 5-way mode on `keydown`.

The Spotlight API also provides a way to make the switch explicitly:

```javascript
    Spotlight.setPointerMode(<Boolean>);
```

<a name="3"></a>

## Navigation

Spotlight enables navigation between Enyo controls by assigning focus to one
control at a time.  When a control is focused, it takes on the CSS class
`.spotlight`, which allows focused controls to be styled on a per-kind basis
using `.<kindClass>.spotlight` selectors.

In order to make a control focusable (or "spottable") with Spotlight, simply
set its `spotlight` property to `true`, like so:

```javascript
    {name: 'mybutton', tag: 'button', spotlight: true}
```

When the application loads, Spotlight searches for a control with the name
specified in its `defaultControl` property; if `defaultControl` is not
specified, Spotlight assigns focus to the first available spottable control.

In 5-way mode, Spotlight uses the [Nearest Neighbor
Algorithm](https://github.com/enyojs/spotlight/blob/master/enyo.Spotlight.NearestNeighbor.js)
to determine which spottable control is the nearest one in the direction of
navigation.  The coordinates of a spottable control are derived from its actual
position on the screen.

It's worth noting that spottable controls may be found on different hierarchical
levels of an Enyo component tree.  Spotlight facilitates seamless navigation
among the topmost spottable components found in the tree.

For a demonstration of the Nearest Neighbor algorithm's behavior, see
"ContainerSample" in the [Enyo sampler](https://enyojs.com/sampler/latest/index.html?Spotlight&ContainerSample).

<a name="4"></a>

## Containers

In order to organize controls into navigation groups, we have created Spotlight
containers. 

A good example of how containers should be used is a set of radio buttons that
must be navigable separately from the rest of the app's controls.

When a Spotlight container is focused, it passes the focus to its own hierarchy
of spottable child controls--specifically, to the last spottable child to hold
focus before the focus moved outside of the container.  If the container in
question has never been focused, it passes focus to its first spottable child.

To define a container, set a control's `spotlight` property to `"container"`:

```javascript
    {
        name: 'mycontainer',
        spotlight: 'container',
        components: [<A list of controls with `spotlight:true`>]
    }
```

In a way, containers may be thought of as the branches--and spottable controls
as the leaves--of the Spotlight navigation tree.

For a demonstration of container behavior, see "ContainerSample" in the
[Enyo sampler](https://enyojs.com/sampler/latest/index.html?Spotlight&ContainerSample).

<a name="5"></a>

## Nesting

Spotlight containers may be nested.  The inner containers may be remembered as
"last focused children" of the outer ones, thus acting as conduits of focus
passed by the outer containers.

We have not found it useful to nest spottable controls.  For now, these controls
act as the leaves of the spottable tree and do not conduct focus; however, this
behavior may be overridden on a per-control basis.

<a name="6"></a>

## Events

All Spotlight events are dispatched directly to the currently spotted control,
which may prevent bubbling to define custom behavior. (See [Extending
Spotlight](#7) below.)

If Spotlight events are allowed to bubble to the application level, the app
responds to them with default behavior.

<br />

<a name="6.1"></a>

### List of Spotlight Events

The following events are dispatched by the main Spotlight module:

* `onSpotlightKeyDown`: Dispatched in response to `keydown`

* `onSpotlightKeyUp`: Dispatched in response to `keyup`

* `onSpotlightLeft`: Dispatched in response to `onSpotlightKeyDown` event's
    bubbling to app level with keyCode 37

* `onSpotlightRight`: Dispatched in response to `onSpotlightKeyDown` event's
    bubbling to app level with keyCode 39

* `onSpotlightUp`: Dispatched in response to `onSpotlightKeyDown` event's
    bubbling to app level with keyCode 38

* `onSpotlightDown`: Dispatched in response to `onSpotlightKeyDown` event's
    bubbling to app level with keyCode 40

* `onSpotlightSelect`: Dispatched in response to `onSpotlightKeyDown` event's
    bubbling to app level with keyCode 13

* `onSpotlightFocus`: Dispatched when focus is transferred to a new control
    in response to one of the 5-way events (`onSpotlightLeft`,
    `onSpotlightRight`, `onSpotlightUp`, `onSpotlightDown`, or
    `onSpotlightSelect`).

* `onSpotlightBlur`: Dispatched when focus is transferred away from a control

* `onSpotlightFocused`: Dispatched in response to `onSpotlightFocus` event's
    bubbling to app level right after its originator is set as current

* `onSpotlightScrollUp`: Dispatched when `mousewheel` event delta exceeds
    `Spotlight.Scrolling.frequency` (Default: 40)

* `onSpotlightScrollDown`: Dispatched when `mousewheel` negative event delta
    exceeds `-Spotlight.Scrolling.frequency` (Default: 40)

<br />     

<a name="6.2"></a>

### Preventing or Allowing Default DOM Events

By default, if a `keydown` event carries a 5-way keyCode (13, 37, 38, 39 or 40),
it will be prevented from bubbling and triggering default browser behavior.
This is done to disable default browser scrolling, because in the presence of
Spotlight, scrolling is handled using components such as Scroller.

Of course, there are some cases where you may want to allow the default browser
behavior.  For example, in text inputs, you may want to allow the cursor to move
to the next character when the right arrow key is pressed, without any
interference from JavaScript. 

For such cases, we have included an "Allow DOM Default" feature.  The events
`onSpotlightKeyDown`, `onSpotlightLeft`, `onSpotlightRight`, `onSpotlightUp`,
`onSpotlightDown` and `onSpotlightSelect` pass their handlers an event object
with an added `allowDomDefault()` method:

```javascript
    onSpotlightKeyDown: function(sender, event) {
        event.allowDomDefault();
    }
```

In the above handler, if the Spotlight event is allowed to propagate, it will
allow the original DOM `keydown` to trigger default browser behavior. (See
[Figure A](#A)).

<br />

<a name="6.3"></a>

### Sequence of Spotlight Events

<a name="A"></a>

![_Figure A: Spotlight keyboard events_](../assets/chart_spotlight_5way_events.jpg)

[Figure A](#A) illustrates the sequence of events in Spotlight's 5-way mode.  At
each step, the sequence may be modified (bubbling may be prevented) on the level
of the currently focused control.  (See [Extending Spotlight](#7) below.)

For instance, when `onSpotlightKeyDown` is dispatched to the focused control,
the control may choose to prevent it from ever reaching the app level (where it
would be handled by Spotlight) and replace the default behavior with its own
custom handling.

If, however, `onSpotlightKeydown` is allowed to propagate and Spotlight
recognizes its keyCode as one of 5-way key codes, it dispatches an
`onSpotlight<5-Way Direction>` event back to the focused control.  At this
point, the control once again has the option of overriding default behavior.

If `the onSpotlight<5-Way Direction>` event bubbles up to the app level,
Spotlight employs its Nearest Neighbor Algorithm to figure out which spottable
control is closest in the `<5-Way Direction>`.  It then dispatches an
`onSpotlightBlur` event to the current control (which also has the `.spotlight`
CSS class removed) and an `onSpotlightFocus` event to the nearest neighbor
(which has the `.spotlight` CSS class applied).

If `onSpotlightFocus` is allowed to bubble from the newly focused control,
Spotlight sets its originator as `current`, and it officially becomes the
focused control.  In recognition of this fact, Spotlight dispatches an
`onSpotlightFocused` event to the control.

<br />

<a name="6.4"></a>

### Accelerated keydown Events

<a name="B"></a>

![_Figure B: Accelerated keydown sequence_](../assets/chart_spotlight_accelerator_events.jpg)

While a key is depressed, the browser dispatches `keydown` events at equal (or
nearly equal) intervals.

Looking at [Figure B](#B), we can see that not all of these events affect the
application.  The function of the [Spotlight
Accelerator]($api/#/module/spotlight/accelerator)
is to distribute events over time (according to its configuration).

Spotlight Accelerator may be configured via its array property,
`Spotlight.Accelerator.frequency`.  The default configuration is as
follows:

```javascript
    //* Firing configuration. At n-th second use every frequency[n] subsequent keydown event
    frequency : [3, 3, 3, 2, 2, 2, 1], ...
```

This tells the Accelerator to do the following:

* In the first, second, and third seconds after the key is depressed, only let
    through every third `keydown` event.

* In the fourth, fifth, and sixth seconds, allow every second `keydown` event.

* In the seventh second and later, allow every `keydown` event.

This causes Spotlight focus to move across the screen with apparent acceleration
while a 5-way key is depressed.

<br />

<a name="6.5"></a>

### Scroll Events

In response to `mousewheel` events from the browser, Spotlight dispatches
`onSpotlightScrollUp` and `onSpotlightScrollDown`.  Here's how the process
works:

The `mousewheel` event has a `wheelDeltaY` property, which translates to a given
amount of wheel rotation.  [Spotlight
Scrolling]($api/#/module/spotlight/scrolling)
accumulates `wheelDeltaY` values in a given direction of rotation (up or down).

Once the cumulative value exceeds `Spotlight.Scrolling.frequency`, either
`onSpotlightScrollUp` or `onSpotlightScrollDown` is dispatched and the
cumulative value is reset to 0.

In this way, Spotlight scrolling events are made to behave more like repeating
keydown events, which is useful for controls (like pickers and list scrollers)
that don't use smooth scrolling, but instead animate from one item to the next.

Note: In [Pointer Mode](#2), Spotlight treats the first scroll event as the
first keyboard event; in response, Spotlight returns from pointer mode and
re-spots the item that was previously spotted. No scrolling happens on the first
scroll event when returning from pointer mode.

<a name="6.6"></a>

### Customizing Response to 5-way Events

There may be times when the Nearest Neighbor algorithm does not meet your needs.
For example, UI specs for an app may require you to specify where Spotlight
focus should move in response to specific 5-way events.

For such cases, Spotlight offers a set of convenience properties:

* `defaultSpotlightUp`
* `defaultSpotlightDown`
* `defaultSpotlightLeft`
* `defaultSpotlightRight`
* `defaultSpotlightSelect`

Simply add the appropriate property to your control, and if the corresponding
event is allowed to bubble, Spotlight will move focus to the control whose name
is specified in the property's value:

```javascript
    {name: 'control1', spotlight: true, defaultSpotlightRight: 'control2'},
    {name: 'control2', spotlight: true, defaultSpotlightRight: 'control1'}
```

In this example, focus will pass from one control to the other each time the
right arrow button is pressed.

<a name="7"></a>

## Extending Spotlight

<a name="7.1"></a>

### Extending Controls

Extending an Enyo control to use Spotlight functionality does not require
knowledge of anything beyond Enyo's inheritance patterns and the information
presented in this document.

To extend a control to use Spotlight, simply create a subkind of the kind you
want to extend and define event handlers to handle Spotlight events.

Please refer to the [Moonstone](https://github.com/enyojs/moonstone/) package
for examples.

<a name="8"></a>

## Control Parameters

Two optional properties may be set on controls to change the way that Spotlight
interacts with them:

* **spotlightDisabled [boolean]** - When set to `true`, temporarily makes a
    component non-spottable without changing its `spotlight` property.

* **spotlightIgnoredKeys [number | array]** - Specifies a set of keys to be
    ignored by Spotlight when they originate from the component.
