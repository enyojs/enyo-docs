var childProcess = require('child_process');

module.exports = function (grunt) {
	
	grunt.registerTask('jsdoc', function () {
		
		var opts = grunt.config.get('jsdoc'),
			done = this.async(),
			args = ['-c'],
			child;
		
		// push the conf file
		args.push(opts.configFile || 'jsdoc-conf.json');
		
		// ensure we have a output directory
		args.push('-d');
		args.push(opts.dest || 'output');
		
		grunt.log.write('Running JSDoc against known sources...');

		// TODO: update to use npm installed jsdoc
		child = childProcess.spawn('jsdoc', args, {stdio: 'inherit'});

		child.on('exit', function () {
			grunt.log.write('done\n');

			done();
		});
		
	});
	
};