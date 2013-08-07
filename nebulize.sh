#!/bin/bash

# nebulize.sh
#
# A bash shell script that uses Pandoc to convert all the markdown (.md) files
# in the current directory (and its sudirectories) to HTML; the resulting
# files are written to an output directory (./output). If the 'assets'
# subdirectory exists, its contents are recursively copied to the output
# directory.

declare -a rawOutput
declare -a directoryList

basePath="$( cd "$( dirname "$0" )" && pwd )" 
#echo $basePath

rawOutput=( $(tree -dfi) )

# echo ${rawOutput[@]}
# echo ${#rawOutput[@]}

for rawString in ${rawOutput[@]}
do
	# Only deal with tree output that begins with '.'
	if [[ ${rawString:0:1} == "." ]]; then
		# Exclude 'assets' and 'output' directories
		if [[ ${rawString:1:7} != "/assets" && ${rawString:1:8} != "/assets/" && ${rawString:1:7} != "/output" && ${rawString:1:8} != "/output/" ]]; then
			pathToTest=${basePath}${rawString:1}
			if [[ -d ${pathToTest} ]]; then
				directoryList=(${directoryList[@]} "$pathToTest")
			fi
		fi
	fi
done

outputBasePath=${basePath}/output
cssFilePath=${basePath}/docs.css

rm -rf ${outputBasePath}

for sourceDir in ${directoryList[@]}
do
	# Determine whether this directory contains any .md files
	mdFileCount="$( ls ${sourceDir}/*.md | wc -l )"
	if [[ $mdFileCount -gt 0 ]]; then
		outputDir=${sourceDir/$basePath/$outputBasePath}
		mkdir -p $outputDir

		cd ${sourceDir}
		for mdFile in *.md
		do
			if [[ $mdFile != "README.md" ]]; then
				# Calculate paths and generate HTML file
				sourceFilePath=$sourceDir/$mdFile
				targetFilePath=$outputDir/${mdFile%.md}.html
				if [ -f $cssFilePath ]; then
					pandoc -s -H $cssFilePath -f markdown -t html -o $targetFilePath $sourceFilePath
				else
					pandoc -s -f markdown -t html -o $targetFilePath $sourceFilePath
				fi
			fi
		done
	fi
done

# Copy over the assets directory, if it exists

assetsSourceDir=${basePath}/assets

if [ -d $assetsSourceDir ]; then
	assetsTargetDir=$outputBasePath/assets
	mkdir -p $assetsTargetDir
	cp $assetsSourceDir/* $assetsTargetDir/
fi

exit
