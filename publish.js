/**
* This file is the required module for the Enyo.js JSDoc3 custom template.
*
* @file
*/
'use strict';

// nodejs built-ins
var util = require('util'),
	fs = require('fs'),
	path = require('path');
	
// internal
var helpers = require('./lib/helpers'),
	proc = require('./lib/processor'),
	resolveLinks = require('./lib/post_processors/common').process;

/**
* This is the entry point for the template. It is passed a TaffyDB database of everything that was
* parsed/interpreted by JSDoc and the options defined for JSDoc.
*/
exports.publish = function (db, opts) {
	
	// before anything else happens we initialize our stateful helpers
	helpers.init(db, opts);

	// for every doclet we have the opportunity to pre-process it before rendering its template
	// this is a separate routine from actually rendering and post-rendering routines (like
	// resolving links)
	db().each(proc.preProcess.bind(proc));

	// now we need to do rendering, post-processing and then publishing (writing) the files
	// note that the post-process routine is actually part of the rendering routine as well
	db().each(proc.render.bind(proc));
	
	// we allow for every kind of doclet to be rendered and post-processed prior to attempting to
	// actually publish the file in case of attempted re-use of some output or other more
	// intricate handling
	db().each(proc.publish.bind(proc));
	
	var namespaces = db({kind: 'namespace', subNamespace: {'!is': true}}).order('longname asec').get(),
		kinds = db({kind: 'class', ui: {isUndefined: true}}).order('longname asec').get(),
		publicKindCount = db({kind: 'class', ui: {isUndefined: true}, access: 'public'}).order('longname asec').count(),
		controls = db({kind: 'class', ui: true}).order('longname asec').get(),
		publicControlCount = db({kind: 'class', ui: true, access: 'public'}).order('longname asec').count(),
		utils = db({kind: 'function', utility: true}).order('longname asec').get(),
		modules = db({kind: 'module'}).order('longname asec').get(),
		mixins = db({kind: 'mixin'}).order('longname asec').get(),
		librariesModules = {},
		librariesPublicModulesCount = {},
		libraries = [],
		librariesMixins = {},
		librariesPublicMixinsCount = {},
		mixLibraries = [],
		prefix = /([^\/]*)/,
		mixinPrefix = /module:([^\/]*)/,
		enyoLocation,
		enyoVersion;

	// Maybe this is cheating, but it does work.  We'll require() the index.js that adds
	// the version.  If we update this later we'll need to update the version.
	// Note: jsdoc can import the package.json file and get the name and version, but I don't know
	// where it puts them. We'll want to explore this option later as it's a lot cleaner.
	enyoLocation = opts._.filter(function(val) {
		return val.match(/\/enyo\/src/);
	})[0];

	if(enyoLocation) {
		enyoVersion = require('../enyo/index.js').version;
	} else {
		enyoVersion = 'unknown';
	}

	modules.forEach(function(module) {
		var lib = module.name.match(prefix)[0];
		if(librariesModules[lib]) {
			librariesModules[lib].push(module);
		} else {
			libraries.push(lib);
			librariesModules[lib] = [module];
			librariesPublicModulesCount[lib] = 0;
		}
		if(module.access == 'public') {
			librariesPublicModulesCount[lib]++;
		}
	});
	
	mixins.forEach(function(mixin) {
		var lib = mixin.longname.match(mixinPrefix)[1];
		if(librariesMixins[lib]) {
			librariesMixins[lib].push(mixin);
		} else {
			mixLibraries.push(lib);
			librariesMixins[lib] = [mixin];
			librariesPublicMixinsCount[lib] = 0;
		}
		if(mixin.access == 'public') {
			librariesPublicMixinsCount[lib]++;
		}
	});
	
	// publish our home (main) section of the site
	helpers.publish('home.html', helpers.render(
		'pages/home.html', {
			namespaces: namespaces,
			kinds: db({kind: 'class'}).order('longname asec').get(),
			version: enyoVersion
		}
	));
	
	// publish the glossary
	helpers.publish('glossary.html', resolveLinks(helpers.render(
		'pages/glossary.html', {
			terms: db({kind: 'glossary'}).order('longname asec').get(),
			version: enyoVersion
		}
	)));
	
	// publish the namespaces page
	helpers.publish('namespaces.html', helpers.render(
		'pages/namespaces.html', {
			namespaces: namespaces,
			version: enyoVersion
		}
	));
	
	// publish the modules page
	helpers.publish('modules.html', resolveLinks(helpers.render(
		'pages/modules.html', {
			libraries: libraries,
			librariesModules: librariesModules,
			librariesPublicModulesCount: librariesPublicModulesCount,
			version: enyoVersion
		}
	)));
	
	// publish the kinds page
	helpers.publish('kinds.html', helpers.render(
		'pages/kinds.html', {
			controls: controls,
			publicControlCount: publicControlCount,
			publicKindCount: publicKindCount,
			kinds: kinds,
			version: enyoVersion
		}
	));
	
	// publish the mixins page
	helpers.publish('mixins.html', resolveLinks(helpers.render(
		'pages/mixins.html', {
			libraries: mixLibraries,
			librariesMixins: librariesMixins,
			librariesPublicMixinsCount: librariesPublicMixinsCount,
			version: enyoVersion
		}
	)));
	
	// publish utilities page
	helpers.publish('utilities.html', resolveLinks(helpers.render(
		'pages/utilities.html', {
			utils: utils,
			version: enyoVersion
		}
	)));
	
	// publish our index
	helpers.publish('index.html', helpers.render(
		'index.html', {
			generated: new Date().toLocaleDateString(),
			version: enyoVersion
		}
	));
	
};
