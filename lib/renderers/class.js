
'use strict';

// internal
var helpers = require('../helpers');

/**
* Render the class file content.
*/
exports.process = function (doclet) {
	resolveInherited(doclet);
	resolveTypes(doclet);
	doclet.content = helpers.render('partials/kind.html', doclet);
};

/**
* Write the file.
*/
exports.publish = function (doclet) {
	helpers.publish(doclet.outputFilename, doclet.content);
};

function resolveInherited (doclet) {
	
	// we convert these to link format so that once they are rendered they will be resolved as
	// valid internal links at the appropriate time
	doclet.inheritedProperties.forEach(function (prop) {
		prop.inherits = '{@link ' + prop.inherits + '}';
	});
	doclet.inheritedMethods.forEach(function (method) {
		method.inherits = '{@link ' + method.inherits + '}';
	});
	doclet.inheritedEvents.forEach(function (event) {
		event.inherits = '{@link ' + event.inherits.replace('event:', '') + '}';
	});
}

function resolveTypes (doclet) {
	doclet.properties.forEach(resolvePropertyType);
	doclet.inheritedProperties.forEach(resolvePropertyType);
	doclet.methods.forEach(resolveMethodType);
	doclet.inheritedMethods.forEach(resolveMethodType);
	doclet.events.forEach(resolveEventType);
	doclet.inheritedEvents.forEach(resolveEventType);
}

function resolvePropertyType (doclet) {
	
	// type names
	doclet.type.names.forEach(function (nom, idx) {
		if (nom[0] != '{') doclet.type.names[idx] = resolveType(nom);
	});
	
	// default value type
	if (doclet.defaultvalue && doclet.defaultvalue[0] != '{') {
		doclet.defaultvalue = resolveType(doclet.defaultvalue);
	}
}

function resolveType (nom) {
	var matches;
	
	if (
		nom[0] == '"' ||
		nom[0] == '\'' ||
		
		// if the first character can be resolved as a number we need to take its literal
		!isNaN(nom[0]) ||
		
		// could be a decimal value but either way, take its literal
		nom[0] == '.' ||
		nom[0] == '*' ||
		nom[0] == '['
	) return nom;
	
	// special array of type syntax auto-formatted by jsdoc
	matches = /Array\.<(.*)>/.exec(nom);
	if (matches) {
		var now = '[' + resolveType(matches[1]) + ']';
		return now;
	}
	
	// we have to use arbitrary searches for things we know about
	switch(nom.toLowerCase()) {
	case 'null':
	case 'undefined':
	case 'boolean':
	case 'number':
	case 'string':
	case 'function':
	case 'object':
	case 'array':
	case 'hash':
	case 'true':
	case 'false':
	case 'this':
	case 'node':
		return '{@glossary ' + nom + '}';
		break;
	default:
		return '{@link ' + nom + '}';
		break;
	}
}

function resolveMethodType (doclet) {
	
	// params
	doclet.params.forEach(function (param) {
		param.type.names.forEach(function (nom, idx) {
			if (nom[0] != '{') param.type.names[idx] = resolveType(nom);
		});
	});
	
	// returns
	doclet.returns.type.names.forEach(function (nom, idx) {
		if (nom[0] != '{') doclet.returns.type.names[idx] = resolveType(nom);
	});
}

function resolveEventType (doclet) {
	if (doclet.properties) {
		doclet.properties.forEach(function (property) {
			property.type.names.forEach(function (nom, idx) {
				if (nom[0] != '{') property.type.names[idx] = resolveType(nom);
			});
		});
	}
}