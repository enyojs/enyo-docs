% Enyo 2.5.1-pre.5 Release Notes

Welcome to the `pre.5` preview release of Enyo 2.5.1.  The items listed below
have changed since the `2.5.1-pre.4` release.  (Note that this list is not
comprehensive; see the commit history in GitHub for a complete list of changes.)

Please note that we are currently transitioning to use JSDoc-style commenting
for all APIs in Enyo and its related libraries.  The final 2.5.1 release will
include an API Reference with more features and better performance than the
previous API Viewer.  In the meantime, we appreciate your patience, as the API
Viewer functionality will be temporarily unavailable.

## Detailed Release Notes

### enyo

* In `enyo.Collection`, updated `empty()` to send proper notifications when
    `length` property changes.

* In `MixinSupport.js`, restored ability for mixins to apply other mixins.

* In `touch.js`, fixed issue in which, in a multitouch environment, simultaneous
    touches by two different fingers would be interpreted as a drag gesture.

### moonstone

* Added support for Persian calendar to calendar and date pickers (in
    `moon.Calendar` and `moon.DatePicker`, respectively). As part of this work,
    added new `moon.SimpleMonthPicker` kind, used to handle month selection in
    `moon.Calendar`.  Also added Persian calendar example to "CalendarSample".

* Modified `moon.ProgressBar`, `moon.Slider`, `moon.SimplePicker`, and
    `moon.SimpleIntegerPicker` to behave the same in right-to-left mode as in
    left-to-right mode.

* In `moon.VideoPlayer`, added padding below inline player.

* In `moon.VideoTransportSlider`, fixed issue causing video duration to be
    displayed as `00:00`.

### layout

_No changes._

### spotlight

_No changes._

### onyx

* In `onyx.RangeSlider`, fixed incorrect method name that was causing
    initialization error.

### enyo-ilib

* Updated `iLib` to version `20140807-build-7.0-002`.

### enyo-webos

_No changes._

### bootplate-moonstone

* Bumped versions of submodules.
