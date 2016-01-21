/**
*
*/
'use strict';

exports.defineTags = function (dictionary) {
	dictionary.defineTag('wip', {
		mustHaveValue: false,
		mustNotHaveValue: true,
		canHaveType: false,
		canHaveName: false,
		isNamespace: false,
		onTagged: function (doclet) {
			doclet.wip = true;
		}
	});
};
