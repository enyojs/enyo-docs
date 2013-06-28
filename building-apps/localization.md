# Localization

## ilib and enyo-ilib

To meet its localization needs, Enyo uses a new open source library called
[ilib](http://www.jedlsoft.com/).  If you have worked with Enyo in the past, you
may remember that it previously used a library called `g11n`, which has been
released to the open source community as part of the
[enyojs](https://github.com/enyojs) project.  `g11n` has been deprecated and
should not be used in new Enyo projects going forward.

The good news for those who've worked with `g11n` is that, in several ways,
`ilib` is quite similar.  For example, the `$L("string")` syntax is still used
for string localization.  Also, while the two libraries' APIs for formatting
dates, times, and numbers are somewhat different, the functionality offered is
largely the same.

These similarities make sense when you consider that `ilib` is maintained by
Edwin Hoogerbeets, the original author of `g11n`.  Enyo app developers will be
pleased to note that Edwin has created a compatibility library,
[enyo-ilib](https://github.com/enyojs/enyo-ilib), to wrap `ilib`'s functionality
for easy access from Enyo apps.

Like `g11n`, `enyo-ilib` is designed to go in your application's `lib` folder.
You may obtain the code from GitHub; enter your `lib` folder and use the
following command:

        git clone https://github.com/enyojs/enyo-ilib.git

The `ilib` code is included within `enyo-lib`, so you do not need to obtain it
separately.

Visit the `ilib` Web site for a complete [API
reference](http://www.jedlsoft.com/jedlsoft/ilib/2.0/jsdoc/) and interactive
demo](http://www.jedlsoft.com/demo/).
