% Enyo 2.3.0-rc.24 to 2.5.0 UX Notes

Enyo 2.5.0 includes numerous enhancements to the user experience, including (but
not limited to) the following:

* Assets

    + Bitmap assets have been replaced with font-based icons in all Moonstone
        controls to improve theming support and reduce the library's asset
        footprint.

* Contextual Popup Button

    + Added gray arrow to deactivated state indicator.

    + Added option to stop focus at specified edge instead of closing popup.

    + Pressing a contextual popup button now toggles the popup's open/closed
        state.

* Dialog

    + Added support for new extra-small header component to be used in popups.

* Expandable Input

    + Updated behavior so that a 5-way Down keypress while in the open state
        causes the input's content to be submitted and the focus to shift
        downward (if applicable).  Input content will also be submitted in
        response to a click outside of the control.

* Expandable Picker

    + Added support for multiple selection.

* Focus

    + Changed behavior during transition from pointer to 5-way navigation.
        Previously, if you pressed an arrow while in pointer mode, focus would
        return to the last-focused clickable object.  Now focus will move to the
        nearest clickable object in the direction of the 5-way keypress.

* Header

    + Added support for new extra-small header.

    + Added support for displaying image in header.

    + Adapted ListActions to automatically expand small header to standard
        header size when opened.

    + Removed time-delayed auto-marquee behavior from header title. Now the
        title will only marquee on hover.

    + Moved Drawer position down by 2px.

* Image Grid

    + Implemented new visual design for multiple selection--now the grey
        checkmark will not be displayed when no item is selected.

* Light Theme

    + Updated color used to indicate "deactivated" state.

* Panels

    + Added API to allow the specification of a branding image, to be displayed
        in the lower-left corner of the Panels control.

* Toggle Button

    + Added a radio button to more clearly indicate the control's "active"
        state.

    + Added support for customizing the text labels for "On" and "Off".

* Video Feedback

    + Fast Forward and Rewind feedback are now shown as lower-case.

**See also:** [Enyo 2.3.0-rc.24 to 2.5.0 Release Notes](release-2.3-to-2.5.html)
