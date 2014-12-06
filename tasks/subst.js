/* This task can either do a straight string substitution in files or for substituting path
 * differences in files.
 *
 * Options:
 *
 *     pattern: Pattern to search for. Can be string or regex.
 *     replacement: String or function to replace matched pattern
 *     relative: Boolean value to indicate whether to instead use the relative path difference
 *                 between 'base' and target file instead of 'replacement'.
 *     base: Base path to use for relative path replacement. If not specified, the current
 *                 directory is used.
 */
var path = require('path');

module.exports = function (grunt) {
	
	grunt.registerMultiTask('subst', 'Substitute string in files, in place', function() {
		var options = this.options({});

		if(options.relative) {
		   if(options.replacement) {
				grunt.log.warn('Cannot specify both `relative` and `replacement` options.');
				return false;
			} else if(!options.base) {
				options.base = process.cwd();
			}
			options.base = path.resolve(options.base);
		}

		this.files.forEach(function(file) {
			file.src.forEach(function(filepath) {
				var replacement = options.replacement;
				if(options.relative) {
					replacement = path.relative(path.dirname(filepath), options.base);
				}
				grunt.file.copy(filepath, filepath, {
					process: function(text) {
						return text.replace(options.pattern, (replacement ? replacement + "/" : replacement));
					}
				});
			});
		});
	});
}
