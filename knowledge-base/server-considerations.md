% Server Considerations

This page documents specific issues seen when hosting Enyo applications on Web
servers with certain configurations.

## mod_pagespeed

Enyo works well with most Web server configurations.  However, the package
loader code does rely on finding and updating specific script tags in your
document in order to work correctly.  The default configuration of the Apache
module [mod_pagespeed](https://developers.google.com/speed/pagespeed/mod) may
alter script tags on pages it serves.  Alterations may include combining
multiple script files and [inlining some of
them](https://developers.google.com/speed/docs/mod_pagespeed/filter-js-inline)
into the HTML document.

For a deployed Bootplate application in which all of the JavaScript has been
reduced to two files, this may not be a problem.  However, during debugging,
when you are loading multiple JavaScript files specified in your `package.js`
files, this *will* cause problems.  To disable the inlining of `mod_pagespeed`,
you can change the `script` tag that pulls in `enyo.js` to have some inline data
in the body of the tag, e.g., changing

        <script src="enyo/enyo.js"></script>

to

        <script src="enyo/enyo.js">NOINLINE</script>