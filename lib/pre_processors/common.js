
'use strict';

var path = require('path');

exports.process = function (doclet) {
	
	normalizeAccess(doclet);
	normalizeMetaPaths(doclet);
	normalizeOutputFilename(doclet);
};

function normalizeAccess (doclet) {
	// ensure that the doclet has an explicit value for access
	if (!doclet.hasOwnProperty('access')) doclet.access = 'public';
	else if (doclet.access != 'private' && doclet.access != 'protected') doclet.access = 'private';
}

function normalizeMetaPaths (doclet) {
	var meta = doclet.meta;
	
	// TODO fix this to relative paths...
	if (meta) {
		doclet.source = path.resolve(meta.path, meta.filename);
		doclet.sourceLine = meta.lineno;
	}
}

function normalizeOutputFilename (doclet) {
	doclet.outputFilename = doclet.longname.replace('<anonymous>', '')
		.replace('~', '') + '.html';
}