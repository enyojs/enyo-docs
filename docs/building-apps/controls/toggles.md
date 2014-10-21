% Toggles

## moon.ToggleText

[moon.ToggleText](../../../index.html#/kind/moon.ToggleText), a control that
inherits from [moon.Checkbox](../../../index.html#/kind/moon.Checkbox), looks
like a switch with labels for two states.  Each time it is tapped, it switches
its state and fires an `onChange` event.

```javascript
    {kind: "moon.ToggleText", onContent: "foo", offContent: "bar",
        onChange: "toggleTextToggle"},

    ...

    toggleTextToggle: function(inSender, inEvent) {
        this.log("Toggled to value " + inEvent.value);
    }
```

You may customize the appearance of the control's "on" state by setting the
background color as a CSS style:

```javascript
    {kind: "moon.ToggleText", style: "background-color: #35A8EE;"}
```

Finally, you may determine whether the toggle is currently "on" by querying its
`value` property.  The returned value will be a Boolean `true` or `false`:

```javascript
    queryToggleValue: function() {
        return this.$.toggleText.get("value");
    }
```

## moon.ToggleSwitch

[moon.ToggleSwitch](../../../index.html#/kind/moon.ToggleSwitch), which also
inherits from `moon.Checkbox`, is a control that looks like a switch with an
"on" state and an "off" state.  When the ToggleSwitch is tapped, it switches its
state and fires an `onChange` event.

`moon.ToggleSwitch` differs from `moon.ToggleText` mainly in that the "on" and
"off" states are represented visually instead of textually.  (For a look at
ToggleSwitch controls in various states, see the illustration for
`moon.ToggleItem` below.)

## moon.ToggleItem

[moon.ToggleItem](../../../index.html#/kind/moon.ToggleItem) derives from
[moon.CheckboxItem](../../../index.html#/kind/moon.CheckboxItem) and provides a convenient
way to combine a ToggleSwitch with a text label.

```javascript
    components: [
        {kind: "moon.Divider", content: "Toggle Items"},
        {kind: "moon.ToggleItem", content: "Option 1", checked: true,
            onchange: "itemChanged"},
        {kind: "moon.ToggleItem", content: "Option 2", onchange: "itemChanged"},
        {kind: "moon.ToggleItem", disabled: true, content: "Disabled",
            onchange: "itemChanged"},
        {kind: "moon.ToggleItem", content: "Option 4", checked: true,
            onchange: "itemChanged"}
    ]
```

![_Toggle Items_](../../assets/toggle-items.png)

Toggle items may be used with Enyo's group API.  You may specify multiple
toggle items as components within an [enyo.Group](../../../index.html#/kind/enyo.Group)
to create a control in which only one of the items may be in the "on" state
(i.e., `checked: true`) at a given time.

## moon.ToggleButton

[moon.ToggleButton](../../../index.html#/kind/moon.ToggleButton), which extends
[moon.Button](../../../index.html#/kind/moon.Button), is a button with two
states ("on" and "off"), each of which has an associated text label.  When the
button is tapped, the state switches (as evidenced by updates to the text label
and visual styling), and an `onChange` event is fired.

```javascript
    {kind: "moon.ToggleButton", toggleOnLabel: "wifi is on",
        toggleOffLabel: "wifi is off", ontap: "buttonTapped"}
```

![_Toggle Button (On)_](../../assets/toggle-button-on.png)

![_Toggle Button (Off)_](../../assets/toggle-button-off.png)
