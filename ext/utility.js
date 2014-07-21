'use strict';

exports.defineTags = function (dictionary) {
	dictionary.defineTag('utility', {
		mustHaveValue: false,
		mustNotHaveValue: true,
		canHaveType: false,
		canHaveName: false,
		isNamespace: false,
		onTagged: function (doclet) {
			doclet.utility = true;
		}
	});
};