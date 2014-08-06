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
	proc = require('./lib/processor');

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
	// note that the post-process routine is actually part of the rendering routine as well as
	// the actual publishing portion of the process
	db().each(proc.render.bind(proc));
};
