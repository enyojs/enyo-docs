
'use strict';

var path = require('path');

var helpers = require('../helpers');

var expression = /(?:\[[^\]]*\])?\{@(?:link|glossary)\ *(?:(?!http)[^#~\s]*)(?:[#~](?:\S*))?\s*\}/g,
	extract = /(?:\[([^\]]*)\])?\{@(?:link|glossary)\ *([^#~\s]*)(?:[#~](\S*))?\s*\}/;

exports.process = function (doclet) {
	
	renderLinks(doclet);
};

function findLinks (text) {
	return text.match(expression);
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

function renderLinks (doclet) {
	
	var text = doclet.content,
		links;
	
	// for now we only post-process for links against the greater rendered content regions -
	// lesser elements don't get rendered individually but their content will have been rendered
	// in the outer one so we wait till then to grab them all
	if (text) {
		links = findLinks(text);
		
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
					
				if (ln.indexOf('glossary') > -1) {
					target = elem;
					href = '#/glossary';
					linkText = linkText || target;
				} else {
				
					// if there was no explicit link text requested the default will be used
					if (!linkText) linkText = elem;
					href = helpers.linkFor(elem);

					// if we haven't encountered the root element before we have to create it
					if (!href) {

						// note this automatically registers it for faster lookup if requested again
						href = buildHref(elem);
						if (href === false) {
						
							helpers.error(
								__filename.replace(process.cwd(), '') + ':renderLinks() ->\n\tIn ' + doclet.source + ' near line ' + doclet.sourceLine +
								', link cannot be resolved `' + ln + '`'
							);
						
							// in this case there was an error and, while we will produce the error to
							// console we will also make sure it can't be missed when scanning the
							// output for a better chance at being caught!
							linkText = 'ERROR FINDING REFERENCE IN LINK FOR "' + elem + '"';
							href = 'javascript:void(0);';
						}
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
	
}