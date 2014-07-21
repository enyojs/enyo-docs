'use strict';

var path = require('path');

var nunjucks = require('nunjucks');

var expression = /(\[\S*\])?\{@glossary\s*\S*\s*\}/g,
	extract = /(\[\S*\])?\{@glossary\s*(\S*)\s*\}/;

// configure with our known templates path but we should probably update this to a shared
// environment variable
nunjucks.configure(path.resolve(process.cwd(), './templates'));

function findLinks (text) {
	return text.match(expression);
}

function processComment (e) {
	var text = e.comment,
		links = findLinks(text),
		scop;
	
	if (links) {
		scop = {};
		links.forEach(function (ln) {
			var tok = extract.exec(ln);
			
			if (tok) {
				// we need the substring match that is the inner token
				scop.token = tok[2]
				scop.link = tok[1] ? tok[1].replace(/[\[\]]/g, '') : tok[2];
				
				text = text.replace(new RegExp(ln.replace(/(\[|\])/g, '\\$1'), 'g'),
					nunjucks.render('partials/glossary-link.html', scop)
				);
			}
		});
		// now that we replaced all mentions we can reassign it and let it be turned into
		// a doclet
		e.comment = text;
	}
}

/**
* This grabs the definitions, not the inline link pragma.
*/
exports.defineTags = function (dictionary) {
	dictionary.defineTag('glossary', {
		mustHaveValue: true,
		mustNotHaveValue: false,
		canHaveType: false,
		canHaveName: true,
		isNamespace: false,
		onTagged: function (doclet, tag) {
			doclet.kind = 'glossary';
			doclet.isGlossary = true;
			doclet.name = doclet.name || tag.text;
		}
	});
};

/**
* This takes the early opportunity to replace inline-glossary links with the actual markup.
*/
exports.handlers = {
	jsdocCommentFound: function (e) {
		processComment(e);
	}
}