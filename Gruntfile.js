module.exports = function (grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		jsdoc: {
			configFile: 'jsdoc-conf.json',
			dest: 'output'
		},
		
		less: {
			options: {
				paths: ['<%= copyAssets.src %>/css']
			},
			files: {
				expand: true,
				cwd: '<%= copyAssets.src %>/css',
				src: 'main.less',
				ext: '.css',
				dest: '<%= copyAssets.dest %>/css'
			}
		},
		subst: {
			options: {
				pattern: /\$dev-guide/ig,
				replacement: 'developer-guide'
			},
			files: {
				src: 'output/**/*.html'
			}
		},
		
		copyAssets: {
			src: 'assets',
			dest: '<%= jsdoc.dest %>'
		}
		
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-string-replace');

	grunt.loadTasks('tasks');
	
	grunt.registerTask('default', ['jsdoc', 'less', 'copy-assets', 'subst']);
	
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


};
