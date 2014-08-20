'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveOutputPath(doclet);
	resolveOrder(doclet);
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