module.exports = function (grunt) {
	
	grunt.registerMultiTask('subst', 'Substitute string in files, in place', function() {
		var options = this.options({});

		this.files.forEach(function(file) {
			file.src.forEach(function(path) {
				grunt.file.copy(path, path, {
					process: function(text) {
						return text.replace(options.pattern, options.replacement);
					}
				});
			});
		});
	});
}
