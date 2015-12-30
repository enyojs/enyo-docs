% Lazy Loading

Lazy loading is a process in which an application loads modules dynamically, as
they are needed, instead of loading all of its modules at launch time.  This can
improve app launch performance, since applications typically have some modules
that are not needed at launch.  It is up to the app developer to determine which
modules should be loaded at launch time and which may be loaded at runtime; the
ideal balance will vary from application to application.

In general, if all of an app's modules are lazy-loaded, the initial launch
time will be as fast as possible, but navigation to different views in the app
will be subject to delays as the necessary modules are loaded on the fly.
Conversely, if none of an app's modules are lazy-loaded (which is the case in
current apps), the initial launch time will be relatively slow, but navigation
within the app will be as fast as possible, since everything is already loaded.

## Deciding What to Lazy-Load

To reiterate, it is up to the app developer to determine which parts of an app
should be lazy-loaded.  In general, anything that is part of the initial view
of an app should not be lazy-loaded.  Kinds that are only rendered upon user
interaction, or when needed, are good candidates for lazy-loading.  These kinds
include the sub-panels of an app.

The lazy loading system is smart enough to realize that components within a
lazy-loaded module do not need to be loaded until the module referencing them
is loaded.  No special care is needed to make sub-components load lazily, unless
you wish to further refine the loading process to defer sub-components until
they are needed.

A good first-pass at optimizing an app for lazy loading starts with inspecting
the main view.  Any kinds declared within the `components` block of the main
kind are likely to be needed when the app is rendered, and should not be
lazy-loaded.  Modules for kinds that are only referenced when switching app
state (e.g., when pushing a new panel) are good candidates for lazy loading.
Continue the process by reviewing the `components` blocks within the
lazy-loaded modules.

After making these changes, it is important to measure the results.  Verify that
lazy loading does not cause the most common user interactions of your app to
degrade, and that there is an observable decrease in app startup time.

## Syntax

To implement lazy loading for a given module, replace the usual `require()` call
with a `request()` call, passing in the same module path.  When the module needs
to be loaded, invoke the `then()` method of the request.

Before (without lazy loading)

```javascript
    var moduleA = require('path/to/moduleA');
    this.createComponent({kind: moduleA});
```

After (with lazy loading)

```javascript
    var requestModuleA = request('path/to/moduleA');

    requestModuleA.then(this.bindSafely(function (moduleA) {
        this.createComponent({kind: moduleA});
    }));
```

Notice that we are passing a callback function as the argument to `then()`.
This callback will be passed as the sole parameter for the loaded module, which
may be used in the same way that a required module would be used.

## Lazy Loading Application Architecture

Now that we've learned the syntax for implementing lazy loading via requested
(not required) modules, what will this look like in a typical application?  A
lot will depend on the specific details of your application architecture, but
there are some techniques that most developers should find generally useful.

Let's look at one basic scenario, in which an application view needs to load a
subsequent view in response to a user action.

If the original code looks like this...

```
// ViewA (i.e., 'viewA.js')

var
	kind = require('enyo/kind');
	
var
	Panel = require('moonstone-extra/Panel'),
	Button = require('moonstone/Button');
	
var
	ViewB = require('path/to/ViewB'); // other view
	
module.exports = kind({
	kind: Panel,
	events: {
		onChangePanel: ''
	},
	components: [
		{kind: Button, content: 'Next', ontap: 'handleTap'}
	],
	handleTap: function () {
		this.doChangePanel({nextPanel: ViewB});
	}
});
```

```
// Main view (i.e., 'main.js')

var
	kind = require('enyo/kind');
	
var
	Panels = require('moonstone-extra/Panels');
	
var
	ViewA = require('path/to/ViewA'); // initial view
	
module.exports = kind({
	kind: Panels,
	handlers: {
		onChangePanel: 'handleChangePanel'
	},
	components: [
		{kind: ViewA}
	],
	handleChangePanel: function (sender, ev) {
		this.pushPanel({kind: ev.nextPanel});
	}
});
```

...then the lazy-loading version might look like this...

```
// ViewA (i.e., 'viewA.js')

var
	kind = require('enyo/kind');
	
var
	Panel = require('moonstone-extra/Panel'),
	Button = require('moonstone/Button');
	
var
	ViewB = request('path/to/ViewB'); // other view
	
module.exports = kind({
	kind: Panel,
	events: {
		onChangePanel: ''
	},
	components: [
		{kind: Button, content: 'Next', ontap: 'handleTap'}
	],
	handleTap: function () {
		this.doChangePanel({nextPanel: ViewB});
	}
});
```

```
// Main view (i.e., 'main.js')

var
	kind = require('enyo/kind');
	
var
	Panels = require('moonstone-extra/Panels');
	
var
	ViewA = require('path/to/ViewA'); // initial view
	
module.exports = kind({
	kind: Panels,
	handlers: {
		onChangePanel: 'handleChangePanel'
	},
	components: [
		{kind: ViewA}
	],
	handleChangePanel: function (sender, ev) {
		ev.nextPanel.then(this.bindSafely(function (nextPanel) {
			this.pushPanel({kind: nextPanel});
		}));
	}
});
```

If the application has a general routing/navigation mechanism, it might make
more sense to keep references to all of the possible lazy-loaded views, and
load them via a single mechanism.

For example:

```
// Navigation kind

var
	kind = require('enyo/kind'),
	Component = require('enyo/Component');

var myViews = {
	viewA: request('path/to/viewA'),
	viewB: request('path/to/viewB'),
	viewC: request('path/to/viewC'),
	viewD: request('path/to/viewD'),
	viewE: request('path/to/viewE'),
	viewF: request('path/to/viewF')
};

module.exports = kind({
	kind: Component,
	
	navigateTo: function (viewName) {
		var view = myViews[viewName];
		
		view.then(this.bindSafely(function (loadedView) {
			this.pushView(loadedView);
		}));
	},
	
	pushView: function (view) {
		// create kind and push into view
	}
});
```

What if, in the process of tweaking the balance between initial launch time and
app UI latency, you decide that loading the `viewA` module at launch time is
optimal?  In this case, simply `require()` the `viewA` module to cause it to be
loaded statically:

```
// Navigation kind

var
	kind = require('enyo/kind'),
	Component = require('enyo/Component');

require('path/to/viewA');

var myViews = {
	viewA: request('path/to/' + 'viewA'),	// Obfuscated name is needed
	viewB: request('path/to/viewB'),
	viewC: request('path/to/viewC'),
	viewD: request('path/to/viewD'),
	viewE: request('path/to/viewE'),
	viewF: request('path/to/viewF')
};

module.exports = kind({
	kind: Component,
	
	navigateTo: function (viewName) {
		var view = myViews[viewName];
		
		view.then(this.bindSafely(function (loadedView) {
			this.pushView(loadedView);
		}));
	},
	
	pushView: function (view) {
		// create kind and push into view
	}
);
```

If a module is requested that is already loaded (either statically or
dynamically), the `request()` function will return immediately; the module will
not be reloaded.

**NOTE:** The `enyo-dev` build tool will not allow the same module to be
requested and required in the same file.  You must use a variable or obfuscate
the module name so that the analyzer in the tool will not raise an error.

## Closing Thoughts

While the preceding examples involve views, please keep in mind that you may
also implement lazy loading for non-view modules using the same process.
