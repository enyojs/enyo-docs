% Toggle Button

## About

A Toggle Button is a button with two states: on and off.

## API Reference

[moonstone/ToggleButton]($api/#/kind/moonstone/ToggleButton)

## Behavior and States

### Behavior

Toggle Buttons have the ability to reflect an on or off state.  The "selected"
state indicates that an option is "on", whereas the "normal" state indicates
that it is "off".

Multiple Toggle Buttons may be used in a row, or grouped together.  When
grouped, only one button in the group may be selected at a time.  When the user
selects a button from the group, any previously-selected button is deselected.

When creating text labels for a toggle button, try to describe the action that
will be performed when the button is pressed, as opposed to naming the state
that will be entered.  For example, "Turn WiFi OFF/Turn WiFi ON" is more
understandable than "WiFi On/WiFi Off".

An optional tool tip may be applied to the button to clarify what will happen
when it is pressed.

### States

* **Normal (up/unpressed)**

    There has been no interaction with the Button, but it is available for use.

* **Focused (hover)**

    The Button currently has focus from the remote and is ready to be selected.
    This state may be animated.

* **Selected (down/pressed)**

    The Button does not have focus, but has been acted upon, resulting in a
    change of state.  For a Toggle Button, the "on" state is synonymous with the
    "selected" state.

* **Deactivated (disabled)**

    The Button cannot be selected.

## Illustration

![](../../assets/dg-controls-toggle-button.png)
