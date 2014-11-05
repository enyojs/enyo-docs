#!/bin/bash

# enyoize.sh
#
# A bash shell script that builds a set of docs and includes
# the page header, footer and styles used on the enyojs.com
# site.

./build.sh --head _enyojs-head.html --header _enyojs-header.html --footer _enyojs-footer.html --less main.less

exit
