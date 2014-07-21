
#Enyo.js API Reference Generator

The purpose of this project is to coordinate the accumulation and generation of the API documentation reference for [enyo](https://github.com/enyojs/enyo) and it's [public libraries](https://github.com/enyojs). It accomplishes this by leveraging available technologies, including itself, according to the limitations of its requirements at the time it was originally authored.

> In the future, [my hope](https://github.com/clinuz) is that the project will be able to better fulfill its ultimate purpose by coordinating all documentation and developer guidance into a single, normalized and cohesive source that is performant, extensible and comprehensive. For now, that is not possible.

### Technologies

##### Required Core Technologies

- [Node.js](http://nodejs.org/) - Everything relies on `node`
- [npm](https://www.npmjs.org/) - Package manager for [Node.js](http://nodejs.org)
	
##### Incorporated Technologies

- [JSdoc3](http://usejsdoc.org) - The backbone of our documentation syntax and parser/generator
- [Nunjucks](http://mozilla.github.io/nunjucks/) - The templating engine used to generate static HTML content
- [Enyo.js](https://github.com/enyojs/enyo) - The client-side JavaScript framework used to maintain the lifecycle and user-interaction with the site
- [Grunt.js](http://gruntjs.com/) - Task runner to help automate certain portions of generating and building the site