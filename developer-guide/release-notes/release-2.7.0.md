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
        {kind: "Button", content: "Click me"}
    ]
  }).renderInto(document.body);
```

Starting in enyo 2.7.0 we now write code like this.

```javascript
  //Enyo 2.7
  //If we want to use an enyo module like control,
  //we must require the module before we can use it.

  var Control = require('enyo/Control'),
      Button = require('enyo/Button');

  new Control({
    components: [
        {content: 'Hello From Enyo'},
        {kind: Button, content: "Click me"}
    ]
  }).renderInto(document.body);
```

In order to package apps using modules, you must use
[enyo-dev](https://www.npmjs.com/package/enyo-dev).

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

* In `enyo/Scroller`, update default scrollStrategy for iOS devices

* Added `enyo/ShowingTransitionSupport`, a mixin to make showing/hiding animations
    easier.

* Added support for Windows 10 apps

* Removed IE8 support and took all non-evergreen desktop browsers off our supported platforms list

* Added `enyo/NewDataList`, `enyo/ViewManager`, `enyo/FluxStore`, `enhyo/FluxDispatcher`,
    `enyo/BackgroundTaskManager` and other Work-In-Progress kinds

* Various bug fixes and performance improvements

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

* Added sideways facing `moonstone/ToolTip` and updated the look of the ToolTip tail. It is now
    possible to specify `'left top'`, `'left bottom'`, `'right top'` and, `'right bottom'` for
    the `position` of the ToolTip.

* Updated the neutral theme used by many Moonstone components to be lighter.

* `moonstone/Popup` no longer remembers the last spotted control and an error accessing `getShowing()`
    was corrected.

* Updated `moonstone/Dialog` layout

* Changed `moonstone/ListActions` to new design using `moonstone/ContextualPopup`.

* In `moonstone/ContextualPopupButton`, change `defaultKind` from `moonstone/ContextualPopupButton`
    to `moonstone/Button`.

* Various bug fixes and performance improvements

### layout

* Support `swipeable` in a pulldown list

* Allow for use of translation for panel transition on Android.

* Various bug fixes and performance improvements

### spotlight

* Added support for `spotlightRememberFocus`

* Add `extraCandidates` option to `getNearestNeighbor`.

* Improved Touch Support for Spotlight.

* Removed 50 milliseconds time delay on DOM focus.

* Various bug fixes and performance improvements

### onyx

* Created new locale-aware versions of `onyx/DatePicker` and `onyx/TimePicker` called
    `onyx/i18n/DatePicker` and `onyx/i18n/TimePicker`. These new versions require `enyo-ilib`.

* Various bug fixes and performance improvements

### enyo-ilib

* Added check for `navigator.language` for IE support

* Various bug fixes and performance improvements

### enyo-webos

* Various bug fixes and performance improvements

### svg

* A new library for using SVG components, the Enyo way

## Known Issues
