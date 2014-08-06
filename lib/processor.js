
'use strict';

// nodejs
var path = require('path'),
	fs = require('fs');

// internal
var processors = {};

function Processor () {

	// need to resolve the directory from which to lookup our processors
	 var processorPath = path.resolve(process.cwd(), './lib/processors'),
		 files = fs.readdirSync(processorPath);
	
	 files.forEach(function (file) {
		 processors[path.basename(file, '.js')] = require(path.resolve(processorPath, './' + file));
	 });
}

Processor.prototype = {
	
	/**
	* Process a single doclet if an appropriate processor can be found.
	*/
	process: function (doclet) {
		if (processors[doclet.kind]) processors[doclet.kind].process(doclet);
		else console.warn(
			'Processor.process: could not find an appropriate processor for ' + doclet.kind
		);
	}
	
};

/**
* Export the singleton processor to be used by the template to pre-process all doclets. The actual
* processing takes place by dynamically found processors in the lib/processors directory for the
* template.
*/
module.exports = new Processor();