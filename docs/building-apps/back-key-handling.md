# Back Key Handling in webOS

In webOS, WAM (the Web Application Manager) consumes **Back** keypresses
according to the HTML standard "history" API, as documented here:

[Mozilla Developer Network: Manipulating the browser
history](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history)

## What This Means

Enyo applications will not receive a `keydown`, `keyup`, or `keypress` event for
the **Back** button.  Instead, the **Back** button will generate the equivalent
of a `javascript:history.back()` call.

In order to receive navigation events (`back` is the only one currently
supported), your application must have history--either via traditional
navigation (as a multi-page app would have), or via the `history.pushState()`
browser API.

If there is no history on the stack, then pressing **Back** will send the app to
background and the launcher will open.  Thus, in order to handle the **Back**
key, apps MUST push state onto the history stack in order to receive events
associated with the **Back** key.

If there is history on the stack, the following will happen:

* If the history is navigation history, then the page will be backed up by one
    level in the navigation history.

* If the history was pushed via `history.pushState()`, then the `popstate` event
    will be fired.  The global `history.state` variable will reflect the new
    state object at that point.

To replace the current state on the history stack, call
`history.replaceState(<newState>)`.  If you need to replace a navigation
location in the history, you can use `window.location.replace(newUrl)`.

## Example 1: Responding to state popped from the history stack

In your `create()` function, you can register a callback for the `popstate`
event:

        create: function() {
            this.inherited(arguments);
            window.addEventListener('popstate', enyo.bindSafely(this, function(inEvent) {
                this.$.myPanel.selectPanelByName(inEvent.state.panelName);
            }));
        }

Then when a user selects a panel, you can call

        history.pushState( { panelName: "MainPanel" } );

to put your `"MainPanel"` onto the stack.  If the user then selects another
panel, you can call

        history.pushState( { panelName: "SecondPanel" } );

Then, if the user presses the **Back** key, the `popstate` event handler will be
called--first with `history.state` having the value

        { panelName: "SecondPanel" }

and then (on the second **Back** keypress) with `history.state` having the value

        { panelName: "MainPanel" }

If **Back** is pressed a third time, the app will be sent to the background and
the launcher will open.

## Example 2: Simulating Back key events

The following code simulates the dispatching of **Back** key `keypress` events
via [enyo.Signals](../api.html#enyo.Signals).  This code introduces a
`setDispatchBackKey(boolean)` API, which determines whether or not pressing the
**Back** key will dispatch a simulated `keypress` event.  When `true` is passed
in, the app will receive keypress events.  When `false` is passed in, the
history stack will be forced to the top such that the next **Back** keypress
results in the app's going to the background.

        (function(window) {
            var dispatchBackKey = false;
            window.getDispatchBackKey = function() { return dispatchBackKey; };
            window.setDispatchBackKey = function(inDispatch) {
                if (dispatchBackKey != inDispatch) {
                    dispatchBackKey = inDispatch;
                    if (dispatchBackKey) {
                        history.pushState({});
                    } else {
                        history.back();
                    }
                }
            };
            enyo.ready(function() {
                window.addEventListener("popstate", function(inEvent) {
                    if (dispatchBackKey) {
                        console.log("popstate", history.state);
                        enyo.Signals.send("onkeypress", {keyCode: 461});
                        history.pushState({});
                    }
                });
            });
        })(window);

Below is a simple example that uses this API with
[moon.Panels](../api.html#moon.Panels) and [moon.Dialog](../api.html#moon.Dialog).
When the Panels is moved to index 0, the `dispatchBackKey` flag is set to
`false`, so that the app is closed on the next **Back** press.

        enyo.kind({
            name: "moon.sample.BackSample",
            classes: "moon enyo-fit enyo-unselectable",
            components: [
                {kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", onTransitionFinish: "transitionFinish", components: [
                    {title: "Panel 1", titleBelow: "Top of stack", subTitleBelow: "Press back to close app", components: [
                        {kind:"moon.Item", content:"Item 1", ontap:"next"}, 
                        {kind:"moon.Item", content:"Item 2", ontap:"next"}
                    ]},
                    {title: "Panel 2", titleBelow: "Press back to go to previous",
                        headerComponents: [
                            {kind: "moon.Button", small: true, content: "Popup", ontap: "openPopup"}
                        ],
                        components: [
                            {kind: "moon.Item", content: "Item 1", ontap: "next"},
                            {kind: "moon.Item", content: "Item 2", ontap: "next"}
                        ]
                    },
                    {title: "Panel 3", titleBelow: "Press back to go to previous",
                        components: [ 
                            {kind: "moon.Item", content: "Item 1", ontap: "next"}, 
                            {kind: "moon.Item", content: "Item 2", ontap: "next"}
                        ]
                    }
                ]},
                {kind: "moon.Dialog", title: "Press back to dismiss"},
                {kind: "enyo.Signals", onkeypress:"keypress"}
            ],
            openPopup: function() {
                this.$.dialog.show();
            },
            next: function() {
                this.$.panels.next();
            },
            transitionFinish: function(inSender, inEvent) {
                // When panels are at index 0, don't dispatch back keypress events; 
                // instead, allow the app to close
                setDispatchBackKey(this.$.panels.getIndex() > 0);
            },
            keypress: function(inSender, inEvent) {
                if (inEvent.keyCode == 461) {
                    if (this.$.dialog.getShowing()) {
                        // If the dialog is showing, close it
                        this.$.dialog.hide();
                    } else {
                        // Otherwise, move backward in the panels stack
                        this.$.panels.previous();
                    }
                }
            }
        });

## Summary

The Enyo framework does not include native **Back** key handling for Moonstone
controls on webOS, since the **Back** key in webOS is specifically tied to the
browser history API, and history management is best done at the application
level, with knowledge of app-specific requirements for navigation and special
uses of the **Back** key.

It is important for each developer to read and understand the browser "history"
API (the [Mozilla MDN article](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history)
linked above is a very good reference), and then choose from the techniques
described in this article to implement a history solution that meets the needs
of the application at hand.
