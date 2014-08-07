
'use strict';

// internal
var helpers = require('../helpers');

/**
* Render the namespace file content.
*/
exports.process = function (doclet) {
	doclet.content = helpers.render('pages/namespace.html', doclet);
};

/**
* Write the file.
*/
exports.publish = function (doclet) {
	helpers.publish(doclet.outputFilename, doclet.content);
};