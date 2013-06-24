# Enyo 2.0 Release Notes

Welcome to Enyo 2.0.  The following items have changed since the 2.0 beta 5 release.  (Note that this list is not comprehensive; see the commit history in GitHub for a complete list of changes.)

## Sampler

* A new Sampler app has been added, along with its own new repository at https://github.com/enyojs/sampler.

## Bootplate

* The Bootplate template has been updated with the 2.0GA code and an improved API Viewer tool.

## Enyo

* In `enyo.platform`, added a regex to detect desktop versions of Safari.
* In `enyo.RichText`, fixed issue causing RichText objects to not be recognized as text fields.
* Changed `getSelected()` to `getValue()` in the code sample from the opening comments in `enyo.Select`.
* In `enyo.TouchScrollStrategy`, removed trailing comma from overscroll data.
* In `enyo.UiComponent`, blocked resize events for hidden UiComponents.
* In `enyo.WebService`, changed name of `callback` property to `callbackName` to match the name expected by `JsonpRequest`.
* In the Playground sample, a missing style has been added to `Playground.css`.
* In ScrollerSample, the Picker now listens for `onSelect` instead of `onChange`.

## Layout

* In `enyo.Arranger`, fixed several issues related to positioning and visibility.  Also 
  implemented `destroy()` for each of the Arranger kinds, so they leave child controls in a 
  reasonable state when changing arrangers.
* In FittableSample, fixed layout issues on iOS.
* Added new `FittableTests` sample.
* In `enyo.List`, fixed issue that could cause lists in nested panels to become unscrollable.
* Fixed issue causing list-flickr example to not load on IE9.
* In `enyo.Node`, added cross-platform CSS3 compatibility and an optional `onlyIconExpands` property.
* In `enyo.Panels`, blocked resize events for hidden panels.  Also eliminated visual artifacts
  (flashing) when deleting a panel.
* Fixed titles in panelMatters.
* In `PanelsSample.html`, added scroller to Arrangers menu to fix sizing issue in Safari on iOS; also 
  fixed associated CSS file.
* Fixed titles in `PanelsSample.js`.  Also set arranger scroller size depending on media 
  query (set max-height for smaller screens, allow natural sizing for larger screens). 
* In `enyo.PulldownList`, made Puller dynamically reference the list being pulled, allowing you to 
  use multiple PulldownLists.

## Onyx
* Added new widgets: `Drawer`, `Item`, `Menu`, `MoreToolbar`,  `Picker`, `FlyweightPicker`, 
  `Scrim`, `Spinner`,  and `Tooltip`.
* Added code samples for new widgets.
* Changed `onyx.MenuDecorator` to allow menus, pickers, etc. to work inside `MoreToolbar`.
* In `onyx.Popup`, added scrim support and z-index support.
* Updated menus and pickers to use separate events for internal and client communication.
* Updated code samples for numerous widgets, including ButtonSample, GroupBoxSample, InputSample, and PopupSample.

## Tools

* Fixed the `minify.js` build script for Node 0.8.2.
* In `AjaxTest.js`, fixed testCors bad response in Firefox by using YQL API call instead of YouTube API call.

## Documentation

* The documentation available in the API Viewer tool has been reviewed and significant additions have been made.
* The API Viewer now shows the package a kind comes from at the top of the details view.

## Known Issues

The following issues are under investigation for fixing in future versions of Enyo:

* Many controls aren't working in Google Chrome for Android.
* In Firefox, some draggable items don't behave properly if they're not in a control with the `enyo-unselectable`
  style applied.  Instead of dragging, they show a content icon and continue to respond after the mouse 
  button has been released.
* In WebKit-based browsers, dragging in text fields can cause unscrollable divs (such as those 
  used in panel arrangers) to scroll, causing the layout code to misbehave.
* In Internet Explorer, controls are not marked as unselectable.
* Nested `onyx.Drawer` controls don't open correctly.

For more information, see our bug database at https://enyojs.atlassian.net.