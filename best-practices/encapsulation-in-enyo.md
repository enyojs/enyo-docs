% Encapsulation in Enyo

One of the most important features that Enyo brings to Web development is the
ability to encapsulate useful blocks of presentation code and associated logic
into reusable components with defined interfaces.  While you are completely free
to structure your code as you see best, we have prepared a set of recommended
practices that we think will help you make the most of Enyo's encapsulation
model.

## Send events up and call functions down

In order to provide good functional boundaries that encourage reuse, you should
generally follow the rule that children of a component should have no _a priori_
knowledge of their parents.  For example, a function call like
`this.owner.doSomething()` is strongly discouraged, since it tightly binds the
child to a specific owner, restricting its ability to be reused in new
scenarios.  

Instead, Enyo encourages the use of events as the mechanism for children to
communicate with their parents.  By declaring events such as
`onSomethingHappened` (sent by calling `doSomethingHappened()`), children bubble
events up to their owner, allowing the owner to decide whether handling
`onSomethingHappened` is important to its current use case.

Conversely, parents _always_ have _a priori_ knowledge of their children--they
have to create them, after all, usually by declaring them in the `components`
block.  Thus, tight binding from the parent to the child is normal.  Parents
should communicate with their children by calling functions defined in their
APIs.  Although JavaScript lacks a clean way to enforce the separation between
public API and private functions, we use the special `//* @public` comment
before function definitions to designate public APIs.  These comments serve as a
guide for the API viewer tool when displaying the public API.

Finally, you should never make assumptions about how a component you are using
is built internally.  For example, say you are using a widget that includes a
title and descriptive text, and you want to change the color of the title.
Calling `this.$.myWidget.$.title.applyStyle("color", "red")` would clearly break
encapsulation, since you are assuming a lot about the construction of
`myWidget` (i.e., that its title component is called `title` and that applying a
style on that component will change the color of the text).  Instead, `myWidget`
should provide an API that its owner may call to make this change, such as
`this.$.myWidget.setTitleColor("red")`.

In summary: "Send events up and call functions down."

## Keep related code close

Because writing an app usually involves refactoring code as the app grows, you
will often find yourself creating useful chunks of functionality that can be
reused in other apps.  We find it helpful to organize code into self-contained
units that are easy to move around as whole, useful chunks (including whatever
view, model, control, CSS, etc. is required for that chunk to do its job), as
opposed to organizing files by function.

As an analogy, think of all the parts that make up a chest of drawers that you
might buy from Ikea--panels, screws, washers, handles, and so on.  There are two
ways in which Ikea could distribute the parts.  They could give you all of the
screws in one bag, all the washers in another, and so on, and to build a new
drawer you would take some materials from each bag.  Alternatively, they could
give you one bag per drawer, with each bag containing everything needed to build
the drawer.  We find this latter model to be better for code refactoring and
reuse, as it makes it easier to identify one drawer's worth of material and move
it to any location where you need to make a new drawer.

In more concrete terms, let's say you are developing an app with a login screen,
a friend list, and a friend detail view.  Although you could organize your code
like this...

        css/              // Not preferred
            Login.css
            FriendList.css
            FriendDetails.css
        controllers/
            LoginController.js
            FriendListController.js
            FriendDetailsController.js
        views/
            LoginView.js
            FriendListView.js
            FriendListItem.js
            FriendDetailsView.js

...we tend to prefer a structure like this:

        Login/            // Preferred
            Login.css
            Login.js
            package.js
        FriendList/
            FriendList.css
            FriendList.js
            FriendListItem.js
            package.js
        FriendDetails/
            FriendDetails.css
            FriendDetails.js
            package.js

With the latter structure, if you find a use for a `FriendDetails` view in
another app you are making, it's a trivial amount of work to separate that piece
from the others and use it in the new app.

## Separate into packages for reuse

Enyo provides a higher level of encapsulation at the file level as well, via
`package.js` files and the `enyo.depends()` loader mechanism.  This is
especially useful for third-party components and libraries, since it allows the
author to specify all the JavaScript and CSS files a component or library
depends on.  As a result, the user does not have to worry about the library's
internal structure, but can simply include the path to its top-level
`package.js` and then use the library's public kinds and APIs.

As your app grows larger, you may find it useful to split it into multiple
packages.  Rather than maintain one top-level `package.js` file that references
all the source and CSS in your app, you can separate chunks of functionality
into individual packages, which are then referenced by the top-level
`package.js`.  While this is ultimately a matter of personal preference, a good
rule of thumb is to create separate packages for independently useful sets of
kinds, such as `FriendList` or `FriendDetails` in the example above.

**Additional Reading**

* [Event Handling](../key-concepts/event-handling.html)
* [Structuring Your Project](structuring-your-project.html)