
'use strict';

// internal
var helpers = require('../helpers');

/**
* Render the mixin file content.
*/
exports.process = function (doclet) {
	doclet.content = helpers.render('partials/mixin.html', doclet);
};

/**
* Write the file.
*/
exports.publish = function (doclet) {
	helpers.publish(doclet.outputFilename, doclet.content);
};