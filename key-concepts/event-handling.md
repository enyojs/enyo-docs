% Event Handling

Enyo employs a message-passing strategy for indirect communication between
components.  We refer to these messages as "events" to dovetail with common DOM
usage.  In general, events bubble up the component tree from child to parent.
When using the `dom` package (part of the Enyo core), DOM events and custom
events are unified.

The use of events is key to enforcing encapsulation in your component design.
In most cases, the children of a component should have no knowledge of their
parent.  So instead of calling functions on (and thus tightly binding itself to)
its parent, a child should send events, which the parent may choose to handle or
not handle.

While sending events from child to parent is the standard paradigm in Enyo, in
some situations the implementation of this model can result in inefficient and
unwieldy code.  Thus an alternative method of communication exists--this
involves the use of [enyo.Signals](http://enyojs.com/api/#enyo.Signals) and is
discussed at the end of the current document.

## Sending Events

A component declares the events that it sends using an `events` block, e.g.:

        events: {
            onStateChanged:""
        }

Note that, by convention, event names always start with `"on"`.

For each event registered in a component's `events` block, a helper function
`do<EventName>(inEvent)` is created on the kind, which the component may call to
send the event up the component tree.  This function takes an optional `inEvent`
parameter, which can contain event-specific information to be passed to the
handler.  For example, to send the `"onStateChanged"` event from the example
above, a component would call

        this.doStateChanged(newState)  // parameter is specific to the "onStateChanged" event

Under the hood, the `do<EventName>` function wraps Enyo's generic `bubble`
function for sending events up the component tree:

        this.bubble(inEventName <, inEvent, inSender>)

* `inEventName` is the event name (including the `"on"` prefix).

* `inEvent` is an optional object containing event-specific information (this is
    the same object listeners receive as `inEvent`, although it may be decorated,
    e.g., with the `originator` property).  Note that this must be a JavaScript
    object, not a primitive.

* `inSender` should almost always be omitted, although you could use it to force
    a particular sender for the next handler.

**Note:** Declaring an `events` block and using the `do<EventName>` helper
function is preferable to calling `bubble` directly, since the `events` block is
more descriptive and serves to define the interface to your kind.

## Creating Handlers

An event handler is a function assigned to "catch" events bubbling up from
children.  For example:

        myEventHandler: function(inSender, inEvent) {
            // Can return true to indicate that this event was handled and
            // propagation should stop
        }

* `inSender` is the immediate sender of the event--that is, the last
    [enyo.Component](http://enyojs.com/api/#enyo.Component) to touch the event
    before passing it to `this`.

* `inEvent` is an object that contains event data.  For DOM events, this is the
    standard DOM event object.  For custom events, it's a custom object.

The handler may return a truthy value to stop propagating the event.  Otherwise,
it will continue bubbling up the component tree. 

Note that the meaning of the return value is different from the classic DOM
convention (historically, the return value would determine whether the default
action occurs).  If you need to control the default action on a DOM event, use
the modern equivalent, `inEvent.preventDefault()`.

`inEvent.stopPropagation()` will not prevent propagation of events in Enyo;
return `true` from the handler instead.

Because events propagate until stopped, an event's sender (`inSender`) may be
different from its originator (i.e., the component that originally fired the
event).  The originating component is available to the event handler as
`inEvent.originator`.

For example, when clicked, a button originates an `onclick` event, which
bubbles up the control chain.  The button's parent may bubble the event up to
the button's grandparent.  From the grandparent's perspective, the originator is
the button and the sender is the button's parent.

## Attaching Handlers to Events

There are two common ways of handling events in a component.  The first is to
set a handler name on an object owned by the component, like so:

        components: [
            {name: "thing", ontap: "thingTap"}
        ],
        thingTap: function(inSender, inEvent) {
            // do stuff
        }

The second is to name a catch-all handler in the `handlers` block, like so:

        handlers: {
            ontap: "anythingTap"
        },
        anythingTap: function(inSender, inEvent) {
            // do stuff
        }

Note that if you use both event handling strategies at the same time, you
will receive the event in both places by default.  You may avoid this behavior
by preventing propagation in `thingTap()`.  For example:

        components: [
            {name: "thing", ontap: "thingTap"}
        ],
        handlers: {
            ontap: "anythingTap"
        },
        thingTap: function(inSender, inEvent) {
            // taps on _thing_ will bubble up to _anythingTap()_ also,
            // unless I stop propagation here
            return true; // handled here, don't propagate
        }
        anythingTap: function(inSender, inEvent) {
            // do stuff
        }

If you need more sophisticated handling, you can use the `inSender` and
`inEvent.originator` properties to help you discern the provenance of the event.

## DOM (and DOM-like) Events

In Enyo, DOM events are allowed to bubble all the way up to `document`, where
they are handled by `enyo.dispatcher`.  The dispatcher figures out where to send
the event and provides hooks for various bits of event processing.

Whenever possible, the dispatcher avoids disturbing original DOM events.  To
forcibly stop the bubbling of a DOM event, you may return `true` from the
event's handler method.

In addition to the `target` property, which is set on all event objects, Enyo
specifies a `dispatchTarget` property, which is set to the Enyo control
containing the event target.

The following DOM events are handled by Enyo:

* mousedown
* mouseup
* mouseover
* mouseout
* mousemove
* mousewheel
* click
* dblclick
* change
* keydown
* keyup
* keypress
* input
* paste
* copy
* cut
* resize
* load
* unload
* message
* hashchange
* webkitTransitionEnd
* transitionend
* webkitAnimationEnd
* animationEnd

If there are additional DOM events that you want Enyo to handle, use the
`enyo.dispatcher.listen()` method.  For example, the following code sets up a
handler for an event called `myEvent`:

        enyo.dispatcher.listen(document, "myEvent", handleMyEvent);

Here the first parameter is an event receiver to listen on (typically `document`
or `window`).  The second parameter is the name of the event to listen for, and
the third is the handler method. 

In addition to DOM events, there are a number of normalized input events that
the dispatcher sends as synthesized "DOM-like" events (e.g., `ontap`, `ondown`,
`onup`, `ondragstart`, `ondrag`, `ondragfinish`, `onenter`, and `onleave`).
Most of these events work across platforms, so client code does not have to
distinguish between touch and mouse interfaces.

As a matter of convention, DOM events and DOM-like events remain lowercase when
dispatched as Enyo events (i.e. `ontap`), but custom events declared by Enyo
kinds use camel case (i.e. `onStateChanged`).

For more about DOM-like events, see the documentation on
[User Input](../building-apps/user-input.html).

## Signals

There may be times when two distantly-related components in your app need to
communicate with each other.  Using the standard event model, you would pass an
event up to a common parent (in the worst case, the top-level app kind) and then
pass the event back down to the target component.  Because this may require a
significant amount of plumbing, Enyo provides an alternative.

[enyo.Signals](http://enyojs.com/api/#enyo.Signals) provides a means of
broadcasting and subscribing to global messages, bypassing the normal component
tree.  Within the Enyo framework itself, DOM events that have no node targets
are broadcast as signals.  These events include window events, like `onload` and
`onbeforeunload`, and events that occur directly on `document`, like
`onkeypress` if `document` has the focus.  Signals are also useful for hooking
up non-Enyo events (e.g., Cordova/PhoneGap events) to be handled by Enyo kinds
in application code.

To broadcast a message, a sender simply invokes the static `send()` function on
`enyo.Signals`:

        enyo.Signals.send(inEventName, inEvent);

* `inEventName` is the event name (including the `"on"` prefix). 

* `inEvent` is an optional object containing event-specific information.

To listen for a signal, a component should include a Signals instance in its
`components` block.  It should also specify a handler for the signal by setting
the `<messageName>` property of the Signals object to the name of a method in
the owning kind.  This method is then called whenever a `<messageName>` signal
is received.

For example, the following kind...

        enyo.kind({
            name: "Receiver",
            components: [
                // 'onTransmission' is the message name and 'transmission' is the
                // name of a handler method in my owner.
                {kind: "Signals", onTransmission: "transmission"}
            ],
            transmission: function(inSender, inEvent) {
                // respond to the signal
            }
        });

...will handle signal events dispatched by a call like this:

        enyo.Signals.send("onTransmission");

Note that, like all Enyo message handlers, the signal handler (`transmission()`)
receives two parameters: a reference to the component that sent the message (in
this case, our own Signals object, `this.$.signals`), and any event payload
that the transmitter included in the broadcast.

Some important things to note:

* The signal name passed into `send()` must exactly match the message name in
    the receiving Signals instance; both must include the `"on"` prefix.

* All Signals instances that register a handler for a particular message name
    will receive the message.

* The `send()` method is on the `enyo.Signals` kind itself, not an instance of a
    Signals component.  

* Do not abuse Signals.  Coupling objects with global communication is considered
    evil.

**Additional Reading**

* [User Input](../building-apps/user-input.html)
* [Creating Controls](creating-controls.html)
* [Published Properties](published-properties.html)
* [Encapsulation in Enyo](../best-practices/encapsulation-in-enyo.html)