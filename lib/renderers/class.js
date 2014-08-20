
'use strict';

// internal
var helpers = require('../helpers');

/**
* Render the class file content.
*/
exports.process = function (doclet) {
	doclet.content = helpers.render('partials/kind.html', doclet);
};

/**
* Write the file.
*/
exports.publish = function (doclet) {
	helpers.publish(doclet.outputFilename, doclet.content);
};