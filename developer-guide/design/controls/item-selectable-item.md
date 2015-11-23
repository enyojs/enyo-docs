% Item/Selectable Item

## About

An Item is a control with a text element and associated actions.

A Selectable Item is an Item with support for tracking selection state.  When
used in a group, only one Selectable Item in the group may be selected at a
time.  This is useful for menus that change the content next to them.

## API Reference

[moonstone/Item]($api/#/kind/moonstone/Item),
[moonstone/SelectableItem]($api/#/kind/moonstone/SelectableItem)

## Behavior and States

### Behavior

#### Item

An Item is a focusable and selectable control that usually displays simple text.
Items may be independent or organized into groups.  They may be used to create
actions with text--for example, an item may be used inline in a text area to
create an inline link.

#### Selectable Item

A Selectable Item is an Item with added support for selection state.  When
selected, a Selectable Item is decorated with a left-aligned circle.

Selectable Items are often organized into lists and groups for menu controls.
In a list, each selectable item may be selected and deselected independently.
When grouped, only one Selectable Item in the group may be selected at a time;
when a user selects an option, any previous selection will be automatically
deselected.

### States

* **Normal (up/unpressed)**

    The control is available for use and is not selected.

* **Focused (hover)**

    The control has the current focus from the remote and is ready to be
    selected.

* **Selected (down/pressed)**

    The control has been selected.  Both Selectable Item and Checkbox Item may
    have this state.

* **Deactivated (disabled)**

    The control cannot be selected.

## Illustration

![](../../assets/dg-controls-item-selectable-item.png)
