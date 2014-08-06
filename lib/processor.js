
'use strict';

// nodejs
var path = require('path'),
	fs = require('fs');

function Processor () {
	this.init();
}

Processor.prototype = {
	
	/**
	*
	*/
	paths: ['pre_processors', 'post_processors', 'renderers'],
	
	/**
	*
	*/
	init: function () {
		this.paths.forEach(this._resolveModules, this);
	},
	
	/**
	*
	*/
	_resolveModules: function (loc) {
		var filePath = path.resolve(process.cwd(), './lib/', loc),
			files = fs.readdirSync(filePath),
			store = this[loc] = {};
		
		files.forEach(function (file) {
			store[path.basename(file, '.js')] = require(path.resolve(filePath, './' + file));
		});
	},
	
	/**
	* Pre-process a single doclet if an appropriate pre-processor can be found.
	*/
	preProcess: function (doclet) {
		var proc = this.pre_processors;
		
		// there is a special pre-processor to do work common to all doclets
		if (proc.common) proc.common.process(doclet);
		if (proc[doclet.kind]) proc[doclet.kind].process(doclet);
	},
	
	/**
	* Post-process a single doclet if an appropriate post-processor can be found.
	*/
	postProcess: function (doclet) {
		var proc = this.post_processors;
		
		// there is a special pre-processor to do work common to all doclets
		if (proc.common) proc.common.process(doclet);
		if (proc[doclet.kind]) proc[doclet.kind].process(doclet);
	},
	
	/**
	* Render the content for a given doclet if an appropriate renderer is found.
	*/
	render: function (doclet) {
		// there is no common renderer
		var proc = this.renderers[doclet.kind];
		
		// render the content string if we can
		if (proc) proc.process(doclet);
		
		// if we can, try the to post-process the doclet before writing it
		this.postProcess(doclet);
		
		// if there was a renderer for the kind of doclet then it probably has a publish
		// function as well to write the file (although this is optional)
		if (proc && proc.publish) proc.publish(doclet);
	}
	
};

/**
* Export the singleton processor to be used by the template to pre-process all doclets. The actual
* processing takes place by dynamically found processors in the lib/processors directory for the
* template.
*/
module.exports = new Processor();