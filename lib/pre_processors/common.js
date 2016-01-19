
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
		
		// extract library name, if possible
		if(doclet.inherited) {	// Inherited properties original module will be in inherits
			tar = doclet.inherits;
		} else {				// Otherwise, get the module it's from
			tar = doclet.memberof || doclet.name;
		}
		tar = tar.replace('module:','').split('/')[0];
		
		if (tar) {
			idx = doclet.source.indexOf(tar);
			if (idx > -1) {
				doclet.source = doclet.source.slice(idx);
			} else if (!doclet.isGlossary) {
				console.log('Warning: Potentially mis-documented item: ' + doclet.name + ' in ' + doclet.source);
			}
		}
	}
}

function normalizeOutputFilename (doclet) {
	doclet.outputFilename = doclet.longname.replace('<anonymous>', '')
		.replace('~', '/') + '.html';
}
