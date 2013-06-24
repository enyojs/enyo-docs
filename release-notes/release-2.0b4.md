It's been five weeks since the beta 3 release, and we're now ready to package
up a bunch of new work that we've been doing.

Major updates for the fourth beta:

* new List control as part of the layout library for virtual lists with cross-platform touch scrolling support
* considerable work on optimizing enyo.Scroller for mobile browsers, especially on Android
* new sample application in the support repo: CryptoTweets, a cryptogram game showing
  use of web APIs via JSONP, Enyo events, and Onyx widgets
* new PhoneGap support library in extra for hooking up PhoneGap/Cordova events into
  the Enyo event routing system

## General
* minifier scripts now check for output folder existing (thanks, Ian Beck)
* calling this.inherited(arguments) when there's no base method no longer causes an exception
* enyo.forEach and enyo.map now match the ES5 specification (thanks, Rick Waldron)
* enyo.log now works from bound methods with no arguments.callee.caller value
* enyo.bind uses native implementation when possible
* new utility methods: enyo.filter and enyo.keys

## AJAX
* enyo.Ajax has new xhrFields property to set properties of the inner XMLHttpRequest object
* enyo.Ajax.xhr property now set with the the inner XMLHttpRequest object during requests
* enyo.JsonpRequest moved from extra library into enyo

## DOM & Events
* enyo.Control no longer renders an orphan node when .render() is called before parent is created
* enyo.Control removed the noDom property, now uses tag: null to indicate that no HTML tag should
  be generated.
* onPostResize event added, fires after onResize to allow for a second round of resize processing
* Enyo-generated onMove events now include delta and direction fields
* flick gestures are now quicker
* generated event method preventNativeDefault renamed to preventDefault
* "tap" events now only generated for primary mouse button
* support methods for CSS transformations were moved from Onyx into enyo.dom
* "drag" events now have xDirection and yDirection fields

## UI
* enyo.RichText now defaults allowHtml to true

## CSS
* .enyo-border-box CSS class added to set box-sizing method to border-box
* .enyo-clip CSS class added to turn on overflow:hidden, used with .enyo-fit
* Enyo now uses sans serif fonts by default: 'Helvetica Neue', 'Nimbus Sans L', Arial, sans-serif

## Scrolling
* scrollers on touch screens now show position thumbnails if "thumb" property set to true
* enyo.Scroller.scrollToControl now has optional alignWithTop argument
* new method enyo.Scroller.scrollToNode
* new methods enyo.Scroller.scrollToBottom & enyo.Scroller.scrollToRight
* scroller now works with mouse wheels in Firefox and Internet Explorer
* scroller now has a "touch" property used to enable touch-optimized scrolling
* onScroll event works with ScrollStrategy.
* Scroller: removed nofit setting and added maxHeight. Sometimes a scroller's height should be dynamic 
  up to a maximum size. We now support this via an explicit maxHeight setting. The value is any valid css 
  style for the max-height property.

## Onyx
* onyx.Slider has a larger touch area for tap positioning
* onyx.ToggleButton: no longer propagates drag events to parents when user drags the toggle
* new .onyx-selected CSS class