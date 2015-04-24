
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveOutputPath(doclet);
	resolveAttributes(doclet);
	resolveLink(doclet);
};

function resolveOutputPath (doclet) {
	doclet.outputFilename = 'module/' + doclet.outputFilename.replace('module:', '');
}

function resolveLink (doclet) {
	var str;
	
	if (!doclet.internalLink) {
		str = '<a class="module" href="';
		str += (helpers.linkFor(doclet.longname) || helpers.buildHref(doclet.longname));
		str += ('">' + doclet.name);
		str += '</a>';
		doclet.internalLink = str;
	}
}

function resolveAttributes (doclet) {
	var db = helpers.db;
	
	if (!doclet.properties) {
		doclet.properties = db({kind: 'member', memberof: doclet.longname, submodule: {isUndefined: true}}).order('name asec').get();
	}
	
	if (!doclet.kinds) {
		doclet.kinds = db({kind: 'class', definedby: doclet.longname, ui: {isUndefined: true}}).order('name asec').get();
	}
	
	if (!doclet.ui) {
		doclet.ui = db({definedby: doclet.longname, ui: true}).order('name asec').get();
	}
	
	if (!doclet.utility) {
		doclet.utility = db({definedby: doclet.longname, utility: true}).order('name asec').get();
	}
	
	if (!doclet.functions) {
		doclet.methods = db({kind: 'function', memberof: doclet.longname}).order('name asec').get();
	}

	if (!doclet.typedefs) {
		doclet.typedefs = db({kind: 'typedef', memberof: doclet.longname}).order('name asec').get();
	}
}
