
'use strict';

// nodejs
var path = require('path'),
	fs = require('fs-extra');

// third-party
var nunjucks = require('nunjucks');

function Helpers () {
	// a shared-state singleton that can be used by any module of the template
	
	// configure nunjucks with our known templates - this could become dynamic via runtime options
	// if done later (in init)
	nunjucks.configure(path.resolve(process.cwd(), './templates'));
}

Helpers.prototype = {
	
	_paths: [],
	
	/**
	* Called once by the template early in the process to give it a reference to the original
	* options hash and the database so helper methods don't need to be passed those parameters
	* every time they are called. Also other various tid-bit initialization tasks.
	*/
	init: function (db, opts) {
		this.db = db;
		this.opts = opts;
		this.outputRootPath = path.resolve(process.cwd(), opts.destination);
		this.initDatabase();
	},
	
	/**
	* Any general database normalization tasks should be accomplished here before it is accessed
	* for specific doclet related processing. Anything we can remove from the database speeds up
	* the template significantly and the overhead of checking things over and over later.
	*/
	initDatabase: function () {
		var db = this.db;
		
		// remove extraneous entries from the database, it is possible during future revision we
		// could have debugging that would actually analyze these items to see what we're missing
		db({undocumented: true}).remove();
		db({ignore: true}).remove();
		db({memberof: '<anonymous>'}).remove();
	},
	
	/**
	* Attempt to resolve a template by name from nunjucks and apply the given scope to it, return
	* the rendered content.
	*/
	render: function (nom, scop) {
		return nunjucks.render(nom, scop);
	},
	
	/**
	*
	*/
	publish: function (filenom, content) {
		fs.outputFileSync(path.resolve(this.outputRootPath, filenom), content);
	}
};

/**
* Export the singleton instance (strictly for convenience). Methods to be part of the helpers
* singleton can add methods to the prototype object and safely use the `this` property to refer
* to the helpers instance.
*/
module.exports = new Helpers();