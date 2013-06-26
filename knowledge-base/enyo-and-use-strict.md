# Enyo and use strict

## Why we don't work with "use strict"

Introduced in ECMAScript 5, the "use strict" pragma is a useful tool for
limiting the code that will run in a JavaScript virtual machine to ensure
compliance with certain practices that are considered to be safe.  John Resig's
[article on strict mode](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
provides some helpful background.

While we recognize the merits of strict mode, one of the language features that
it eliminates is the use of `arguments.callee`.  `arguments` is a special
variable, defined in every function, that provides access to the arguments used
to call the function.  This is often used to support variable-argument lists.
JavaScript also provides properties on the `arguments` object, namely `caller`
and `callee`, which are no longer accessible in strict mode.  `arguments.caller`
provides access to the function that called your code, while `arguments.callee`
provides access to your own function object.

We currently do our "call our superkind's implementation" via the code

        this.inherited(arguments, ...);

If you look in Enyo's `Oop.js`, the `inherited` method is implemented as follows:

        enyo.kind.inherited = function(args, newArgs) {
            return args.callee._inherited.apply(this, newArgs || args);
        };

This method looks at the `callee` property of the `arguments` object you passed
in to find a special property called `_inherited`.  When you create a new kind,
one of the magic bits we do is iterate through all the methods you've defined on
the kind and add this property pointing to the same-named method on the parent
kind.  If we didn't have access to `arguments.callee`, you'd have to change all
of your method definitions to have a second name, e.g.,

        onSetupItem: function onSetupItem(...) { }

and the call to `this.inherited` would look like

        this.inherited(onSetupItem, arguments);

That's a pretty big code change, and it's not one we're ready to make at this
time.

If you're wondering why strict mode removes these things, there are some good
reasons.  One big one is that having access to the function that called you
makes it easier to break out of your own code.  This is important if you have
sensitive code that's calling code that may be less trustworthy, so you don't
want it to be able to inspect your state.  JavaScript has a module pattern in
which you can have variables only be visible to functions declared in the same
scope, but with `arguments.caller`, you can pass a callback into one of those
and that callback can then go and look around in the closure.
`arguments.callee` can be a problem because it lets you pass your own scope to
others; [this message from es-discuss](https://mail.mozilla.org/pipermail/es-discuss/2009-March/008971.html)
summarizes the problem.