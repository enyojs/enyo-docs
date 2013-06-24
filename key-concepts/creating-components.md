# Creating Components

The Component object, [enyo.Component](http://enyojs.com/api/#enyo.Component),
is the basic building block of Enyo.  Components encapsulate rich behavior and
may be used together as modules to create complex applications.  When coding an
Enyo application, you'll create many of your own component and control kinds.
Here are a few steps to get started.

## The Basics

A component is an Enyo kind that can publish properties, expose events, and
contain other components.  It may be useful to think about components as owning
a set of content (other components) and providing inputs (methods and property
setters) and outputs (events and property getters).  A component controls the
content it owns and sends messages to its owner in the form of events. Here's an
example: 

        enyo.kind({
            name: "RandomizedTimer",
            kind: enyo.Component,
            minInterval: 50,
            published: {
                baseInterval: 100,
                percentTrigger: 50
            },
            events: {
                onTriggered: ""
            },
            create: function() {
                this.inherited(arguments);
                this.start();
            },
            destroy: function() {
                this.stopTimer();
                this.inherited(arguments);
            },
            start: function() {
                this.job = window.setInterval(enyo.bind(this, "timer"), this.baseInterval);
            },
            stop: function() {
                window.clearInterval(this.job);
            },
            timer: function() {
                if (Math.random() < this.percentTrigger * 0.01) {
                    this.doTriggered({time: new Date().getTime()});
                }
            },
            baseIntervalChanged: function(inOldValue) {
                this.baseInterval = Math.max(this.minInterval, this.baseInterval);
                this.stop();
                this.start();
            }
        });

As the name implies, this is a simple randomized timer component.  Its kind is
`enyo.Component`, so it inherits and extends the behavior of the
`enyo.Component` object.  It generates an event when the timer fires and exposes
a couple of properties to control the firing frequency.  As you can see, it's
straightforward to expose properties and events.

## Properties

Exposed properties are placed in a `"published"` block and may include a default
value.

To retrieve a published property's value, call `get()`.  For example,

        get("baseInterval");

returns the value of `baseInterval`.

Similarly, to change a published property's value, call `set()`.  In the current
example,

        set("baseInterval", 75);

sets `baseInterval` to 75.

If you have worked with Enyo in the past, you may recall that when you declare a
published property, you also have the option to specify a "property changed"
method, which will be called automatically whenever the value is changed.  In
this example, we've defined `baseIntervalChanged()`, which will be called each
time we set a new value for `baseInterval`.

The property changed method may be used to perform actions that need to be
repeated each time the property value changes, such as data validation.  This
is, in fact, what we see taking place in `baseIntervalChanged()`.

Note that it's often necessary to initialize a property's value.  We typically
do this by calling the property changed method in `create()`.  Since the need
for initialization can vary from case to case, we leave this to the component
writer's discretion.

## Events

Similarly, events are placed in an `"events"` block.  To fire an event, we call
the associated `"do"` method, another convenience provided by Enyo.  For
example, to fire the `onTriggered` event, we call `doTriggered`.  You may pass a
single argument to the `"do"` method--an event object that will be passed along
to the event handler.  In this case, we send the current time in the event's
`time` property.  In a moment, we'll see how to handle this event.

## Components in Components: It's Turtles All the Way Down

First, though, we'll create another component kind, named `SimulatedMessage`:

        enyo.kind({
            name: "SimulatedMessage",
            kind: enyo.Component,
            components: [
                {name: "timer", kind: "RandomizedTimer", percentTrigger: 10,
                    onTriggered: "timerTriggered"}
            ],
            timerTriggered: function(inSender, inEvent) {
                this.log("Simulated Service Message Occurred at " + inEvent.time);
            }
        });

As you can see, there's a `components` block and it contains a configuration
object specifying a `RandomizedTimer`.  When we create a `SimulatedMessage`
instance, it will create the components in its `components` block.  We say that
it "owns" these components, and it's responsible for their lifecycle.  It can
refer to these objects by name using the `this.$` hash; for example, you could
call `this.$.timer.setPercentTriggered(50)`.

Users of the `SimulatedMessage` component do not have to concern themselves with
the timer component.  Its behavior is encapsulated inside `SimulatedMessage`.
All components are considered to be private to their owner.

## Handling Events

Having addressed the issue of component ownership, we can return our attention
to the `onTriggered` event.  Notice the string set for the `onTriggered` event
in the `"timer"` configuration object.  This is the name of the method in
`SimulatedMessage` (the owner of the timer) that will be called to handle the
event.

Events are delegated to the generating component's owner by way of this named
delegate string.  This lets us avoid the pain of having an add/remove listener
mechanism.  The first argument sent with every event is `"inSender"`, which is a
reference to the component that generated the event.  This argument facilitates
code reuse since the same method can be used to handle multiple events
distinguished by `inSender`.  The second argument, `inEvent`, is an object whose
properties convey information about the event.

## Summary

To review, components are basic building blocks that encapsulate behavior (often
by using other sub-components) and expose an interface in the form of methods,
properties, and events.

**Additional Reading**

* [Creating Controls](creating-controls.html)
* [Creating Kinds](creating-kinds.html)