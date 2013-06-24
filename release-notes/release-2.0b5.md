# Enyo 2.0b5 Release Notes

# enyo

* emulation layer to detect iOS-style gesture events on other touch screen devices
* enyo.Animator: moved from onyx into enyo/ui
* onyx.Popup: promoted to enyo.Popup without onyx-specific styling
* enyo.RichText: new defaultFocus property
* enyo.platform: added checks for touch and gesture events
* PhoneGap app event support added into dispatcher
* enyo.WebService: new component wrapping enyo.Ajax for simple use cases
* enyo.Repeater: API changed, rows -> count, onSetupRow -> onSetupItem, now 
  correctly dispatches events set on repeated elements to the owner of the repeater,
  now rebuilds automatically after any call to setItems, new itemAtIndex method
* enyo.Async.go now always guaranteed to be asynchronous
* enyo.Checkbox: active property now used during initial rendering
* enyo.RichText: now inherits from enyo.Input to use common implementation,
  now fires onChange event when focus blurs
* enyo.Input: now intercepts drag events to allow text selection to succeed
* enyo.UIComponent: new controlAtIndex method
* enyo.Control: new method getComputedStyleValue
* enyo.JsonpRequest: new properties charset and cacheBust, better error handling
* enyo.dom: new method canTransform to detect platforms supporting CSS3 Transforms
* remove API tool, moved into separate repo

# layout

* enyo.AlphaJumpList: new WIP list with alphabet headers
* enyo.Panels: new control to handle arranging multiple cards of content
* enyo.Tree: new WIP control to show hierarchical data
* enyo.PulldownList: new WIP list that supports "pulldown" event to refresh content
* enyo.FlyweightRepeater: selected value sent along with index in onSetupItem event,
  API changed from rows to count and onSetupRow to onSetupItem

# onyx

* onyx.SwipeableItem: new WIP control for list items that can be swiped away
* onyx.Spinner: new WIP control for showing wait state
* onyx.Scrim: new WIP control for showing background behind popups
* onyx.Slideable removed, replaced by enyo.Slideable in layout library
* onyx.Checkbox: refactored to be based on enyo.Checkbox
* onyx.TabPanels: new WIP control for showing tabs to choose a panel

# bootplate

* New application template with minimizer scripts and git submodules