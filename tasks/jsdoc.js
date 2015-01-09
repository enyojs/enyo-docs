var childProcess = require('child_process');

module.exports = function (grunt) {
	
	grunt.registerTask('jsdoc', function () {
		
		var opts = grunt.config.get('jsdoc'),
			done = this.async(),
			args = ['jsdoc', '-c'],
			child;
		
		// push the conf file
		args.push(opts.configFile || 'jsdoc-conf.json');
		
		// ensure we have a output directory
		args.push('-d');
		args.push(opts.dest || 'output');
		
		child = childProcess.spawn("./env.sh", args, {stdio: 'inherit'});

		child.on('exit', done);
		
	});
	
};
