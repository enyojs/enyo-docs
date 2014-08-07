
'use strict';

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveParams(doclet);
	resolveReturns(doclet);
};

function resolveParams (doclet) {
	
	// params are stored as an array of objects with properties, the property of interest being
	// the type value
}

function resolveReturns (doclet) {
	
}