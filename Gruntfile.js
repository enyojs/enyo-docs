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
				src: '*.less',
				ext: '.css',
				dest: '<%= copyAssets.dest %>/css'
			}
		},
		
		copyAssets: {
			src: 'assets',
			dest: '<%= jsdoc.dest %>'
		}
		
	});

	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.loadTasks('tasks');
	
	grunt.registerTask('default', ['jsdoc', 'less', 'copy-assets']);
	
};