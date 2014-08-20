
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveOutputPath(doclet);
	resolveSubNamespace(doclet);
	resolveSubNamespaces(doclet);
	resolveAttributes(doclet);
};

function resolveOutputPath (doclet) {
	doclet.outputFilename = 'namespace/' + doclet.outputFilename;
}

function resolveSubNamespace (doclet) {
	var idx = doclet.longname.indexOf('.');
	
	// this is a subnamespace if it has a . in it
	doclet.subNamespace = !! (idx >= 0);
}

function resolveSubNamespaces (doclet) {
	var db = helpers.db;
	
	if (!doclet.subNamespaces) {
		doclet.subNamespaces = db({kind: 'namespace', memberof: doclet.longname}).order('name asec').get();
	}
}

function resolveAttributes (doclet) {
	var db = helpers.db;
	
	if (!doclet.kinds) {
		doclet.kinds = db({kind: 'class', memberof: doclet.longname}).order('name asec').get();
	}
	
	if (!doclet.ui) {
		doclet.ui = db({memberof: doclet.longname, ui: true}).order('name asec').get();
	}
	
	if (!doclet.utility) {
		doclet.utility = db({memberof: doclet.longname, utility: true}).order('name asec').get();
	}
	
	if (!doclet.functions) {
		doclet.functions = db({kind: 'function', memberof: doclet.longname}).order('name asec').get();
	}
}