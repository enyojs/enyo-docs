
'use strict';

/**
* A workaround to get the defining module so we can display it in the docs
*/
exports.defineTags = function (dictionary) {
	dictionary.defineTag('definedby', {
		mustHaveValue: true,
		mustNotHaveValue: false,
		canHaveType: false,
		canHaveName: true,
		isNamespace: false,
		onTagged: function (doclet, tag) {
			doclet.definedby = doclet.definedby || tag.text;
		}
	});
};
