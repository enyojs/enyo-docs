'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveOutputPath(doclet);
	resolveOrder(doclet);
	resolveLink(doclet);
};

function resolveOutputPath (doclet) {
	doclet.outputFilename = 'mixin/' + doclet.outputFilename;
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