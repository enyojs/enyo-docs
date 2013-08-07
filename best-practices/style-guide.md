% Style Guide

We ask that developers respect the following guidelines when contributing pull
requests to Enyo.

## Indentation

The Enyo source code uses leading tabs for indentation of code.

## Blocks

Curly braces should always be used.

        // bad
        if (x) foo(); 

        // good
        if (x) {
            foo();
        }

Place the opening curly brace at the end of its line and the closing curly brace
on a line by itself.

        for (var i=0; i<100; i++) { // opening curly brace at end of line
            ...
        } // closing curly brace on a line by itself


In `"else"` clauses, place the keyword `else` (or `else if`) between the braces.

        if (x) {
            ...
        } else if (y) {
            ...
        } else {
            ...
        }

## Punctuation

We use a like-English rule whenever possible.  For example, there should be no
spaces on the inside of associations, and one space after a colon:

        var x = (x + 7) * 3;
        var y = {neft: "zap"};
        var z = [1, 2, 3, (4 + 5)];

Use a single space after any keyword, except `function`:

        for (var i=0; i<100; i++) {
            ...
        }

        while (x = 3) {
            ... 
        }

        x = function() {
            ...
        }

## Commenting

For code commenting guidelines, see [Documenting Code for the API
Viewer](documenting-code.html).