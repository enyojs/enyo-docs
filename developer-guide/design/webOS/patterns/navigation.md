% Navigation

Before exploring the Moonstone Navigation Patterns, app designers should have a
clear understanding of the webOS navigation philosophy and how the Moonstone
controls and app structure enforce and support Remote Interactions, App
Navigation, Panel Navigation, and Historical vs. Hierarchical Navigation.

## Navigation Philosophy

Navigation allows users to locate content and features, making it an essential
part of any application.  It is extremely important to follow a consistent
pattern with respect to the location and behavior of navigational controls.

Set and meet expectations. If it is unclear whether clicking on something will
take users to a new page, they may be hesitant to click on it.  They may not
want to leave the current view, or may be concerned with how long it will take
to load the next view.  This hesitation can lead to users' not finding what they
are looking for, not appreciating the value of the app, and, ultimately, not
returning to use your app again.

Persistent navigation is a useful tool that flattens hierarchical app structures
by providing the user with direct access to the top-level categories.  However,
we recommended that applications for TV follow the simple [Hub and
Spoke](navigation/hub-and-spoke.html) navigation pattern.  Simplified objectives
and minimal onscreen UI help to make for a successful "lean back" experience.

Bring content to the surface as soon as possible, as this helps to keep the
experience simple and personal.  Make content discovery easy by displaying
recommended and favorited items in the top level of the application.

Aim to create a shallow application structure, as this promotes a comfortable
level of location awareness for the user.  Try to make 80% of the most common
use cases achievable in one view.  However, do not do this at the cost of
overloading the experience.  If a view is not easily scanned or navigated, the
balance between information and usability has been lost.  Less information is
better.

## Remote Interactions

When designing apps for the TV, it is important that they work with both
possible remote controls--the LG Magic Remote and the Conventional Remote.
The webOS patterns are optimized to work best with the LG Magic Remote, which
provides unique interactivity with its pointer and scroll wheel.  The features
of the conventional remote, such as the 5-way control, must also be taken into
account for those users who do not have the Magic Remote.

## Application Edges

Several of the webOS Patterns use the edges of the screen to invoke UI with the
Magic Remote pointer (similar to a gesture).  The right edge of the screen is
used to hide and show panels when the basement is being used for fullscreen
content.  The left edge of the screen may be used to hide and show the Left
Drawer for [global navigation](navigation/global-navigation.html).  While
viewing panels, the top edge may be used to hide and show the Top Drawer for
[feature navigation](navigation/feature-navigation.html).  While viewing
fullscreen content in the basement, the top edge is used to show content details
and the bottom edge is used for playback controls.

Because not every app will make use of all of these patterns, you may wish to
use an edge for something else.  Since these patterns are used across many apps,
an expectation has been set of what the user might find when pointing to an
edge.  Keep these expectations in mind when choosing to use an edge for
something new.

## Panel Navigation

A significant consideration when designing navigation is the readability of a
panel.  Headers, subheaders, sub-subheaders, and breadcrumbs should all be
descriptive, providing context as to where users are and what they should do.

With the Magic Remote, navigating a panel is done with a simple point and click.
For conventional remotes, the Moonstone Panel controls contain built-in logic to
simplify 5-way navigation within panels and across panels.

When navigating within a panel using the 5-way, focus will usually start in the
body or the action bar.  Left and Right presses will move focus through the
action bar.  Pressing Up from the action bar will move focus to a top drawer, if
one exists; pressing Down will move focus to the body.

Pressing Left from the leftmost item in the Action Bar or Body will act as a
Back keypress, moving the focus to the previous panel.  Pressing Right from the
rightmost item in the Action Bar or Body will either move focus to the next
panel (if the next panel is already open and viewable) or to the "hide panels"
indicator (if there is content loaded in the basement).

## Historical Navigation vs. Hierarchical Navigation

Historical navigation refers to a back navigation policy that returns users to
where they were last.  Hierarchical navigation refers to a back navigation
policy that takes the user back up through the hierarchy of the application.

On their own, panels have no built-in concept of hierarchy or history.  It is up
to the application to decide which navigation policy is best.  Both options have
their problems.  The most obvious problem with hierarchical navigation is that
back navigation does not always return users to where they were last.  The most
obvious problem with historical navigation is that, if the user continues to
open new panels from the previous panel, it can become tedious to navigate back
through all the history created. 

We recommend that applications follow a historical navigation policy.  This
means that when new content is loaded, it should load in a new panel (the next
panel) rather than replace the content in the current panel.

While we believe that there is more value in supporting users' expectations of
location and where back navigation will take them than there is in minimizing
the depth of the navigation history, this does not mean that minimizing depth is
unimportant.  We have provided several patterns that help reduce the depth of
history or the need to open new panels.  If these patterns are used correctly,
users who find themselves 5 to 10 panels deep can quickly and easily navigate
back through the panels via breadcrumbs, by pressing the Left key through each
panel, or by pressing the Back button on the remote.  A user can also press and
hold the Back button to jump back to the first panel.

## Related Topics

Patterns: [Hub and Spoke](navigation/hub-and-spoke.html),
[Global Navigation](navigation/global-navigation.html),
[Feature Navigation](navigation/feature-navigation.html),
Search, Step Navigation, Jump to Anchor
