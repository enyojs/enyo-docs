% User Input

## Introduction

In general, text input should be avoided on the TV for the following reasons:

* We are trying to foster a lean-back atmosphere on the TV, but text input
    (especially with the Magic Remote) is an inherently lean-forward experience.

* A key aspect of Keeping it Simple is the elimination or consolidation of
    situations in which text entry is needed; interactions should be driven by
    button clicks, if possible.

* The onscreen virtual keyboard limits the amount of space available for forms
    and search results, especially when using Always Viewing Patterns.

However, there are certain cases (e.g., login form, contact information, or
account information) where a user cannot avoid entering text or interacting with
forms. 

We have identified two common patterns for user input: [Inline
Editing](acting-on-data/edit-mode.html#inline-editing) and [New Panel
Editing](acting-on-data/edit-mode.html#new-panel-editing).  These patterns will
help you to provide users with a consistent text input experience.  Both are
covered in detail in the discussion of [Edit Mode](acting-on-data/edit-mode.html).

## Best Practices

When possible, labels should be aligned on the left side of the form, with Input
Fields, Pickers, Checkboxes, etc. to the right of the labels.  In
width-constrained forms, labels may be placed above the corresponding forms.

Input Fields should be grouped, when possible, to minimize the number of times
that the Virtual Keyboard is opened and closed.

Submit actions (e.g., Log In, Create Account, Change Password) should always be
directly below the last form element, left-aligned with the input field column.

Allow users to toggle between similar forms (e.g., Login/Register or
Credit Card/PayPal) using an action button in the header.  This will reduce the
form length and allow users to reach their desired forms faster.

Assume that editing/updating of data will be infrequent.  Display current data
in the Details Panel (e.g., Account Information) as plain text to optimize
screen real estate, and perform edits or updates in the next panel.

Use popups to confirm actions and suggest next steps.

When the input takes place within a popup, ensure that the height of the popup
can be fully displayed above the expanded Virtual Keyboard. 

## Related Topics

Patterns: Notifications, Onscreen Direction, Confirmation

Controls: [Text Input](../controls/text-input.html),
[Button](../controls/button.html),
[Form Checkbox](../controls/form-checkbox.html),
[Date Picker](../controls/date-picker.html)
