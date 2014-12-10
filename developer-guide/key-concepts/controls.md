% Controls

## enyo.Control

[enyo.Control]($api/#/kind/enyo.Control) is a component that controls a DOM node
(i.e., an element in the user interface).  Controls are generally visible and
the user often interacts with them directly.  Things like buttons and input
boxes are obviously controls, but in Enyo a control may become as complex as an
entire application.

## The Basics

In the following example, we define a `Circle` control, which we will put to use
inside a `TrafficLight` control:

```javascript
    enyo.kind({
        name: "Circle",
        kind: "Control",
        published: {
            color: "magenta",
            bgColor: "black"
        },
        handlers: {
            ondown: "downHandler",
            onup: "upHandler"
        },
        content: "Hi",
        style: "padding: 2px 6px; border: 3px solid; border-radius: 20px; cursor: pointer;",
        create: function() {
            this.inherited(arguments);
            this.colorChanged();
        },
        colorChanged: function() {
            this.applyStyle("border-color", this.color);
        },
        bgColorChanged: function() {
            this.applyStyle("background-color", this.bgColor);
        },
        downHandler: function(inSender, inEvent) {
            this.applyStyle("background-color", "white");
        },
        upHandler: function(inSender, inEvent) {
            this.applyStyle("background-color", "black");
        }
    });
```

The `Circle` has a `kind` value of `"Control"` and therefore inherits and
extends the behavior of `enyo.Control`.  Since a control is a component (i.e.,
`enyo.Control` extends [enyo.Component]($api/#/kind/enyo.Component)), it can
publish properties, as is done here.

## Manipulating a Control's DOM Node

A control exposes functionality to manipulate its DOM node.  Notice the use of
`content` and `style` in the `Circle` object.  The `content` property sets the
HTML that the control will render.  Since the `Control` object publishes the
`content` property, you may access the content by calling `set()` and `get()`.
The `style` property specifies CSS styles that the control will use to decorate
its node.  You may also specify classes, attributes, or even a tag type.  For
example:

```javascript
    {tag: "input", classes: "rounded", attributes: {value: "foo"}}
```

These properties may be set either on control configuration blocks or in kind
definitions.

There are also methods available to modify these properties; for example,
`applyStyle()` sets a specific style property to a given value.  There are many
other such methods, including `addStyles()`, `addClass()`, `setAttribute()`,
`show()`, `hide()`, and `render()`.  See the API documentation for more info.

## Controls in Controls

Here is our aforementioned `TrafficLight` control:

```javascript
    enyo.kind({
        name: "TrafficLight",
        kind: "Control",
        style: "position: absolute; padding: 4px; border: 1px solid black; background-color: silver;",
        components: [
            {kind: "Circle", color: "red", ontap: "circleTap"},
            {kind: "Circle", color: "yellow", ontap: "circleTap"},
            {kind: "Circle", color: "green", ontap: "circleTap"}
        ],
        circleTap: function(inSender, inEvent) {
            var lights = {red: "tomato", yellow: "#FFFF80", green: "lightgreen"};
            if (this.lastCircle) {
                this.lastCircle.set("bgColor", "black");
            }
            this.lastCircle = inSender;
            this.lastCircle.set("bgColor", lights[inSender.color]);
        }
    });
```

![_TrafficLight control_](../assets/traffic-light.png)

Because they are components, controls may contain other controls.  A control
will render any controls contained inside itself.  Thus, a `TrafficLight` will
render with three `Circle` instances inside it and, if our styling is correct,
will look like an actual traffic light.  Note that if the control contains other
controls and also specifies a value for `content`, it will render the child
controls and ignore the value of `content`.

## Controls and Events

Enyo controls can handle common DOM events.  In a component configuration block,
specify the handler for a DOM event just as you would for any other Enyo
event--with a named delegate.  The `TrafficLight` kind does this for its circle
controls by setting `ontap: "circleTap"`.  Since `TrafficLight` owns its
circles, it will process their events; thus, `circleTap` should be the name of a
handler method inside `TrafficLight`.

Now, the `ontap` event is not a DOM event per se; it actually belongs to a set
of cross-platform events that behave like DOM events and so are referred to as
"DOM-like".  Enyo normalizes these events across different platforms so that
users may write a single set of event handlers for applications that run on both
mobile and desktop platforms.

Notice that the `Circle` kind handles some events itself.  It reacts when the
user presses down and then releases.  DOM (and DOM-like) events that a kind
should handle are specified in the `handlers` block.  The `Circle` kind
specifies handlers for the `down` and `up` events.  These handlers are string
delegate names of methods in the `Circle` kind that will handle the events.
Again, strictly speaking, the `down` and `up` events are not DOM events, but are
DOM-like.

As with all events, the first argument sent to the event handler is the
`inSender` object, the Enyo control that generated the event.  DOM and DOM-like
events pass the event object as the second argument.

Since DOM and DOM-like events bubble up through the DOM, they may be handled by
any control in the control hierarchy.  For example, a user of `TrafficLight`
could implement an `ontap` event handler and receive taps on the circles inside
the TrafficLight. 

## Lifecycle Methods: hasNode() and rendered()

Since `enyo.Control` is a kind of Component, it inherits the `create()` and
`destroy()` methods that we saw in [Components](components.html), as well as the
`constructor()` method that we saw in [Kinds](kinds.html).  It also introduces a
few additional methods for managing its representation in the DOM. 

`Control` is designed so that most of its methods and properties can be used
without regard to whether there is a corresponding DOM node or not.  For
example, you may call

```javascript
    this.$.control.applyStyle("color", "blue");
```

If the control is rendered, that style is placed in the DOM; if not, the
information is stored until the DOM is created.  Either way, when you see it,
the text will be blue.

Now, there are certain things you cannot do unless DOM has been created.
Obviously, you cannot do work directly on a DOM node if there is no DOM.  Also,
some methods (e.g., `getBounds()`) return values measured from DOM, so if there
is no DOM, you won't get accurate values.

In a control, if you need to perform an action immediately after the DOM is
created, you can do it in the `rendered()` method:

```javascript
    rendered: function() {
        // important! must call the inherited method
        this.inherited(arguments);
        // this is the first moment that bounds are available
        this.firstBounds = this.getBounds();
    }
```

An important thing to note here is that even though DOM elements have been
created when `rendered()` is called, the visual representation of these elements
in the browser is generally not visible yet.  Most browsers will not update the
display until Enyo yields the JavaScript thread.  This means you have the
ability to make changes to the DOM in `rendered()` without causing annoying
visual artifacts.

Whenever you need to access a control's DOM node directly, use the `hasNode()`
method:

```javascript
    twiddle: function() {
        if (this.hasNode()) {
            buffNode(this.node); // buffNode is made-up
        }
    }
```

Remember that even if DOM is rendered, `this.node` may not have a value.  A
truthy result from `hasNode()` means `this.node` is initialized.  Even within
`rendered()`, you need to call `hasNode()` before using `this.node`:

```javascript
    rendered: function() {
        this.inherited(arguments); // important! must call the inherited method
        if (this.hasNode()) {
            buffNode(this.node);
        }
    });
```

## When Controls Are Rendered

In general, controls are not rendered until you you explicitly say so.  Most
applications have a `renderInto()` or `write()` call at the very top that
renders the controls in the application.

Also, when creating controls dynamically, Enyo will not render those controls
until you call `render()` on them, or on one of their containers.  You will
often see code like the following:

```javascript
    updateControls: function() {
        // destroy controls we made last time 
        // ('destroyClientControls' destroys only dynamic controls;
        // 'destroyControls' destroys everything)
        this.destroyClientControls(); 
        // create new controls
        for (var i=0; i<this.count; i++) {
            // created but not rendered
            this.createComponent({kind: "myCoolControl", index: i});
        }
        // render everything in one shot
        this.render();
    });
```

Destroying a control will cause it to be removed from the DOM right away, as
this is a necessary part of the cleanup process.  There is no `unrender()`
method.

**Additional Reading**

* [Event Handling](event-handling.html)
* [Kinds](kinds.html)
* [Components](components.html)
