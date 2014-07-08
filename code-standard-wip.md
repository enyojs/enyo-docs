# Enyo.js Code and Documentation Standard
> This is a WIP document, expect change

## Documentation using JSDoc3






## JavaScript Code Standard/Guide

### @general

* As is consistent with other languages and source-code style standards the maximum number of columns should be `100`. This will lead to consistent looking code and not require horizontal scrolling to read said code.
* Comment whenever possible to explain non-obvious decisions and note their impacts elsewhere. Yes, code should explain itself but in functional programming _obvious_ is often only _really obvious_ when being written…even for the original author.
* Comments should be __above__ the code they are commenting and never to the side (`100` columns...).
* __TABS__ are used instead of ~~__spaces__~~. How your editor presents them is your choice but use __TABS__.
	* Some editors (e.g. TextMate) tend to auto-indent empty lines and this should be avoided whether care is taken when writing code or using a cleanup script before issuing a Pull Request. A __blank line__ should be completely __blank__ (no invisible characters).
* A `function ()` declaration should __always__ have a space between the word `function` and its `()` and an additional space between its `()` and its opening bracket `{`.
* When testing the type of a variable end-developers are handed useful tools such as `enyo.isFunction`, `enyo.isArray`, etc, but core developers should rely on raw tests for performance and consistency at the framework level:

```javascript
// function
if (typeof fn == 'function') ...

// object
if (typeof obj == 'object') ...

// number
if (typeof num == 'number') ...

// array is special because we can't use typeof we must ensure it exists or
// instanceof will fail
if (ary && ary instanceof Array) ...

// string
if (typeof str == 'string') ...

// boolean
if (typeof bool == 'boolean') ...
```

* For explicit type checks such as boolean or number values always use the `===` operator:

```javascript
// zero check
if (num === 0) ...

// null check
if (obj === null) ...

// undefined check
if (obj === undefined) ...

// in cases to check for both null and undefined it can be shortended to
if (obj != null) ...
```
* If the final statement of a function is an assignment but the return value of the function is the assigned value it is __ok__ to do this in a single line:
```javascript
function assignSomething (value) {
	
	// both assigns the value and returns the value
	return (this.something = value);
	
}
```

### @files

* Each file's content should be considered an encapsulated module with control over what it exposes.
* Each file's content should be wrapped in an immediately-invoked-function-expression (IIFE). This protects scope and is future proof as to  where the file can be executed with the advantage of possible optimization when minified and compiled. We will only have to export/expose exactly what should be for any given file's content. It should have the following structure:

```javascript
(function (enyo, scope) {

	// content here…
	
})(enyo, this);
```

> It should be noted that this will be expected to change (potentially) in the future with full modular support but if all files are correctly treated this way it becomes a minimal issue to update the wrapper if necessary and we still gain the benefits mentioned above.

* Each file should end with the last line of source code. __No extra line is necessary__. This is primarily for consistency and there is no advantage to having the extra line.

### @strings

* All static string declarations should use a single quote `'`.
* Multiline string concatenation should end the line with the `+` operator and when necessary include the space on the upper line end as follows:

```javascript
var myLongString = 'This is the beginning of a very, very ' +
	'long string that has several lines worth of pretty useless ' +
	'text associated with it for filler';		
```

### @variables

* Variable declarations should be made as early in the scope as necessary even for potentially unused variables. This includes iterator variables used in `for` and `for…in` loops.
* Variables should begin with an _alpha_ character and be lowercase with camel-case unless it is a constructor in which case it should be capitalized with camel-case.
	* Anonymous constructors _do not need to be capitalized_.
* When declaring multiple variables they should take the standard style. Empty variable declarations should be the last ones declared. Constructors (capitalized variables) and large Array or Object declarations should be separated from the initial group:

```javascript
(function (enyo, scope) {
	
	var one = 'value',
		two = 'value',
		three = 'value',
		four,
		five;
	
	// separate constructor assignments
	var Model = enyo.Model,
		Collection = enyo.Collection;
	
	// separate large Object declarations
	var options = {
		op1: true,
		op2: false,
		op3: true,
		op4: 'default'
	};
	
})(enyo, this);
```
* Avoid using single-character variable names with the exception being iterators.
	* Try and be reasonable and consistent, for example:
	
```javascript
// in cases where it is a single string it could be
var str = 'my string';

// if there were more than one it becomes imperative to clearly
// identify which string is which
var firstName = 'Jimmy',
	lastName = 'Johnson';

// like with string, if there is only one object it could be
var obj = {};

// but with more we need to clearly identify them
var base = {original: true},
	// another common variable name is cpy, etc...
	cpy = enyo.clone(base);
```
> It is important to note that we are moving in the direction of modularity and in the (_near_…) future will be grouping functionality and kinds into modules exposing only what is necessary. In some cases it is our practice moving forward to separate out dependencies of a _module_ when possible now, as follows:

```javascript
(function (enyo, scope) {

	// treat enyo.kind as a module
	var kind = enyo.kind;
		
	// treat any constructor or mixin as a module ensuring it is loaded in
	// the correct order (this is good) from its package
	var Model = enyo.Model,
		ObserverSupport = enyo.ObserverSupport;

})(enyo, this);
```

* When assigning __Objects__, if there are only a few, short properties assigned keep it inline. Otherwise the __Object__ assignment should be separate from the group declarations for clarity and each property should have its own line:

```javascript
// an empty or short Object declaration is inline
var empty = {},
	small = {one: 'one', two: 'two'};

// larger Object declarations are lined up for readability
var large = {
	one: 'one',
	two: 'two',
	three: 'three',
	four: 'four',
	five: 'five'
};
```

* When assigning __Arrays__, if there are only a few, short properties allocated or it is empty keep it inline. Otherwise the __Array__ assignment should be separate from the group declarations for clarity and each property should have its own line:

```javascript
// an empty or short Array declaration is inline
var empty = [],
	short = ['one', 'two', 'three'];

// larger Array declarations are lined up for readability
var large = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six'
];
```


### @control-structures

* Variables used in `for` and `for…in` loops should be declared before the structure at the top of the local scope.
* Assignment in `for` loops should have a space between the variable, the operator and the value being assigned or compared and for consistency with increment with the `++` operator before the variable (when applicable):

```javascript
var i;

for (i = 0; i < 1000; ++i) {
	// …
}
```
* __Do not use a `for…in` loop for an Array__.
* __Framework level code should use `for` and `for…in` loops when possible for the performance benefit__, however, there are exceptions such as overloaded procedures, shared code sections or certain Array operations requiring advanced methods where the benefits do not outweigh the implementation benefits.
	* When using iterator methods (e.g. `forEach`) internal code should use the prototype method and not the exposed Enyo version as it is included for backwards compatibility but adds an extra context to the CallStack:

```javascript
// do this
someArray.forEach(function (ln, i) { /* … */ });

// not this
enyo.forEach(someArray, function (ln, i) { /* … */ });
```
* For `if...else if...else` control structures there shouldn't be a space between the parenthesis. Complex `if` conditions should usually be able to fit on a single line but in rare cases should be broken onto multiple lines:

```javascript
if (
	(first && last) &&
	!middle
) {
	// met the condition...
}
```
* For simple `if...else if...else` conditions they should be inlined without unnecessary brackets

```javascript
if (true) callThisFunc();
else callThatFunc();
```

* Unless broken by a comment describing a difference in the path of an `if...else if...else` control structure, the next path should be inlined with the end of the previous section:

```javascript
// example of normal flow
if (/* something */) {
	// first path...
} else if (/* something else */) {
	// second path...
} else {
	// final path...
}

// example of commented flow
if (/* something */) {
	// first path...
}

// some additional comment about this condition
else {
	// final path...
}
```

### @kind

* Each __public kind__ should be declared in its own file.
	* This rule does not apply to internally used kinds that are only exposed to their given scope
* Every property or method should have a space between it and the previous property (if any) and at the very least be documented as `@private` otherwise be fully documented.
* Private methods should avoid using the `_` (underscore) as their property name and instead make a scoped method that is called by individual instances of the kind when necessary.
* Private properties with initial values should use the `_` (underscore) but note that for performance reasons minimize the number of unnecessarily declared private properties and assign them at runtime when necessary.

```javascript
(function (enyo, scope) {

	// enyo.kind is treated as its own module
	var kind = enyo.kind;

	// constructors are separated but treated as modules
	var Model = enyo.Model;
	
	// remember to use proper documentation for all kinds and exposed
	// API methods or properties
	
	/**
	* @class enyo.NewModelType
	* @extends enyo.Model
	* @public
	*/
	kind(
		/** @lends enyo.NewModelType.prototype */ {
		
		/**
		* @private
		*/
		name: 'enyo.NewModelType',

		/**
		* @private
		*/
		kind: Model
	});
	
})(enyo, this);
```