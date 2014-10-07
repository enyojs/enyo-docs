% Enyo 2.3.0-rc.24 to 2.5.0 Performance Notes

Enyo 2.5.0 includes numerous changes designed to improve performance, including
(but not limited to) the following:

* Observers and bindings have been reworked to use smaller, more efficient code,
    improving execution time (while also adding new functionality).

- In `moon.Panels`, the `pushPanels()` method no longer forces all panels to be
    resized, which greatly improves performance when working with a large number
    of panels.

- Fittable layout kinds have been rewritten to take advantage of the CSS3
    `flex-box` properties on platforms that support them (including webOS).
    This reduces the number of layout operations that the browser must perform.

- Spotlight focus highlighting is now "muted" during panel transitions; this
    reduces the likelihood that paint operations will occur during a transition,
    thereby improving the transition frame rate.

- The `onTransitionFinish` event was firing too early, causing poor performance
    during panel transitions when tasks were tied to the event.  This behavior
    has now been corrected.

- Marquees no longer unintentionally promote all younger siblings to a new
    composition layer, forcing slow re-layouts on start and stop.

- Implemented new technique for `moon.Panel` collapse/expand transition,
    improving frame rate.

- The `moon.Panels` show/hide transition animation (triggered by the edge
    handle) has been improved, resulting in better frame rate.

- Implemented new technique to improve `moon.ListActions` animation, resulting
    in improved frame rate; also fixed a number of animation-related bugs.

- Redesigned state-change for `moon.ToggleItem` to include transition animation,
    while also refactoring to use CSS instead of costly image assets.

- Rewrote `moon.Spinner`, using DOM, transforms, and keyframe animations to
    ensure that the spinner doesn't stop, even when the main CPU thread is busy.

- Provided a way to perform hardware-accelerated sprite animations.

**See also:** [Enyo 2.3.0-rc.24 to 2.5.0 Release Notes](release-2.3-to-2.5.html)
