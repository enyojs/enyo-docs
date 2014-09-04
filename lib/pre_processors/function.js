
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveParams(doclet);
	resolveReturns(doclet);
	// resolveLink(doclet);
};

function resolveParams (doclet) {
	// params are stored as an array of objects with properties, the property of interest being
	// the type value
	if (!doclet.params) doclet.params = [];
}

function resolveReturns (doclet) {
	
	// it is not obvious why this is an array but it makes templating more difficult
	if (doclet.returns) doclet.returns = doclet.returns[0];
	else doclet.returns = {type: {names: ['undefined']}, description: ''};
}

function resolveLink (doclet) {
	var str;
	
	// we only need this for utilities
	if (!doclet.internalLink && doclet.utility) {
		str = '<a class="method" href="';
		str += (helpers.linkFor(doclet.longname) || helpers.buildHref(doclet.longname));
		str += ('">' + doclet.longname);
		str += '</a>';
		doclet.internalLink = str;
	}
}