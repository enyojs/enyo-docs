
'use strict';

exports.process = function (doclet) {
	
	normalizeAccess(doclet);
	normalizeMetaPaths(doclet);
};

function normalizeAccess (doclet) {
	// ensure that the doclet has an explicit value for access
	if (!doclet.hasOwnProperty('access')) doclet.access = 'public';
	else if (doclet.access != 'private' && doclet.access != 'protected') doclet.access = 'private';
}

function normalizeMetaPaths (doclet) {
	// TODO
}