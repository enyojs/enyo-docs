
'use strict';

var path = require('path');

var helpers = require('../helpers');

exports.process = function (doclet) {
	return resolveLinks(doclet);
};

function resolveLinks (doclet) {
	var str = (typeof doclet == 'string' ? doclet : doclet.content);
	
	if (str) {
		str = renderGlossary(str);
		str = renderLinkPlain(str);
		str = renderLinks(str);
	
		if (typeof doclet == 'string') return str;
		else doclet.content = str;
	}
	
	return str;
}

function renderGlossary (content) {
	var expression = /(?:\[[^\]]*\])?\{@glossary\ *\S*\}/g,
		extract = /(?:\[([^\]]*)\])?\{@glossary\ *(\S*)\}/,
		text = content,
		terms = text.match(expression);
	
	if (terms) {
		terms.forEach(function (term) {
			var tok = extract.exec(term);
			text = text.replace(term, '<a class="glossary" href="#/glossary:' + tok[2] + '">' + (tok[1] || tok[2]) + '</a>')
		});
	}
	
	return text;
}

function renderLinkPlain (content) {
	var expression = /(?:\[[^\]]*\])?(?:\{@linkplain\ *(?:[^\}]*)\})/g,
		extract = /(?:\[([^\]]*)\])?(?:\{@linkplain\ *([^\}]*)\})/,
		text = content,
		links = text.match(expression);
	
	if (links) {
		links.forEach(function (link) {
			var tok = extract.exec(link),
				href = tok[2],
				linkText = tok[1];

			// This is a hack.  Default values from properties on modules -don't work- (except from
			// within the module itself)
			if(href.indexOf('module:') === 0) {
				linkText = linkText || href.replace('module:','');
				var trueHref = helpers.hrefFor(href);
				if(trueHref) {
					href = '<a class="linkplan" href="' + trueHref + '">' + linkText + '</a>';
				} else {
					href = '<a class="linkplain" href="#/module/' + href.slice(7).replace(/[#~]/, ':') +
						'">' + linkText + '</a>';
				}
				text = text.replace(link, href);
			} else {
				if (!linkText) linkText = href;
			
				text = text.replace(link, '<a class="linkplain" href="' + href + '">' + linkText + '</a>');
			}
		});
	}
	
	return text;
}

function renderLinks (content) {

	var expression = /(?:\[[^\]]*\])?\{@link\ *(?:[^\}]*)\}/g,
		extract = /(?:\[([^\]]*)\])?\{@link\ *(([^#\s]*)(?:[#](\S*))?)\}/;

	var text = content,
		links = text.match(expression);

	if (links) {
		links.forEach(function (ln) {
			var tok = extract.exec(ln),
				linkText,
				elem,
				target,
				href,
				parts,
				str = '<a href="';
			
			if (tok) {

				// if requested, anything in the [] before the {@link} tag
				linkText = tok[1];

				// the actual root thing it was targeting
				elem = tok[3];

				// anything after # if it existed
				target = tok[4];
				
				// if there was no explicit link text requested the default will be used
				if (!linkText) linkText = tok[2].replace('module:', '');
				
				// special handling for cases that include a nested namespace and a regular
				// property/method attached e.g. enyo.dom.getBounds
				if (!target && (elem.indexOf('module:') == -1)) {
					parts = elem.split('.');
					if (parts.length > 2) {
						target = parts.pop();
						elem = parts.join('.');
					}
				}
				
			} else {
				elem = ln;
			}

			href = helpers.linkFor(elem);

			// if we haven't encountered the root element before we have to create it
			if (!href) {

				// note this automatically registers it for faster lookup if requested again
				href = helpers.buildHref(elem);
				if (href === false) {
					// in this case there was an error and, while we will produce the error
					// to console we will also make sure it can't be missed when scanning
					// the output for a better chance at being caught!
					linkText = 'ERROR: INVALID LINK FOR "' + elem + '"';
					// console.log(linkText);
					href = 'javascript:void(0);';
				}
			}
			

			str += href;
			// if there is a target we append that too
			if (target) str += (':' + target);
			str += ('">' + linkText + '</a>');
			text = text.replace(ln, str);
		});

	}
	
	return text;
}
