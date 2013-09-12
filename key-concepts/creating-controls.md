% Creating Controls

## enyo.Control

[enyo.Control](../api.html#enyo.Control) is a component that controls
a DOM node (i.e., an element in the user interface).  Controls are generally
visible and the user often interacts with them directly.  Things like buttons
and input boxes are obviously controls, but in Enyo a control may become as
complex as an entire application.

## The Basics

In the following example, we define a `Circle` control, which we will put to use
inside a `TrafficLight` control:

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

The `Circle` has a `kind` value of `"Control"` and therefore inherits and
extends the behavior of `enyo.Control`.  Since a control is a component (i.e.,
`enyo.Control` extends [enyo.Component](../api.html#enyo.Component)),
it can publish properties, as is done here.

## Manipulating a Control's DOM Node

A control exposes functionality to manipulate its DOM node.  Notice the use of
`content` and `style` in the `Circle` object.  The `content` property sets the
HTML that the control will render.  Since the `Control` object publishes the
`content` property, you may access the content by calling `set()` and `get()`.
The `style` property specifies CSS styles that the control will use to decorate
its node.  You may also specify classes, attributes, or even a tag type.  For
example:

        {tag: "input", classes: "rounded", attributes: {value: "foo"}}

These properties may be set either on control configuration blocks or in kind
definitions.

There are also methods available to modify these properties; for example,
`applyStyle()` sets a specific style property to a given value.  There are many
other such methods, including `addStyles()`, `addClass()`, `setAttribute()`,
`show()`, `hide()`, and `render()`.  See the API documentation for more info.

## Controls in Controls: It's Those Turtles Again

Here is our aforementioned `TrafficLight` control:

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
                    this.lastCircle.setBgColor("black");
                }
                this.lastCircle = inSender;
                this.lastCircle.setBgColor(lights[inSender.color]);
            }
        });

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

**Additional Reading**

* [Event Handling](event-handling.html)
* [User Input](../building-apps/user-input.html)
* [Creating Kinds](creating-kinds.html)
* [Object Lifecycle](object-lifecycle.html)