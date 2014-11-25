var fs = require('fs-extra'),
	path = require('path');

module.exports = function (grunt) {
	
	grunt.registerTask('copy-assets', function () {
		
		var opts = grunt.config.get('copyAssets'),
			dest = opts.dest || 'output',
			src = opts.src || 'assets';
			
		var cpy = function (from, to) {
			fs.copySync(
				path.join(process.cwd(), src, from),
				path.join(process.cwd(), dest, to)
			);
		};

		cpy('css/prism.css', 'css/prism.css');
		//cpy('css/bootstrap.min.css', 'css/bootstrap.min.css');

		cpy('fonts/', 'fonts/');

		// for js includes, we specify and install specific versions via bower but we
		// arbitrarily map the correct include file into the output directory (for now)
		cpy('js/jquery/dist/jquery.min.js', 'js/jquery.min.js');
		cpy('js/jquery-hashchange/jquery.ba-hashchange.min.js', 'js/jquery.ba-hashchange.min.js');
		cpy('js/main.js', 'js/main.js');
		cpy('js/prism.js', 'js/prism.js');
		cpy('js/bootstrap.min.js', 'js/bootstrap.min.js');

	});
	
};