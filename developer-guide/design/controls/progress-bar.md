% Progress Bar

## About

A Progress Bar is a control in the form of a horizontal bar that shows the
linear progress of a process.

## API Reference

[moon.ProgressBar]($api/#/kind/moon.ProgressBar)

## Behavior and States

### Behavior

A Progress Bar consists of a horizontal Bar and Progress that fills the Bar.
There is also an optional third component that may be used to indicate
buffering.

During media playback, the Bar represents the total length of a given piece of
content.  Progress fills the Bar to reflect the current playback position.  The
state of Progress may be illustrated with a popup button that indicates either a
percentage (%) of completion or an amount of time (elapsed or remaining).

The Bar remains static during playback, while Progress advances with the
content.  Progress may be animated, showing continuous progression, or
unanimated, increasing in chunks.

A third, optional, bar is used to display buffering.  It should be used to show
what has been queued but not yet processed or viewed.  This is most relevant in
scenarios such as video playback.

Text may be added within a Tool Tip to indicate status (e.g., 35%), and buttons
may be added to provide extra functionality (e.g., Stop/Cancel a download).
Outside of such buttons, there are no user interactions with Progress Bars.

### States

The Progress Bar has no states.

### Sizing

The Bar dictates the overall width of the control; it has a default width of 300
pixels.  This width is configurable, but the height of the Progress Bar is not.
Progress starts at 0 and grows until it reaches the same width as the Bar; the
buffering bar works in the same manner.

## Illustration

![](../../assets/dg-controls-progress-bar.png)
