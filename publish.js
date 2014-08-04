/**
* This file is the required module for the Enyo.js JSDoc3 custom template.
*
* @file
*/
'use strict';

// nodejs built-ins
var util = require('util'),
	fs = require('fs-extra'),
	path = require('path');

// third-party
var nunjucks = require('nunjucks');
var helper = require('jsdoc/util/templateHelper');

// internal
var handlers = {},
	pages = {};

// configure nunjucks with our known templates
nunjucks.configure(path.resolve(process.cwd(), './templates'));

exports.publish = function (db, opts) {

	var dir = path.resolve(process.cwd(), opts.destination);
	var assets = path.resolve(process.cwd(), "./templates/assets");
	fs.removeSync(dir);
	fs.copySync(assets, path.resolve(dir, "./assets"));

	helper.getMembers(db);

	// prune and normalize the database so querying can be accurate without a ton of additional
	// special handling later on
	normalize(db);

	// then we need to do is, unfortunately, iterate over every entry in the database
	// and fully resolve the doclets so they hava all of the necessary information ready when
	// they are being rendered
	db().each(function (doclet) {
		resolveDoclet(doclet, db);
	});

	publishDoclets(db, opts);
	publishPages(db, opts);
	publishIndex(db, opts);
};

function normalize (db) {
	// general resolution stuff
	var priv = global.env.opts['private'] || false;

	db({undocumented: true}).remove();
	db({ignore: true}).remove();
	db({memberof: '<anonymous>'}).remove();

	// if private is false, remove those
	if(!priv) {
		db({access:'private'}).remove();
	}
	
	db().each(function (doclet) {
		var filepath,
			filenom,
			ns;
		
		if (!doclet.hasOwnProperty('access')) {
			doclet.access = 'public';
		} else if (doclet.access != 'private' && doclet.access != 'protected') {
			doclet.access = 'private';
		}
		
		if (doclet.meta) {
			filepath = doclet.meta.path;
			filenom = doclet.meta.filename;
			
			if ((ns = filepath.indexOf('/enyo/')) > -1) {
				filepath = filepath.slice(ns + 1, filepath.length);
			} else if ((ns = filepath.indexOf('/lib/')) > -1) {
				filepath = filepath.slice(ns + 5, filepath.length);
			}
			
			doclet.meta.relpath = path.normalize(filepath + '/' + filenom);
		}
	});
}

function resolveDoclet (doclet, db) {
	
	switch (doclet.kind) {
	case 'class':
		resolveClass(doclet, db);
		break;
	case 'member':
		resolveMember(doclet, db);
		break;
	case 'function':
		resolveFunction(doclet, db);
		break;
	case 'namespace':
		resolveNamespace(doclet, db);
		break;
	case 'event':
		resolveEvent(doclet, db);
		break;
	}
}

function resolveEvent(doclet, db) {
	doclet.name = doclet.name.replace("event:", "");
}

function resolveClass (doclet, db) {
	var props = db({kind: 'member', memberof: doclet.longname, scope:{'!is':'static'}}),
		methods = db({kind: 'function', memberof: doclet.longname, scope:{'!is':'static'}}),
		statics = db({memberof: doclet.longname, scope: 'static'}),
		events = db({kind: 'event', memberof: doclet.longname}),
		augs = doclet.augments,
		ns,
		tmp;

	if (augs) {
		doclet.inherits = [];
		while (augs) {
			// is it really possible to inherit multiply in javascript in a way that would make this
			// need to be an array?
			augs = augs[0];
			tmp = db({longname: augs}).first();
			doclet.inherits.unshift(tmp);
			augs = tmp.augments;
		}
	}

	doclet.events = events.order('name asec').get();
	doclet.properties = props.order('name asec').get();
	doclet.methods = methods.order('name asec').get();
	doclet.statics = statics.order('name asec').get();
}

/**
*
*/
function resolveNamespace (doclet, db) {
	var idx = doclet.longname.indexOf('.');
	
	// this implies it is a highest level namespace
	if (idx >= 0) doclet.subNamespace = true;
	
	if (!doclet.subNamespaces) {
		doclet.subNamespaces = db({kind: 'namespace', memberof: doclet.longname}).order('name asec').get();
	}	
	
	if (!doclet.kinds) {
		doclet.kinds = db({kind: 'class', memberof: doclet.longname, ui: {'!is': true}}).order('name asec').get();
	}
	
	if (!doclet.ui) {
		doclet.ui = db({kind: 'class', memberof: doclet.longname, ui: true}).order('name asec').get();
	}
	
	if (!doclet.utility) {
		doclet.utility = db({utility: true, memberof: doclet.longname}).order('name asec').get();
	}
	
	if (!doclet.functions) {
		doclet.functions = db({kind: 'function', memberof: doclet.longname}).order('name asec').get();
	}
	
	if (!doclet.events) {
		doclet.events = db({kind: 'event', memberof: doclet.longname}).order('name asec').get();
	}
}

var RESOLVED_LINKS = {};

/**
* Common routine to figure out how we want to declare a particular type that can be reported
* one of several ways by the documentor.
*/
function resolveType (type, db) {
	var decipher = function (nom, scop) {
		var arry = /^Array\.\<(.*)\>$/,
			doc,
			url,
			idx;
		
		if (RESOLVED_LINKS[nom]) return RESOLVED_LINKS[nom];
		else {
			
			scop = scop || {};
			
			// if it does not have a namespace (as a type remember) we assume it is a
			// glossary term (this might have to be reviewed?))
			if ((idx = nom.indexOf('.')) < 0) {
				if (nom != 'UNDOCUMENTED') url = '../pages/glossary.html#' + nom;
				else url = 'javascript:void(0);';
			}
			
			// if it does, it is either a namespace or some other awkwardly reported form
			// from the documentor like Array.<TYPE>
			else {
				if (arry.test(nom)) {
					
					// we recursively call the method to decipher the link of the inner kind
					// but we ultimately have to handle it differently because it is an
					// array and not just a kind
					nom = arry.exec(nom)[1];
					decipher(nom, scop);
					
					// this is how we will represent array of type...
					scop.path = '[' + nom + ']';
				} else {
					
					// the other case where we have a namespace (or namespaces)
					// we attempt to lookup the longname of the thing
					doc = db({longname: nom}).first();
					
					if (!doc) console.log('Cannot find entry for `' + nom + '`');
					else {
						if (doc.ui) url = '#/ui/' + nom;
						else if (doc.kind == 'class') url = '../kind/' + nom + '.html';
						else if (doc.kind == 'typedef') {
							// needs to be handled and normalize the name!
							url = 'javascript:void(0);';
						}
						else if (doc.kind == 'member') url = '#/member/' + nom;
					}
				}
			}
			
			scop.url = scop.url || url;
		}
		
		return scop;
	};
	
	if (type && type.resolved) return type;
	
	if (!type) type = {undocumented: true, names: ['UNDOCUMENTED']};
	
	if (!type.resolved) {
		type.resolved = [];
		type.names.forEach(function (nom) {
			var scop = decipher(nom),
				link;
			
			scop.path = scop.path || nom;
			
			scop.url = scop.url || 'javascript:void(0);';
			scop.class = scop.class || 'auto-resolved';
			link = scop.link || (scop.link = nunjucks.render('partials/auto-resolved-link.html', scop));
			if (!RESOLVED_LINKS[nom]) RESOLVED_LINKS[nom] = scop;
			type.resolved.push(scop);
		});
	}
	
	return type;
}

/**
* Normalize members (properties).
*/
function resolveMember (doclet, db) {
	
	// we need to normalize the type so that renderers will know how to use the information
	// (if it is provided at all)
	doclet.type = resolveType(doclet.type, db);

}

/**
* Normalize functions, whether attached as a method or a stand-alone.
*/
function resolveFunction (doclet, db) {
	
	// we need to normalize parameters if we haven't already
	if (doclet.params) {
		doclet.params.forEach(function (ln) {
			ln.type = resolveType(ln.type, db);
		});
	}
	
	// and we need to normalize the return type if we haven't already
	if (doclet.returns) {
		doclet.returns.forEach(function (ln) {
			ln.type = resolveType(ln.type, db);
		});
		
		doclet.returns = doclet.returns[0];
	}

}

/**
*
*/
function writeFile (filenom, content) {
	
	// remember that for whatever reason jsdoc will exit before we finish writing if we try
	// to do it asynchronously so we have to do everything synchronous
	try {
		fs.writeFileSync(filenom, content);
	} catch (e) {
		require('jsdoc/util/error').handle(new Error(
			'Could not write file: ' + filenom + 'because: ' + e
		));
	}
}

/**
*
*/
function makeDir (dir) {
	dir = path.normalize(dir);
	
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

/**
*
*/
function publishIndex (db, opts) {

	var scop = {},
		filenom = path.normalize(process.cwd() + '/' + opts.destination + '/' + 'debug.html');
	
	
	// write the index file for the project
	writeFile(filenom, helper.resolveLinks(nunjucks.render('index.html', scop)));
}

function publishDoclets (db, opts) {
	
	db().each(function (doclet) {
		
		if (handlers[doclet.kind]) handlers[doclet.kind](doclet, opts, db);
		
	});
	
}

function publishPages (db, opts) {
	var noms = Object.keys(pages);
	
	noms.forEach(function (nom) {
		pages[nom](db, opts);
	});
}

handlers['class'] = function (doclet, opts, db) {
	
	var dir = path.resolve(process.cwd(), opts.destination, './'),
		filenom;
	
	dir = path.normalize(dir + '/kind/');
	makeDir(dir);

	filenom = doclet.longname.replace('<anonymous>', '').replace('~', '');
	filenom = path.normalize(dir + filenom) + '.html';
	writeFile(filenom, helper.resolveLinks(nunjucks.render('pages/kind.html', doclet)));
};

handlers['namespace'] = function (doclet, opts, db) {
	
	var dir = path.resolve(process.cwd(), opts.destination, './'),
		filenom;
	
	dir = path.normalize(dir + '/namespace/');
	makeDir(dir);
	
	filenom = doclet.longname.replace('<anonymous>', '').replace('~', '');
	filenom = path.normalize(dir + filenom) + '.html';
	
	// we have to modify scope as this file is included in others with a separate loop scope
	writeFile(filenom, helper.resolveLinks(nunjucks.render('pages/namespace.html', {namespace: doclet})));
};


pages['browse'] = function (db, opts) {
	
	var dir = path.resolve(process.cwd(), opts.destination, './'),
		scop = {},
		filenom;
	
	dir = path.normalize(dir + '/pages');
	makeDir(dir);
	
	filenom = path.normalize(dir + '/browse.html');
	
	// retrieve the complete list of kinds sans-anonymously scoped ones and ordered
	// scop.kinds = db({kind: 'class', memberof: {'!is': '<anonymous>'}}).order('longname asec').get();
	
	// retrieve the complete list of available namespaces ordered
	scop.namespaces = db({kind: 'namespace', subNamespace: {'!is': true}}).order('longname asec').get();
	
	// retrieve the complete list of elements marked as @ui
	// scop.ui = db({ui: true}).order('longname asec').get();
	
	// retrieve the complete list of elements marked as @utility
	// scop.utility = db({utility: true}).order('longname asec').get();
	
	writeFile(filenom, helper.resolveLinks(nunjucks.render('pages/browse.html', scop)));
};

pages['glossary'] = function (db, opts) {
	
	var dir = path.resolve(process.cwd(), opts.destination, './'),
		scop = {},
		filenom;
		
	dir = path.normalize(dir + '/pages');
	makeDir(dir);
	
	filenom = path.normalize(dir + '/glossary.html');
	
	scop.terms = db({isGlossary: true}).order('longname asec').get();
	
	writeFile(filenom, helper.resolveLinks(nunjucks.render('pages/glossary.html', scop)));
};

pages['kinds'] = function (db, opts) {
	
	var dir = path.resolve(process.cwd(), opts.destination, './'),
		scop = {},
		filenom;
		
	dir = path.normalize(dir + '/pages');
	makeDir(dir);
	
	filenom = path.normalize(dir + '/kinds.html');
	
	scop.kinds = db({kind: 'class'}).order('longname asec').get();
	
	writeFile(filenom, helper.resolveLinks(nunjucks.render('pages/kinds.html', scop)));
	
};
