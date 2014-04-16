# Enyo.js Code and Documentation Standard
> This is a WIP document, expect change

## Documentation using JSDoc3






## JavaScript Code Standard/Guide

### @general

* As is consistent with other languages and source-code style standards the maximum number of columns should be `80`. This will lead to consistent looking code and not require horizontal scrolling to read said code.
* Scopes should begin and end with a blank line for readability.
* Comment whenever possible to explain non-obvious decisions and note their impacts elsewhere. Yes, code should explain itself but in functional programming _obvious_ is often only _really obvious_ when being written…even for the original author.
* __TABS__ are used instead of ~~__spaces__~~. How your editor presents them is your choice but use __TABS__.
	* Some editors (e.g. TextMate) tend to auto-indent empty lines and this should be avoided whether care is taken when writing code or using a cleanup script before issuing a Pull Request. A __blank line__ should be completely __blank__ (no invisible characters).

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
* When declaring multiple variables they should take the comma-first style for easier diffing, minimizing line-impact in future additions and to assist in finding and avoiding errors. Empty variable declarations should be the last ones declared with the semi-colon (`;`) on the same column as the `var` statement. Constructors (capitalized variables) and large Array or Object declarations should be separated from the initial group:

```javascript
(function (enyo, scope) {
	
	var one = 'value'
		, two = 'value'
		, three = 'value'
		, four
		, five
	;
	
	// separate constructor assignments
	var Model = enyo.Model
		, Collection = enyo.Collection
	;
	
	// separate large Object declarations
	var options =
		{ op1: true
		, op2: false
		, op3: true
		, op4: 'default'
		}
	;
	
})(enyo, this);
```
* Avoid using single-character variable names with the exception being iterators.
	* Try and be reasonable and consistent, for example:
	
```javascript
// in cases where it is a single string it could be
var str = 'my string';

// if there were more than one it becomes imperative to clearly
// identify which string is which
var firstName = 'Jimmy'
	, lastName = 'Johnson'
;

// like with string, if there is only one object it could be
var obj = {};

// but with more we need to clearly identify them
var base = {original: true}
	// another common variable name is cpy, etc...
	, cpy = enyo.clone(base)
;
```
> It is important to note that we are moving in the direction of modularity and in the (_near_…) future will be grouping functionality and kinds into modules exposing only what is necessary. In some cases it is our practice moving forward to separate out dependencies of a _module_ when possible now, as follows:

```javascript
(function (enyo, scope) {

	// treat enyo.kind as a module
	var kind = enyo.kind;
		
	// treat any constructor or mixin as a module ensuring it is loaded in
	// the correct order (this is good) from its package
	var Model = enyo.Model
		, ObserverSupport = enyo.ObserverSupport
	;

})(enyo, this);
```

* When assigning __Objects__, if there are only a few, short properties assigned keep it inline. Otherwise the __Object__ assignment should be separate from the group declarations for clarity and each property should have its own line:

```javascript
// an empty or short Object declaration is inline
var empty = {}
	, small = {one: 'one', two: 'two'}
;

// larger Object declarations are lined up for readability and it becomes obvious
// when an error has been introduced as well as lines can be added without bothering
// the line above them
var large =
	{ one: 'one'
	, two: 'two'
	, three: 'three'
	, four: 'four'
	, five: 'five'
	}
;
```

* When assigning __Arrays__, if there are only a few, short properties allocated or it is empty keep it inline. Otherwise the __Array__ assignment should be separate from the group declarations for clarity and each property should have its own line:

```javascript
// an empty or short Array declaration is inline
var empty = []
	, short = ['one', 'two', 'three']
;

// larger Array declarations are lined up for readability and it becomes obvious
// when an error has been introduced as well as lines can be added without bothering
// the line above them
var large =
	[ 'one'
	, 'two'
	, 'three'
	, 'four'
	, 'five'
	, 'six'
	]
;
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

### @kind

* Each __public kind__ should be declared in its own file.
	* This rule does not apply to internally used kinds that are only exposed to their given scope
* Every property or method should have a space between it and the previous property (if any) and at the very least be documented as `@private` otherwise be fully documented.

```javascript
(function (enyo, scope) {

	// enyo.kind is treated as its own module
	var kind = enyo.kind;

	// constructors are separated but treated as modules
	var Model = enyo.Model;
	
	// remember to use proper documentation for all kinds and exposed
	// API methods or properties
	
	/**
		@public
		@class enyo.NewModelType
		@extends enyo.Model
	*/
	kind(
		/** @lends enyo.NewModelType.prototype */ {
		
		/**
			@private
		*/
		name: 'enyo.NewModelType',

		/**
			@private
		*/
		kind: Model
	});
	
})(enyo, this);
```