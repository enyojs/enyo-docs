% Handling User Input

## Normalized User Input

Enyo supports a set of normalized events that work similarly across all
supported platforms.  These events are provided so that users can write a single
set of event handlers for applications that run on both mobile and desktop
platforms.  They are needed because desktop and mobile platforms handle basic
input differently.  For example, desktop platforms provide mouse events, while
mobile platforms support touch events and a limited set of mouse events for
backward compatibility.

### Normalized Input Events

Event normalization takes place in Enyo Core, in code from the `dom` (`drag.js`,
`gesture.js`) and `touch` (`gesture.js`, `msevents.js`, `touch.js`) packages.

The following normalized events are synthesized from the available DOM events:

* `down` is generated when the pointer is pressed down.

* `up` is generated when the pointer is released up.

* `tap` is generated when the pointer is pressed down and released up.  The
	target is the lowest DOM element that received both	the related `down` and
	`up` events.

* `move` is generated when the pointer moves.

* `enter` is generated when the pointer enters a DOM node.

* `leave` is generated when the pointer leaves a DOM node.

* `dragstart` and `dragfinish` are sent for pointer moves that exceed a certain
    threshold.

* `drag` and `drop` are sent to the original target of the pointer move, to
    provide information about the item being moved over (or released over)
    another element.

* `dragover` and `dragout` are sent in addition to `over` and `out` while
    there is an active drag.

* `hold` is generated when the pointer is held down without moving for a short
    period of time (~200ms).

* `release` is generated when the pointer is released after being held down, or
    is moved off of the node while still held down, but before any potential
    `dragstart` event.  The target is the same as that of the `hold` event.

* `holdpulse` is generated when the pointer is held down without moving for a
    short period of time; it repeats periodically about once every 200ms.  Use
    this event to trigger an action after a given period of time.  The elapsed
    time is available in the `holdTime` property.

* `flick` is generated when the user flicks the pointer quickly.  This event
    provides flick velocity data through the properties `xVelocity` (velocity
    with respect to the horizontal axis) and `yVelocity` (velocity with respect
    to the vertical axis).

(Note that, on the Android platform, the `touchmove` event must be prevented
via `inEvent.preventDefault()`, or the Enyo dragging system will not function
correctly.)

Bear in mind that normalized input events are generated on Enyo controls, not
DOM elements.

These normalized events are handled in the usual Enyo fashion, as outlined in
[Event Handling](../key-concepts/event-handling.html).  For example:

        enyo.kind({
            name: "App"
            kind: "enyo.FittableRows",
            components: [
                {kind: "enyo.Button", content: "Tap Me", ontap: "handleTap"},
                ...
            ],
            ...
            handleTap: function(inSender, inEvent) {
                // respond to tap
            }
        });

### Normalized Input Event Properties

Normalized input events have the following common properties, when available:

* `target`
* `relatedTarget`
* `clientX`
* `clientY`
* `pageX`
* `pageY`
* `screenX`
* `screenY`
* `altKey`
* `ctrlKey`
* `metaKey`
* `shiftKey`
* `detail`
* `identifier`

## Keyboard Input

Because Enyo apps may be run on the desktop, the framework must also be able
to deal with hardware keyboard input--which, unlike mouse input, cannot be
translated into normalized input events.

Now, in most cases, you won't have to worry about setting up your application
code to accept keyboard input directly.  If your app uses the [text field
kinds](controls/text-fields.html) built into Enyo and Onyx, those kinds will
handle keyboard input automatically.  However, there may be situations--in some
games, for instance--in which you want your app to respond directly to
keyboard-related DOM events.

To do this, you can use an [enyo.Signals](../api.html#enyo.Signals)
instance to listen for the events `onkeydown`, `onkeypress`, and `onkeyup`.
Each keystroke fires an `onkeydown` and an `onkeyup`; if the keystroke generates
a character, there will also be an `onkeypress` event fired between `onkeydown`
and `onkeyup`. 

The following example kind implements some simple handling of keyboard events:

        enyo.kind({
            name: "KeyboardEventExample",
            kind: "enyo.FittableRows",
            classes: "onyx",
            components: [
                {name: "myContent", content: "Please do not press the spacebar."},
                {kind: enyo.Signals, onkeypress: "handleKeyPress",
                    onkeydown: "handleKeyDown", onkeyup: "handleKeyUp"}
            ],
            handleKeyDown: function(inSender, inEvent) {
                // Can use inEvent.keyCode to detect non-character keys
                if (inEvent.keyCode === 8) {
                    // respond to backspace
                }
            },
            handleKeyPress: function(inSender, inEvent) {
                // Use inEvent.charCode to detect spacebar
                if (inEvent.charCode === 32) {
                    this.$.myContent.setContent("I thought I asked you not to press the spacebar.");
                } else {
                    var key = String.fromCharCode(inEvent.charCode).toUpperCase();
                    this.$.myContent.setContent("Last key pressed: " + key);
                }
            },
            handleKeyUp: function(inSender, inEvent) {
                // Respond to keyup, if desired
            }
        });

Within the `onkeydown` and `onkeyup` handler methods (`handleKeyDown()` and
`handleKeyUp()`), `inEvent.keyCode` is the JavaScript key code representing the
key that was pressed.  In the `onkeypress` handler (`handleKeyPress()`),
`inEvent.charCode` is the decimal value of the Unicode character generated by
the keypress; you can get the character itself as a string by passing
`inEvent.charCode` into `String.fromCharCode()`.

For example, let's say I press the `J` key on my keyboard to type a lowercase
"j".  First, an `onkeydown` event is fired, in which `inEvent.keyCode` has a
value of `74`, the JavaScript key code for "j".  (Note that there is no
distinction between lowercase and uppercase in the JavaScript key codes.) Then
an `onkeypress` event is fired, in which `inEvent.charCode` has a value of 
`106`, which is the decimal value of the Unicode character lowercase "j".
Finally, an `onkeyup` event is fired, in which, once again, `inEvent.keyCode` is
`74`.

Now, let's say I press `"SHIFT + J"` on my keyboard to type an uppercase "J".
This fires two sets of `onkeydown`/`onkeyup` events.  In the first,
`inEvent.keyCode` has a value of `16`, representing the SHIFT key, and there is
no associated `onkeypress` event since there is no character generated.  In the
second `onkeydown` and `onkeyup`, `inEvent.keyCode` has a value of `74`, which
we've seen is the JavaScript key code for "j".  Between the second `onkeydown`
and the second `onkeyup`, an `onkeypress` event fires, in which the value of
`inEvent.charCode` is also `74`, representing the decimal value of the Unicode
character uppercase "J".

![](../../assets/user-input-1.png)

Note that returning true from the `onkeydown` handler will prevent the `onkeyup`
from firing, but will not suppress the `onkeypress` event.

For a more elaborate example of keyboard event handling, see the
[CryptoTweets](http://enyojs.com/samples/cryptotweets/) sample app.
