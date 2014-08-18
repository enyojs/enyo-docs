var fs = require('fs-extra'),
	path = require('path');

module.exports = function (grunt) {
	
	grunt.registerTask('copy-assets', function () {
		
		var opts = grunt.config.get('copyAssets'),
			dest = opts.dest || 'output',
			src = opts.src || 'assets';
			
		// for js includes, we specify and install specific versions via bower but we
		// arbitrarily map the correct include file into the output directory (for now)
		fs.copySync(
			path.resolve(process.cwd(), src, 'js/jquery/dist/jquery.min.js'),
			path.resolve(process.cwd(), dest, 'js/jquery.min.js')
		);
		
	});
	
};