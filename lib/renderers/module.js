
'use strict';

// internal
var helpers = require('../helpers');

/**
* Render the module file content.
*/
exports.process = function (doclet) {
	doclet.content = helpers.render('pages/module.html', doclet);
};

/**
* Write the file.
*/
exports.publish = function (doclet) {
	helpers.publish(doclet.outputFilename, doclet.content);
};
