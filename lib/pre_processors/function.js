
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveParams(doclet);
	resolveReturns(doclet);
};

function resolveParams (doclet) {
	
	// params are stored as an array of objects with properties, the property of interest being
	// the type value
	
	if (!doclet.params) doclet.params = [];
	
	// doclet.params.forEach(function (param) {
	// 	// for whatever reason it assigns them via array which doesn't seem to serve a significant
	// 	// purpose in our use-case and makes templating more difficult so we normalize it to a
	// 	// single referenceable property
	// 	param.type.name = param.type.names[0];
	// });
}

function resolveReturns (doclet) {
	
	// it is not obvious why this is an array but it makes templating more difficult
	if (doclet.returns) doclet.returns = doclet.returns[0];
	else doclet.returns = {type: {names: ['undefined']}, description: ''};
}