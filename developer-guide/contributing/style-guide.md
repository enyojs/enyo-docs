% Style Guide

We ask that developers respect the following guidelines when contributing pull
requests to Enyo.

## Indentation

The Enyo source code uses leading tabs for indentation of code.

## Blocks

Curly braces should always be used.

```javascript
    // bad
    if (x) foo(); 

    // good
    if (x) {
        foo();
    }
```

Place the opening curly brace at the end of its line and the closing curly brace
on a line by itself.

```javascript
    for (var i=0; i<100; i++) { // opening curly brace at end of line
        ...
    } // closing curly brace on a line by itself
```

In `"else"` clauses, place the keyword `else` (or `else if`) between the braces.

```javascript
    if (x) {
        ...
    } else if (y) {
        ...
    } else {
        ...
    }
```

## Variables

Variables should be declared at the top of functions and should be declared in a single
block (as opposed to multiple `var` statements.

```javascript
    var myVar, myVar2, ...,
        anotherVar;
```

## Punctuation

We use a like-English rule whenever possible.  For example, there should be no
spaces on the inside of associations, and one space after a colon:

```javascript
    var x = (x + 7) * 3;
    var y = {neft: 'zap'};
    var z = [1, 2, 3, (4 + 5)];
```

Use a single space after any keyword, including `function`:

```javascript
    for (var i=0; i<100; i++) {
        ...
    }

    while (x = 3) {
        ... 
    }

    x = function () {
        ...
    }
```

## Quotes

We use single quotes instead of double quotes for quoting strings:

```javascript
    var myString = 'Hello!';
```

## Line Length

Lines should not exceed 100 characters.  Try to split long statements logically so that it
is easy for others to figure out the intent of the statement.  If a comment would make a line
too long, consider placing the comment before the statement it documents rather than to the right.

## Commenting

For code commenting guidelines, see [Documenting Code for the API
Reference](api-reference.html#documenting-code-for-the-api-reference).

## Exports

In general, a module should only export a single kind.
