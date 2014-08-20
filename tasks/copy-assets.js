var fs = require('fs-extra'),
	path = require('path');

module.exports = function (grunt) {
	
	grunt.registerTask('copy-assets', function () {
		
		var opts = grunt.config.get('copyAssets'),
			dest = opts.dest || 'output',
			src = opts.src || 'assets';
			
		var cpy = function (from, to) {
			fs.copySync(
				path.resolve(process.cwd(), src, from),
				path.resolve(process.cwd(), dest, to)
			);
		};
			
		// for js includes, we specify and install specific versions via bower but we
		// arbitrarily map the correct include file into the output directory (for now)
		cpy('js/jquery/dist/jquery.min.js', 'js/jquery.min.js');
		cpy('js/jquery-hashchange/jquery.ba-hashchange.min.js', 'js/jquery.ba-hashchange.min.js');
		cpy('main.js', 'js/main.js');
		
	});
	
};