% Localization

In this document, we look at how globalization/localization works in Enyo
applications.

## iLib

To meet its localization needs, Enyo uses a new open source library called
[iLib](http://www.jedlsoft.com/).  Those who have worked with Enyo in the past
may recall that it previously used a library called `g11n`, which has since been
released to the open source community as part of the
[enyojs](https://github.com/enyojs) project.  `g11n` has been deprecated and
should not be used in new Enyo projects going forward.

The good news for those familiar with `g11n` is that, in a number of ways,
`iLib` is quite similar.  For example, the `$L("string")` syntax is still used
for string localization.  Also, while the two libraries' APIs for formatting
dates, times, and numbers are somewhat different, the functionality offered is
largely the same.

This makes sense when you consider that `iLib` and `g11n` were created by the
same person, Edwin Hoogerbeets, who previously worked on webOS at HP, and has
returned to work on webOS for TV at LG's Silicon Valley Lab.

## enyo-ilib

As an Enyo application developer, you will not work with `iLib` directly, but
rather with [enyo-ilib](https://github.com/enyojs/enyo-ilib), a compatibility
library that wraps `iLib`'s functionality for easy access from Enyo apps.

`enyo-ilib` is included in the `bootplate-moonstone` template by default; if you
base your app on that template, you won't need to obtain `enyo-ilib` separately.
If, however, you decide not to use the template, you may obtain `enyo-ilib` by
issuing the following command in your Git client:

```
    git clone https://github.com/enyojs/enyo-ilib.git
```

Then, to make the `ilib` namespace available to your app, add the `enyo-ilib`
directory to your app's `package.js` file, e.g.:

```javascript
    enyo.depends({
        "$lib/enyo-ilib/",
        <other libraries>,
        ...
    });
```

(Again, you won't need to do this if you use Bootplate.)

## Using enyo-ilib

### Locales

#### iLib.Locale

The concept of the locale is central to the functioning of `iLib`, as it is
with any localization tool.  Locales are specified using [IETF language
tags](http://en.wikipedia.org/wiki/IETF_language_tag) according to the BCP-47
convention.  As you work with `enyo-ilib`, you'll find that most locales are
specified as a string consisting of a two-letter lowercase language code,
followed by a hyphen, followed by a a two-letter uppercase region code, e.g.:

```
    "ko-KR"  // Korean (language), Korea (region)
    "en-US"  // English (language), United States (region)
```

Note, however, that some locales also require the script to be specified (i.e.,
when a language is commonly written in more than one script).

```
    "rs-Latn-RS" // Serbian (language), Latin (script), Serbia (region)
```

In Enyo application code, you'll work with instances of `iLib`'s `Locale`
class:

```javascript
    var locale = new ilib.Locale("ko-KR");
```

If you create a `Locale` instance without passing in a string identifier,
you'll get an object representing the current locale.

```javascript
    var curLocale = new ilib.Locale();
```

If no locale was previously set as the default, the system default locale from
the JavaScript engine is used.  In a WebKit environment (such as webOS for TV),
this will be the `navigator.language` property; in a Node.js environment, it
will be the `webos.locales.UI` property.

#### iLib.LocaleInfo

To obtain detailed information about a locale, you may create an instance of
`ilib.LocaleInfo`.

```javascript
    var li = new ilib.LocaleInfo({
        locale: "ru-RU"
    });
```

The `LocaleInfo` object provides the following information:

* The script(s) used to write the language
* The first day of the week in calendars
* The default paper sizes
* The currency
* The default time zone
* The measurement units system (`'metric'`, `'uscustomary'`, or `'imperial'`)
* The default calendar type (usually `'gregorian'`)
* The default clock hours, 12 or 24
* The default rounding mode

On webOS for TV, information for locales other than the current UI locale must
be retrieved asynchronously via the LS2 bus:

```javascript
    enyo.kind({
        name: "LocalePref",
        kind: "enyo.Component",
        components: [{
            kind: "enyo.LS2Service",
            service: "palm://com.webos.settingsservice",
            name: "getCurrentLanguage",
            method: "getSystemSettings",
            onResponse: "getCurrentLanguageResponse"
        }],
        getCurrentLanguageResponse: function(inSender, innResponse) {
            var inResponse = innResponse.data;
            var localeInfo = inResponse.localeInfo;
            var STTlocale = localeInfo.locales.STT;  // speech-to-text locale (voice recognition)
        },
        makeLS2Call: function() {
            this.$.getCurrentLanguage.call({keys:["localeInfo"]});
        }
    });
    var localePref = new LocalePref();
    localePref.makeLS2Call();
```

### Strings

#### Resource Bundles

`ilib.ResBundle`, the resource bundle class, represents a set of translated
strings.  Each app has its own resource bundle.  These bundles are loaded
dynamically, with each one having a name and locale.

The locale may be specified as an option in the constructor.

```javascript
    var rb = new ilib.ResBundle({locale: "ko-KR"});
```

In practical terms, `ResBundle`'s most important method is `getString()`.

```javascript
    var str = rb.getString("My Label");
```

The actual data contained in the bundle is stored under the application's
`resources` directory.  Within `resources` is a hierarchy of subdirectories
named for locales.  `iLib` reads translated strings from `strings.json` files
found in these directories.

In the layered structure of the locale directories, values from deeper levels
override those from nearer the surface, as in the following example:

```
    resources/
        en/
            strings.json - shared strings for all English
            appinfo.json - application description
            CA/
                strings.json - only strings special to Canada
            GB/
                strings.json - only strings special to Great Britain
```

For the `en-GB` locale, if a string value is defined in both
`/resources/en/strings.json` and `/resources/en/GB/strings.json`, the value from
the latter (more-specific) file will override the value from the former file. 

It's worth noting that, in addition to strings, other localized files (such as
`appinfo.json`) may also be placed in these hierarchical directories, with their
data following the same rules of precedence.  In the case of `appinfo.json`, the
locale-specific files will typically include values for "title", "keywords", and
"description".  The other properties will keep the values inherited from the
app's top-level `appinfo.json`.

#### $L()

`$L()` is a convenience function wrapping `ilib.ResBundle`.

Each translatable string in your application should be wrapped in a call to
`$L()`.  For example:

```javascript
    {
        kind: "text",
        label: $L("First Name:"),
        ...
    }
```

You will need to extract the strings inside the `$L()` calls in your source
code and write them out to a `strings.json` file for each locale.  (Most likely
you'll want to create a script to do this.)

The `strings.json` files should contain the translations in JSON format, i.e.:

```javascript
    {
        "source string1": "translated string1",
        "source string2": "translated string2",
        ...
    } 
```

Many localization houses are able to provide translations in this format.

The string returned from a call to `$L()` will be the translated string for the
current UI locale.  If a different locale or a bundle with a different name is
needed, use `ilib.ResBundle` directly instead of `$L()`.

#### String Formatting

`ilib.String` is used to format strings.  Its `format()` method allows for
interpolation of named parameters into the string.  The following syntax is
recommended:

```javascript
    var template = $L.rb.getString("There are {n} objects.");
    var str = template.format({n: 15});
```

`str` now has the value `"There are 15 objects."`

Note that we are populating `template` by calling `getString()` on the
localized resource bundle `$L.rb`.  This is because `format()` accepts an
`ilib.String` object, but not an intrinsic JavaScript string.  (A call to
`getString()` on a resource bundle returns an instance of `ilib.String`, while
a call to `$L()` returns an intrinsic JavaScript string.)

`ilib.String` has the same methods as an intrinsic string, and in many cases may
be used as a substitute.  For those places that require an intrinsic string, you
must call the `toString()` method to convert the `ilib.String` to an intrinsic
string.

#### Handling Plurals

`ilib.String` uses the `formatChoice()` method to handle plurals.  This allows
translators to adjust strings to handle plurals properly for their respective
languages.

```javascript
    var number = 3;
    var template = rb.getString( "0#There are no objects.|1#There is 1 object.|#There are {n} objects.");
    var str = template.formatChoice(number, {n: number});
```

`str` now has the value `"There are 3 objects."`

`formatChoice()` also supports number classes ("zero", "one", "two", "few" and
"many") for languages with complex rules for pluralization, such as Russian or
Serbian.

```javascript
    var template = rb.getString( "0#There are no objects.|few#There are a few ({n}) objects.|#There are many objects. ({n})");
```

### Dates and Times

The formatting of dates and times can differ widely from one locale to the next:

```
------------------------------------
 Locale    Format         
--------- --------------------------
 en-US     Mo 11/12/2012 2:30pm

 en-CA     Mo 12/11/2012 2:30 PM

 de-DE     14:30 Mo 12.11.2012

 zh-CN     2012-11-12周一下午2:30

 it-IT     Lu 12/11/2012 14.30
------------------------------------
```

In `iLib`, the `ilib.DateFmt` class is used to format dates and times.  The
constructor accepts various options, which control how the formatter behaves.
Once you create a `DateFmt` instance, you may call its `format()` method as many
times as you want to format dates according to the given set of options.

```javascript
    var fmt = new ilib.DateFmt();
    var d = fmt.format(date);
```

Among the options you may specify are the following:

* Which locale to use
* Whether to format the date only, time only, or both date and time together
* Which components of the date or time to format (e.g., only format the month
    and year components of the date)
* Whether to use a 12-hour clock, a 24-hour clock, or the default clock for the
    locale
* Whether to use short, medium, long, or full-length text for components that
    use words (e.g., Sunday may be expressed as "S", "Su", "Sun", or "Sunday")
* Which time zone to format for

```javascript
    var fmt = new ilib.DateFmt({ locale: "tr-TR",
        type: "date", date: "dmy", timezone: "Europe/Istanbul"
    });
```

#### Calendar Dates

`iLib` also supports the formatting of dates in multiple calendaring systems,
with the default being the familiar Gregorian calendar.

To create a date, you may call the factory method or use the calendar date
directly, e.g.:

```javascript
    var now = new ilib.Date.HebrewDate();
```

This is equivalent to the following factory method call:

```javascript
    var now = ilib.Date.newInstance({type: "hebrew"});
```

Dates may be converted between calendars via a "Julian Day" number.  A Julian
Day is the number of whole days and fractions of a day since the beginning of
the epoch on 24 November -4713 BCE (Gregorian):

```javascript
    var now = new ilib.Date.GregDate();
    // now.year is currently 2013
    var jd = now.getJulianDay();
    var hebrewDate = new ilib.Date.HebrewDate({julianday: jd});
    // hebrewDate.year is 5773
```

To format a date in a non-Gregorian Calendar, follow the pattern of creating a
`DateFmt` object and calling `format()` on it. 

```javascript
    var fmt = new ilib.DateFmt({
        length: "full",
        locale: "en-US",
        calendar: "hebrew"
    });
    var d = fmt.format(date);
```

The value of `d` is `"Adar 27, 5773 11:47PM PDT"`.

Information about the most popular calendars may be retrieved using the
`ilib.Cal.*` classes.  Use `ilib.Calendar.newInstance()` as a factory method to
create the other calendar types.

```javascript
    var cal = ilib.Calendar.newInstance({
        // looks up calendar for this locale
        locale: "nl-NL"
    });
    var days = cal.getMonLength(2, year);
```

`days` is `28` in regular years and `29` in leap years.

#### Ranges and Durations

`ilib.DateRngFmt` may be used to format a date/time range--a period of time with
a specific start point and end point.  As with the other formatter classes, the
final output (e.g., `'Mar 11-14, 2013'`) will depend on the options supplied to
the formatter.

Similarly, `ilib.DurFmt` lets you format durations--how long things take to
happen.  Again, you may customize the output (e.g., `'36 hours, 24 minutes, and
37 seconds'`) by setting the formatter's options.

#### Time Zones

In many countries, the federal government determines the time zone.  In some
countries, including the United States, this may be overridden by smaller
jurisdictions such as states/provinces, counties, towns, etc.  Time zones are
specified using the IANA convention of "continent/city" (e.g.,
`'America/Los_Angeles'` or `'Asia/Seoul'`).

`ilib.TimeZone` represents information about a particular time zone.  Instances
may be passed to other classes such as `ilib.DateFmt`, although the specifier
string itself is also accepted.

```javascript
    var tz = new ilib.TimeZone({
        id: "America/Los_Angeles"
    });
    var offset = tz.getOffset(new ilib.Date.newInstance());
```

`offset` is now `{h: -8, m: 0}`.

### Numeric Values

The formatting of numeric values--in numbers, currency, and percentages--is
another locale-sensitive process.

```
--------------------------------------------------------
 Locale    Float           Currency       Percentage
--------- --------------- -------------- ---------------
 en-US     1,234,567.89    $1,234.56      57.2%
 
 de-DE     1.234.567,89    1.234,56 €     57,2 %

 fr-FR     1 234 567,89    1 234,56 €     57,2%

 tr-TR     1.234.567,89    1.234,56 TL    % 57,2
--------------------------------------------------------
```

As shown in the following examples, `iLib` handles each of these cases using
`ilib.NumFmt`.

#### Numbers

```javascript
    var fmt = new ilib.NumFmt({
        locale: "de-DE"
    });
    var str = fmt.format(1234567.89);
```

`str` is now `'1.234.567,89'`.

#### Currency

```javascript
    var fmt = new ilib.NumFmt({
        style: "currency",
        currency: "EUR",
        locale: "de-DE"
    });
    var amount = fmt.format(1234.56289);
```

`amount` is now `'1.234,56 €'`.

#### Percentages

```javascript
    var fmt = new ilib.NumFmt({
        style: "percentage",
        maxFractionDigits: 2,
        locale: "tr-TR"
    });
    var percentString = fmt.format(0.893453);
```

`percentString` is now `'% 89,34'`.

## Locale-Specific CSS

When the `enyo-ilib` library is loaded into your app, it automatically applies
some CSS classes to the `<BODY>` tag of your DOM.  You can use these to write
locale-specific CSS override classes using the "dot" specifier.  These classes
may indicate things such as whether the locale uses a right-to-left orientation
or whether it uses non-Latin fonts.

Classes added to the body are:

* `enyo-locale-non-latin`, if the locale uses a non-Latin font

* `enyo-locale-right-to-left`, if the locale is oriented right-to-left (in the
    absence of this class, the default orientation is left-to-right)

* `enyo-locale-non-italic`, if the locale uses a script that is not typically
    italicized, such as Chinese or Thai.  (You may also use this in your own
    classes to enable or disable italicization.)

The following classes allow you to switch functionality based on the language,
script, or region of the current UI locale:

* `enyo-locale-<language>`
* `enyo-locale-<script>`
* `enyo-locale-<region>`
* `enyo-locale-<language>-<script>`
* `enyo-locale-<language>-<region>`
* `enyo-locale-<language>-<script>-<region>`

Here's an example from the Moonstone library in which locale-specific CSS is
used to turn on right-to-left orientation for a widget:

```css
    .moon-contextual-popup, .enyo.moon-contextual-popup {
        min-height: 100px;
        min-width: 100px;
        ...
    }
    .enyo-locale-right-to-left .moon-contextual-popup {
        direction: rtl;
    }
```

## Responding to Locale Changes on webOS for TV

In Enyo apps running on webOS for TV, you can listen for locale changes and
perform actions when a change occurs.  The locale change event is implemented
as an `enyo.Signal`. You may register a callback method to be called when the
signal is raised.

### Changes in Your App

First, you must include the [enyo-webos](http://github.com/enyojs/enyo-webos)
library in your `package.js` file in order to receive the locale changed signal.

```javascript
    enyo.depends({
        "$lib/enyo-ilib/",
        "$lib/enyo-webos/",
        <other libraries>,
        ...
    });
```

Then, in your main app kind, add the following to the `components` block:

```javascript
    {kind: "enyo.Signals", onwebOSLocaleChange: "handleLocaleChangeEvent"}
```

Finally, define the `handleLocaleChangeEvent()` function itself:

```javascript
    handleLocaleChangeEvent: function() {
        // Check if the locale actually changed. Save the current locale in
        // your create method to compare against.
        if (ilib && ilib.getLocale() !== this.iLibLocale) {
            this.saveStateIfNecessary();
            if (this.canReload()) {
                window.location && window.location.reload();
            }
        }
    }
```

The app will now reload and pick up the new locale.  This will cause all of
your `$L()` strings to be re-evaluated and all locale-sensitive classes to be
re-instantiated from scratch.

(For more information on `enyo/Signals`, see the documentation on [Event
Handling](../getting-started/event-handling.html)).

### Caveats

There are some situations in which you should refuse to reload in the locale
change signal handler:

* If your input fields or internal state contain unsaved data.  Do not reload
    unless you first save this data somehow and then reload it afterwards.
    Losing user-entered data is not good!  You can record the locale change in
    your signal handler, and then reload once the data is saved properly.

* If the new locale is one that your app does not yet support.

Also note that an app may pass parameters to itself via
`window.location.reload()` if the state to be saved is very small.

It is a good practice to reload and return to the screen that the app was
showing before the reload, if at all possible.

## Additional Reading

`iLib` contains a host of other features that we have not covered in this
introductory discussion.  For the complete set of online documentation, see
<http://docs.jedlsoft.com/ilib/jsdoc/>.
