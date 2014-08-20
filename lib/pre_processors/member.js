
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveType(doclet);
};

function resolveType (doclet) {
	
	if (!doclet.type) doclet.type = {};
	if (!doclet.type.names) doclet.type.names = ['undefined'];
	
}
