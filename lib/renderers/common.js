'use strict';

var path = require('path');

var helpers = require('../helpers');

exports.process = function (doclet) {
	resolveInherited(doclet);
	resolveTypes(doclet);
	resolveSeeLinks(doclet);
};

function resolveInherited (doclet) {
	if (doclet.inheritedProperties) {
	
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
}

function resolveTypes (doclet) {
	
	if (doclet.properties) {
		doclet.properties.forEach(resolvePropertyType);
	}
	
	if (doclet.inheritedProperties) {
		doclet.inheritedProperties.forEach(resolvePropertyType);
	}
	
	if (doclet.methods) {
		doclet.methods.forEach(resolveMethodType);
	}
	
	if (doclet.inheritedMethods) {
		doclet.inheritedMethods.forEach(resolveMethodType);
	}
	
	if (doclet.events) {
		doclet.events.forEach(resolveEventType);
	}
	
	if (doclet.inheritedEvents) {
		doclet.inheritedEvents.forEach(resolveEventType);
	}

	if (doclet.typedefs) {
		doclet.typedefs.forEach(resolveTypedefType);
	}
}

function resolveSeeLinks (doclet) {
	if (doclet.see) {
		doclet.see.forEach(function (nom, idx) {
			if (nom[0] != '{') doclet.see[idx] = resolveType(nom);
		});
	}
}

function resolvePropertyType (doclet) {
	
	// type names
	doclet.type && doclet.type.names && doclet.type.names.forEach(function (nom, idx) {
		if (nom[0] != '{') doclet.type.names[idx] = resolveType(nom);
	});
	
	// default value type
	if (doclet.defaultvalue && doclet.defaultvalue[0] != '{') {
		doclet.defaultvalue = resolveType(doclet.defaultvalue);
	}
	
	// see links
	resolveSeeLinks(doclet);
}

function resolveType (nom) {
	var matches;
	
	nom = nom.toString();	// jsdoc 3.3 betas pass literals, not strings

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
	
	matches = /^http/.exec(nom);
	if (matches || nom[0] == '/' || nom.indexOf('/') > -1) {
		return '{@linkplain ' + nom + '}';
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
		// if we've gotten this far chances are it was intended to be linked to something
		// so we make a (usually correct) brash generalization and assume that if it does not
		// have a namespace then it is actually a glossary term
		if (nom.indexOf('.') === -1) return '{@glossary ' + nom + '}';
		else return '{@link ' + nom + '}';
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
	doclet.returns && doclet.returns.types && doclet.returns.types.names
		&& doclet.returns.type.names.forEach(function (nom, idx) {
		if (nom[0] != '{') doclet.returns.type.names[idx] = resolveType(nom);
	});
	
	// see links
	resolveSeeLinks(doclet);
}

function resolveEventType (doclet) {
	if (doclet.properties) {
		doclet.properties.forEach(function (property) {
			property.type.names.forEach(function (nom, idx) {
				if (nom[0] != '{') property.type.names[idx] = resolveType(nom);
			});
		});
		
		resolveSeeLinks(doclet);
	}
}

function resolveTypedefType (doclet) {
	if(doclet.params) {
		resolveMethodType(doclet);
	} else {
		resolvePropertyType(doclet);
	}
}

