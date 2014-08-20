
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveOutputPath(doclet);
	resolveInheritance(doclet);
	resolveOrder(doclet);
};

function resolveOutputPath (doclet) {
	doclet.outputFilename = 'kind/' + doclet.outputFilename;
}

function resolveInheritance (doclet) {
	var augs = doclet.augments,
		db = helpers.db,
		tmp;
	
	if (augs) {
		doclet.inherits = [];
		while (augs) {
			// is this even possible to augment multiple classes?
			augs = augs[0];
			tmp = db({longname: augs}).first();
			doclet.inherits.unshift(tmp);
			augs = tmp.augments;
		}
	}
}

function resolveOrder (doclet) {
	var db = helpers.db;
	
	doclet.properties = db({kind: 'member', memberof: doclet.longname}).order('name asec').get();
	doclet.methods = db({kind: 'function', memberof: doclet.longname}).order('name asec').get();
	doclet.statics = db({memberof: doclet.longname, scope: 'static'}).order('name asec').get();
}