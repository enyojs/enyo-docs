% UI Patterns

The webOS Pattern Language provides a consistent and easy-to-understand
experience for users across multiple applications in a manner appropriate for
TV.  It supports "lean back" experiences with simple and intuitive UI, while
also facilitating the transformation of more traditional "lean forward"
applications into the sort of "lean back" experiences users expect to find on
their TVs.  By using the webOS Pattern Language, you can seamlessly merge your
simple UI with a highly immersive and personalized TV experience, enlivening
your app and making it more engaging.  Before we dig into the individual
patterns, let's look at the topics we'll cover and define our terms.

## Selecting Patterns

* [The Big Picture](patterns/the-big-picture.html)

    The first step in designing your application is to understand The Big
    Picture.  In this section, we review the three personas of typical TV users,
    the type of application you are offering, and how to make the app engaging
    for your users.

* [Application Structure](patterns/app-structure.html)

    Is your app better suited to a flat structure or a hierarchical one?  Here
    we examine this critical question, while also exploring the layers of a
    Moonstone app, and the structure of panels.  Once you've read through this
    material, you should be able to [choose your first
    pattern](patterns/app-structure/panel-patterns.html), either "Always
    Viewing" or "Activity".

* Subpatterns

    After identifying the structure of your application and choosing the
    overarching pattern, you'll choose subpatterns based on the main pattern and
    the scope of the application.  Our discussion of subpatterns is organized
    into the following areas:

    * [Navigation](patterns/navigation.html)
    * [Displaying Data](patterns/displaying-data.html)
    * [Acting on Data](patterns/acting-on-data.html)
    * [User Input](patterns/user-input.html)
    * Notifications

* Custom Patterns

    After you've selected all the appropriate subpatterns from the webOS Pattern
    Language, include your own patterns--ones that you may have developed (or
    may want to create) in order to address any additional recurring issues in
    your application.

    When adding your own patterns, be careful not to include new patterns that
    do not match the character of the subpatterns already selected.  A single
    pattern that clashes with the app pattern language can create confusion for
    the user--and for yourself as you try to make connections between your
    patterns, whatever the virtues of that single pattern may be.  Try to
    recreate your custom patterns using the Moonstone UI Controls, as this will
    help maintain consistency with the pattern language.

* [UI Controls](controls.html)

    Each of the webOS UI Patterns cross-references the UI Controls used in the
    pattern.  Once you have created your Application Pattern Sublanguage by
    selecting the patterns that support your needs, read about the related UI
    Controls to gain a deeper understanding of how they work.

## Definitions

* **Lean Back:** UI experienced at a distance of 10 feet, controlled through a
    remote from the couch.

* **Lean Forward:** UI experienced at a distance of 3 feet, controlled through a
    mouse and keyboard at a desk.

    The relevance of the terms "Lean Back" and "Lean Forward" has come into
    question as new technologies change the way that users engage with their
    devices.  Therefore, we use these terms only as shorthand for describing the
    user's distance from the device, posture, and tools for interacting with the
    device, and not as actual engagement styles that define the user's
    experience.  (For more on this topic, see [Engagement
    Styles](patterns/the-big-picture.html#engagement-styles).)

* **Pattern Language:** A Pattern Language is a structured method of describing
    good design practices that may be used to solve common design problems.  A
    pattern language includes a collection of solutions to common problems, with
    each solution having a name and description.  Each solution describes how it
    fits into the larger design and solves a problem (while enumerating the
    benefits produced).  Each pattern cross-references the building blocks (UI
    Controls) that have been configured to form the pattern solution.

* **Pattern Sublanguage:** A sublanguage is a specialized form of a root or
    parent language, used in the context of a particular domain or subject area.
    A sublanguage is characterized by a specialized vocabulary, semantic
    relationships, and, in many cases, specialized syntax.  A sublanguage may
    also include extensions of the root language.

* **Patterns** vs **Controls**: It is important to have a clear understanding of
    the difference between a pattern and a control.

    A few examples of websOS Moonstone controls are the expandable picker, the
    button, and the input field (see [UI Controls](controls.html) for more
    examples).  All UI controls exist as coded parts of the webOS framework.

    A pattern is the repeated configuration and use of a control (or set of
    controls) to address a particular design problem. A pattern is not code; it
    is simply a design solution for a common problem that application designers
    face.  Subpatterns are patterns that are directly related to a specific
    parent pattern or pattern group; they are intended to solve more specialized
    problems.
