
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveOutputPath(doclet);
	resolveSubNamespace(doclet);
	resolveSubNamespaces(doclet);
	resolveAttributes(doclet);
	resolveLink(doclet);
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

function resolveLink (doclet) {
	var str;
	
	if (!doclet.internalLink) {
		str = '<a class="namespace" href="';
		str += (helpers.linkFor(doclet.longname) || helpers.buildHref(doclet.longname));
		str += ('">' + doclet.longname);
		str += '</a>';
		doclet.internalLink = str;
	}
}

function resolveAttributes (doclet) {
	var db = helpers.db;
	
	if (!doclet.properties) {
		doclet.properties = db({kind: 'member', memberof: doclet.longname, subNamespace: {isUndefined: true}}).order('name asec').get();
	}
	
	if (!doclet.kinds) {
		doclet.kinds = db({kind: 'class', memberof: doclet.longname, ui: {isUndefined: true}}).order('name asec').get();
	}
	
	if (!doclet.ui) {
		doclet.ui = db({memberof: doclet.longname, ui: true}).order('name asec').get();
	}
	
	if (!doclet.utility) {
		doclet.utility = db({memberof: doclet.longname, utility: true}).order('name asec').get();
	}
	
	if (!doclet.functions) {
		doclet.methods = db({kind: 'function', memberof: doclet.longname}).order('name asec').get();
	}
	
	if (!doclet.mixins) {
		doclet.mixins = db({kind: 'mixin', memberof: doclet.longname}).order('name asec').get();
	}
}