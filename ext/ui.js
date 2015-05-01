/**
*
*/
'use strict';

exports.defineTags = function (dictionary) {
	dictionary.defineTag('ui', {
		mustHaveValue: false,
		mustNotHaveValue: true,
		canHaveType: false,
		canHaveName: false,
		isNamespace: false,
		onTagged: function (doclet) {
			doclet.ui = true;
		}
	});
};
