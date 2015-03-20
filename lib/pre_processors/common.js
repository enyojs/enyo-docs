
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
	else if (doclet.access != 'public' && doclet.access != 'private' && doclet.access != 'protected') doclet.access = 'private';
}

function normalizeMetaPaths (doclet) {
	var meta = doclet.meta,
		tar,
		idx;
	
	// TODO fix this to relative paths...
	if (meta) {
		doclet.source = path.resolve(meta.path, meta.filename);
		doclet.sourceLine = meta.lineno;
		
		// now we need to strip out the part of the path not relevant
		
		// we attempt to get the top-level namespace from the longname when possible
		if (doclet.longname.indexOf('.') > -1) {
			tar = doclet.longname.split('.').shift();
		} else tar = doclet.memberof || doclet.name;
		
		if (tar) {
			idx = doclet.source.indexOf(tar);
			if (idx > -1) {
				doclet.source = doclet.source.slice(idx);
			}
		}
	}
}

function normalizeOutputFilename (doclet) {
	doclet.outputFilename = doclet.longname.replace('<anonymous>', '')
		.replace('~', '') + '.html';
}
