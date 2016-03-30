% Enyo 2.7.0 Release Notes

Welcome to Enyo 2.7.0.  The items listed below have changed since the 2.5.1
release.  (Note that this list is not comprehensive; see the commit history in
GitHub for a complete list of changes.)

## Detailed Release Notes

The biggest change from 2.5.1 to 2.7.0 is the introduction of modules. 

Before we could write code like this:

```javascript

  //Enyo 2.5
  //Everything we want to use from enyo
  //can be found inside the enyo object.

  new enyo.Control({
    components: [
        {content: "Hello From Enyo"},
        {tag: "hr"}
    ]
  }).renderInto(document.body);
```

Starting in enyo 2.7.0 we now write code like this.

```javascript
  //Enyo 2.7
  //If we want to use an enyo module like control,
  //we must require the module before we can use it.

  var Control = require('enyo/Control');

  new Control({
    components: [
        {content: 'Hello From Enyo'},
        {tag: 'hr'}
    ]
  }).renderInto(document.body);
```

### enyo

* Added new modules 
    * `enyo/AccessibilitySupport`
    * `enyo/DataGridList`
    * `enyo/ScrollThumb`
    * `enyo/Blob`
    * `enyo/EventEmitter`
    * `enyo/History`
    * `enyo/MixinSupport`

* Deprecated Modules/Methods/Properties
    * `enyo/animation`
        * `cancelRequestAnimationFrame` 
    * `enyo/Control`
        * `getTag()`
        * `setTag()`
        * `getAttributes()`
        * `setAttributes()`
        * `getClasses()`
        * `setClasses()`
        * `getStyle()`
        * `setStyle()`
        * `getContent()`
        * `setContent()`
        * `getShowing()`
        * `setShowing()`
        * `getAllowHtml()`
        * `setAllowHtml()`
        * `getCanGenerate()`
        * `setCanGenerate()`
        * `getFit()`
        * `setFit()`
        * `getIsContainer()`
        * `setIsContainer()`
        * `isContainer`
    * `enyo/CoreObject`
        * `addGetterSetter()`
    * `enyo/DataRepeater`
        * `multipleSelection`  
        * `groupSelection`
    * `enyo/EventEmitter`
        * `addListener()`
        * `removeListener()`
        * `triggerEvent()`
    * `enyo/Hooks`
    * `enyo/kind`
        * `_kindCtors`
        * `Theme`
        * `registerTheme()`
    * `enyo/ObserverSupport`
        * `addObserver()`
    * `enyo/RichText`
        * `modifySelection()`
        * `moveCursor()`
        * `moveCursorToEnd()`
        * `moveCursorToStart()`
    * `enyo/Scrollable`
        * `scrollToControl()`
    * `enyo/Store`
        * `findLocal()`

#### Various bug fixes and performance improvements

* In `enyo/Scroller`, update default scrollStrategy for iOS devices

* Added `enyo/ShowingTransitionSupport`, a mixin to make showing/hiding animations
    easier.

* Using `enyo/animation` for requestAnimationFrame polyfill

* Added support for Windows 10 apps.

* Remove IE8 support

### moonstone

* Added new modules 
    * `moonstone/AnimatedButton`
    * `moonstone/AnimatedButtonSvg`    
    * `moonstone/ApplicationCloseButton`
    * `moonstone/ClampedText`
    * `moonstone/DayPicker`
    * `moonstone/ExpandableListItemDrawer`
    * `moonstone/ExpandableListItemHeader`
    * `moonstone/MoonAnimator`
    * `moonstone/NewDataList`
    * `moonstone/PlaylistSupport`
    * `moonstone/ScrollThumb`
    
* Deprecated Modules/Methods/Properties
    * `moonstone/Accordion`         
    * `moonstone/Button`
        * `contentUpperCase`
    * `moonstone/Calendar`
    * `moonstone/ChannelInfo`
        * `channelNoUpperCase`
    * `moonstone/clock`
        * `locale`
    * `moonstone/ContextualPopupButton`
    * `moonstone/DateTimePickerBase`
        * `locale`
    * `moonstone/Dialog`
        * `titleUpperCase`
    * `moonstone/Drawer`
        * `setOpen()`
        * `getOpen()`
        * `setControlsOpen()`
        * `setControlsOpen()`
    * `moonstone/Header`
        * `titleUpperCase`
    * `moonstone/History`
    * `moonstone/IconButton`
        * `noBackground`
    * `moonstone/Image`
        * `adaptComponentsBlock`
    * `moonstone/InputHeader`
    * `moonstone/Panels`
        * `leftKeyToBreadcrumb`
    * `moonstone/ProgressBar`
        * `popupContentUpperCase`
    * `moonstone/Slider`
        * `noPopupChanged()`
        * `tapAreaClasses`
        * `noPopup`
    * `moonstone/StyleAnimator`
    * `moonstone/ToggleText`
    * `moonstone/Tooltip`
        * `contentUpperCase`
    * `moonstone/VideoInfoHeader`        
        * `titleUpperCase`
    
#### Various bug fixes and performance improvements

* Added new validator option for `moonstone/InputDecorator` using `invalid` and `invalidMessage`
    properties. If `invalid`, the `invalidMessage` will show up as a tooltip next to the input.

* Addressed issue where `moonstone/Slider`'s tooltip would be missing.

* Added sideways facing `moonstone/ToolTip` and updated the look of the ToolTip tail. It is now
    possible to specify `'left top'`, `'left bottom'`, `'right top'` and, `'right bottom'` for
    the `position` of the ToolTip.

* Updated `moonstone/ListAction`'s layout to 2017 design.

* Updated the neutral theme used by many Moonstone components to be lighter.

* `moonstone/Popup` no longer remembers the last spotted control and an error accessing `getShowing()`
    was corrected.

* Updated `moonstone/Dialog` layout to 2017 design. `title`, `subTitle`, and Divider (`useDivider`) are
    all optional now. Buttons relocated to the bottom.

* Fixed issue in `moonstone/NewDataList` where item would lose focus after leaving app.

* `moonstone/ExpandablePicker` can now be closed with back key

* Updated `moonstone/Slider` so that it is clearer how to interact with the knob in 5-way.

* In `moonstone/IconButton`, now has its own tap area rules And mixin updated/added for
    alternate case.

* Added support for sideways-facing tooltips Tooltip.

* Changed ListActions to new design using ContextualPopups.

* In `moonstone/ContextualPopupButton`, change `defaultKind` from ContextualPopupButton
    to Button.

* Better non-floating tooltip support.

* In `moonstone/InputDecorator`, added input validation.

### layout

#### Various bug fixes and performance improvements

* Support `swipeable` in a pulldown list

* Configure hold pulse for `layout/PanZoomView` to ensure holds are cancelled

* Allow for use of translation for panel transition on Android.

### spotlight

#### Various bug fixes and performance improvements

* Added support for `spotlightRememberFocus`

* Support `spotlightRememberFocus` option on `setLastFocusedChild`.

* Add `extraCandidates` option to `getNearestNeighbor`.

* Improved Touch Support for Spotlight.

* Removed 50 milliseconds time delay on DOM focus.

### onyx

#### Various bug fixes and performance improvements

* Removed locale property from `onyx/DatePicker` and `onyx/TimePicker`

* Added non-iLib versions of Date/Time pickers

### enyo-ilib

#### Various bug fixes and performance improvements

* Added check for `navigator.language` for IE support

### enyo-webos

#### Various bug fixes and performance improvements

* Add supports for subscribed requests and cancel function

## Known Issues
