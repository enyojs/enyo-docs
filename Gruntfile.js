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
