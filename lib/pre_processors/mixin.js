'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveOutputPath(doclet);
	resolveOrder(doclet);
	resolveLink(doclet);
	resolveModuleLink(doclet);
};

function resolveOutputPath (doclet) {
	doclet.outputFilename = 'mixin/' + doclet.outputFilename.replace('module:', '');
}

function resolveOrder (doclet) {
	var db = helpers.db;
	
	doclet.properties = db({kind: 'member', memberof: doclet.longname}).order('name asec').get();
	doclet.methods = db({kind: 'function', memberof: doclet.longname}).order('name asec').get();
	doclet.statics = db({memberof: doclet.longname, scope: 'static'}).order('name asec').get();
}

function resolveLink (doclet) {
	var str;
	
	if (!doclet.internalLink) {
		str = '<a class="mixin" href="';
		str += (helpers.linkFor(doclet.longname) || helpers.buildHref(doclet.longname));
		str += ('">' + doclet.longname);
		str += '</a>';
		doclet.internalLink = str;
	}
}

function resolveModuleLink (doclet) {
	var str;
	
	if (!doclet.definedbyLink && doclet.memberof) {
		doclet.prettyMemberof = doclet.memberof.replace('module:', '');
		str = '<a class="module" href="';
		str += (helpers.linkFor(doclet.memberof) || helpers.buildHref(doclet.memberof));
		str += ('">' + doclet.prettyMemberof);
		str += '</a>';
		doclet.moduleLink = str;
	}
}

