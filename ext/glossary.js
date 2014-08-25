
'use strict';

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
