#!/bin/bash

# enyoize.sh
#
# A bash shell script that builds a set of docs and includes
# the page header, footer and styles used on the enyojs.com
# site.

./build.sh --template grunt_pandoc-template.html --footer grunt_enyojs-footer.html

exit
