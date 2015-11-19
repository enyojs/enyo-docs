#!/bin/bash

# build.sh
#
# A bash shell script that reads in a list of markdown (.md) files from a
# manifest ('outline.txt' by default) and uses Pandoc to convert them to HTML;
# the resulting files are written to an output directory ('../output/developer-guide' by
# default). If the 'assets' subdirectory exists, its contents are copied to the
# output directory.
#
# If a value is supplied for the optional --variant parameter (e.g., 'webos'),
# the script will look for an outline file suffixed with the variant name
# ('outline-webos.txt'), provide special handling for any similarly-named
# markdown files ('index-webos.md', etc.), and create output in a directory
# named for the variant ('output-webos').

docSourceRoot=( $(pwd) )

variant=''
variantLength=0
isVariant=false
outputDir=${docSourceRoot}/../output/developer-guide
outlineFile=${docSourceRoot}/outline.txt
templateFile=_pandoc-template.html

while test $# -gt 0; do
	case "$1" in
		--template)
			shift
			templateFile=$1
			shift
			;;
		--less)
			shift
			lessFile=$1
			shift
			;;
		--head)
			shift
			headFilePath=${docSourceRoot}/$1
			shift
			;;
		--header)
			shift
			headerFilePath=${docSourceRoot}/$1
			shift
			;;
		--footer)
			shift
			footerFilePath=${docSourceRoot}/$1
			shift
			;;
		--variant)
			shift
			variant=$1
			variantLength=${#variant}
			isVariant=true
			outlineFile=${docSourceRoot}/outline-${variant}.txt
			outputDir=${docSourceRoot}/output-${variant}
			shift
			;;
		*)
			break
			;;
	esac
done

pandocOptions=""
if  ! [ -z "$headFilePath" ] && [ -f $headFilePath ]; then
	pandocOptions="${pandocOptions} -H ${headFilePath}"
fi

if ! [ -z "$headerFilePath" ] && [ -f $headerFilePath ]; then
	pandocOptions="${pandocOptions} -B ${headerFilePath}"
fi

if ! [ -z "$footerFilePath" ] && [ -f $footerFilePath ]; then
	pandocOptions="${pandocOptions} -A ${footerFilePath}"
fi

declare -a outlineArray
index=0
foundEmptyLine=0

# read in all lines from outline file, until we reach the end or an empty line
while read line; do
	if [ $((foundEmptyLine)) -eq 0 ]; then
		myLine=$(echo $line)
#		echo "myLine: $myLine"
		strlen=$(echo ${#myLine})
#		echo "strlen: $strlen"
		if [ $strlen -gt "0" ]; then
#			echo "index: $index"
			outlineArray[$index]=$myLine
			let index++
		else
#			echo "found empty line"
			foundEmptyLine=1
			break
		fi
	fi
done <$outlineFile
len=${#outlineArray[*]}

# remove, then recreate output directory
rm -rf ${outputDir}
mkdir -p ${outputDir}

# create output subdirectories
x=0
previousNameToTest=
while [ $x -lt $len ]; do
	nameToTest=${outlineArray[$x]%/*.md}
	if [[ $nameToTest != $previousNameToTest ]]; then
		potentialDirName=$docSourceRoot/$nameToTest
		if [ -d $potentialDirName ]; then
			mkdir -p $outputDir/$nameToTest
#			echo "creating directory ${outputDir}/${nameToTest}"
		fi
	fi
	let x++
	previousNameToTest=$nameToTest
done

# calculate output file paths and generate HTML files
y=0
while [ $y -lt $len ]; do
	sourceFilePath=${docSourceRoot}/${outlineArray[$y]}
	if [ -f ${sourceFilePath} ]; then
		lenSourceFilePath=${#sourceFilePath}
		pathExt=${sourceFilePath:lenSourceFilePath-3:3}
		if [ ${pathExt} == ".md" ]; then
			targetFilePath=$outputDir/${outlineArray[$y]%.md}.html
			if [ ${isVariant} ]; then
				variantExt="-${variant}.md"
				variantExtLength=${#variantExt}
#				echo $variantExt
#				echo $variantExtLength
				if [ ${sourceFilePath:lenSourceFilePath-variantExtLength:variantExtLength} == ${variantExt} ]; then
#					echo "variant file: $sourceFilePath"
					targetFilePath=$outputDir/${outlineArray[$y]%$variantExt}.html
				fi
			fi
#			echo "targetFilePath: ${targetFilePath}"
			# Create HTML file
#			pandoc -s $pandocOptions -f markdown -t html -o $targetFilePath $sourceFilePath
			pandoc --template=$templateFile $pandocOptions -f markdown -t html -o $targetFilePath $sourceFilePath
		fi
	else
		echo "File not found: ${sourceFilePath}"
	fi
	let y++
done

# Copy over the assets directory, if it exists

assetsSourceDir=${docSourceRoot}/assets

if [ -d $assetsSourceDir ]; then
	assetsTargetDir=$outputDir/assets
	mkdir -p $assetsTargetDir
	cp $assetsSourceDir/* $assetsTargetDir/
fi

# Copy raw CSS and compile LESS

lessSourceDir=${docSourceRoot}/css

# Create CSS target directory
cssTargetDir=$outputDir/css
mkdir -p $cssTargetDir

# Copy over any raw CSS
for f in $lessSourceDir/*.css; do
	# Check whether the glob gets expanded to existing files.
	# If not, $f here will be exactly the pattern above
	# and the exists test will evaluate to false.
	# You can find all kinds of neat stuff like this
	# on the Internet.
	[ -e "$f" ] && cp $lessSourceDir/*.css $cssTargetDir/
	break
done

# Compile LESS into CSS
if [ -d $lessSourceDir ] && [ ${#lessFile} -gt 0 ]; then
	lessc $lessSourceDir/$lessFile $cssTargetDir/${lessFile%.*}.css
fi

exit
