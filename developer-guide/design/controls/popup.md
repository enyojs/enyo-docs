% Popup

## About

A Popup (or "Popup Dialog") is a modal container anchored at the bottom of the
screen.  User interaction is required to dismiss the dialog.

## API Reference

[moonstone/Popup]($api/#/kind/moonstone/Popup)

## Behavior and States

### Behavior

Popups overlay the current screen and require user action to close and return to
the app.  The popup window is anchored to the bottom of the screen and takes up
the full width of the screen.  The height may be fixed, or may vary based on the
content.  Only one popup may be open at a time.  When using this control, make
sure that there is a way to dismiss the Popup.

Popups are anchored to the bottom of the screen and animate when opening and
closing.  See the UI Patterns for examples of popup dialog usage.
 
### Sizing

Popups use the full screen width, but may vary in height depending on the amount
of content inside.

## Illustration

![](../../assets/dg-controls-popup.png)
