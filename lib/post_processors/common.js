
'use strict';

var path = require('path');

var helpers = require('../helpers');

exports.process = function (doclet) {
	if (doclet.content) resolveLinks(doclet);
};

function resolveLinks (doclet) {
	renderGlossary(doclet);
	renderLinkPlain(doclet);
	renderLinks(doclet);
}

function renderGlossary (doclet) {
	var expression = /(?:\[[^\]]*\])?\{@glossary\ *\S*\}/g,
		extract = /(?:\[([^\]]*)\])?\{@glossary\ *(\S*)\}/,
		text = doclet.content,
		terms = text.match(expression);
	
	if (terms) {
		terms.forEach(function (term) {
			var tok = extract.exec(term);
			text = text.replace(term, '<a class="glossary" href="#/glossary:' + tok[2] + '">' + (tok[1] || tok[2]) + '</a>')
		});
		
		doclet.content = text;
	}
}

function renderLinkPlain (doclet) {
	var expression = /(?:\[[^\]]*\])?(?:\{@linkplain\ *(?:[^\}]*)\})/g,
		extract = /(?:\[([^\]]*)\])?(?:\{@linkplain\ *([^\}]*)\})/,
		text = doclet.content,
		links = text.match(expression);
	
	if (links) {
		links.forEach(function (link) {
			var tok = extract.exec(link),
				href = tok[2],
				linkText = tok[1],
				parts;
			
			if (!linkText) {
				// there is a possibility they used the format after the href so check that now
				parts = href.split(' ');
				if (parts.length > 1) {
					href = parts.shift();
					linkText = parts.join(' ');
				} else {
					linkText = href;
				}
			}
			
			text = text.replace(link, '<a class="linkplain" href="' + href + '">' + linkText + '</a>');
		});
		
		doclet.content = text;
	}
}

function renderLinks (doclet) {

	var expression = /(?:\[[^\]]*\])?\{@link\ *(?:[^\}]*)\}/g,
		extract = /(?:\[([^\]]*)\])?\{@link\ *(?:([^#~\s]*)(?:[#~](\S*))?)(.*)\}/;

	var text = doclet.content,
		links = text.match(expression);

	if (links) {
		links.forEach(function (ln) {
			var tok = extract.exec(ln),

				// if requested, anything in the [] before the {@link} tag
				linkText = tok[1],

				// the actual root thing it was targeting
				elem = tok[2],

				// anything after # if it existed
				target = tok[3],
				href,
				str = '<a href="';

			// if there was no explicit link text requested the default will be used
			if (!linkText) linkText = tok[4] || elem;
			href = helpers.linkFor(elem);

			// if we haven't encountered the root element before we have to create it
			if (!href) {

				// note this automatically registers it for faster lookup if requested again
				href = buildHref(elem);
				if (href === false) {

					helpers.error(
						__filename.replace(process.cwd(), '') + ':renderLinks() ->\n\tIn ' +
						doclet.source + ' near line ' + doclet.sourceLine +
						', link cannot be resolved `' + ln + '`'
					);

					// in this case there was an error and, while we will produce the error
					// to console we will also make sure it can't be missed when scanning
					// the output for a better chance at being caught!
					linkText = 'ERROR FINDING REFERENCE IN LINK FOR "' + elem + '"';
					href = 'javascript:void(0);';
				}
			}
			

			str += href;
			// if there is a target we append that too
			if (target) str += (':' + target);
			str += ('">' + linkText + '</a>');
			text = text.replace(ln, str);
		});

		doclet.content = text;
	}

}


function buildHref (elem) {
	var db = helpers.db,
		doclet = db({longname: elem}).first(),
		href,
		kind;
	
	if (!doclet) return false;
	
	kind = doclet.kind;
	
	// if the kind is class we use the word 'kind' instead arbitrarily because, well, this is
	// for enyo after all
	if (kind == 'class') kind = 'kind';
	
	href = '#/' + kind + '/' + elem;
	helpers.addLinkFor(elem, href);
	return href;
}