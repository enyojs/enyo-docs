
'use strict';

// internal
var helpers = require('../helpers');

/**
* Render the class file content.
*/
exports.process = function (doclet) {
	resolveInherited(doclet);
	
	doclet.content = helpers.render('partials/kind.html', doclet);
};

/**
* Write the file.
*/
exports.publish = function (doclet) {
	helpers.publish(doclet.outputFilename, doclet.content);
};

function resolveInherited(doclet) {
	
	// we convert these to link format so that once they are rendered they will be resolved as
	// valid internal links at the appropriate time
	doclet.inheritedProperties.forEach(function (prop) {
		prop.inherits = '{@link ' + prop.inherits + '}';
	});
	doclet.inheritedMethods.forEach(function (method) {
		method.inherits = '{@link ' + method.inherits + '}';
	});
}