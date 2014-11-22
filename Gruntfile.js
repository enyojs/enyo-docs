module.exports = function (grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		jsdoc: {
			configFile: 'jsdoc-conf.json',
			dest: 'output'
		},
		
		less: {
			development: {
				options: {
					paths: ['<%= copyAssets.src %>/css']
				},
				files: {
					'<%= copyAssets.dest %>/css/main.css': '<%= copyAssets.src %>/css/main.less',
					'<%= copyAssets.dest %>/css/bootstrap-theme.css': '<%= copyAssets.src %>/css/bootstrap-theme.less'
				}
			}
		},
		subst: {
			'dev-guide': {
				options: {
					pattern: /\$dev-guide/ig,
					replacement: 'developer-guide'
				},
				files: {
					src: 'output/**/*.html'
				}
			},
			'api': {
				options: {
					pattern: /\$api/ig,
					relative: true,
					base: 'output'
				},
				files: {
					src: 'output/**/*.html'
				}
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
};
