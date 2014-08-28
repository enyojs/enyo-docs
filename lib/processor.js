
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
	* Post-process (after render but before file-writing) a single doclet if an appropriate
	* post-processor can be found.
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
		var proc = this.renderers;
		
		if (proc.common) proc.common.process(doclet);
		if (proc[doclet.kind]) proc[doclet.kind].process(doclet);
		
		// if we can, try the to post-process the doclet before writing it
		this.postProcess(doclet);
	},
	
	/**
	* Attempt to publish the rendered content for a doclet if an appropriate renderer is found
	* and also has the publish method.
	*/
	publish: function (doclet) {
		// there is no common renderer
		var proc = this.renderers[doclet.kind];
		
		if (proc && proc.publish) proc.publish(doclet);
	}
	
};

/**
* Export the singleton processor to be used by the template to pre-process all doclets. The actual
* processing takes place by dynamically found processors in the lib/processors directory for the
* template.
*/
module.exports = new Processor();