
#Enyo.js API Reference Generator

The purpose of this project is to coordinate the accumulation and generation of the API documentation reference for [enyo](https://github.com/enyojs/enyo) and its [public libraries](https://github.com/enyojs). It accomplishes this by leveraging available technologies, including itself, according to the limitations of its requirements at the time it was originally authored.

> In the future, [my hope](https://github.com/clinuz) is that the project will be able to better fulfill its ultimate purpose by coordinating all documentation and developer guidance into a single, normalized and cohesive source that is performant, extensible and comprehensive. For now, that is not possible.

### Technologies

##### Required Core Technologies

- [Node.js](http://nodejs.org/) - Everything relies on `node`
- [npm](https://www.npmjs.org/) - Package manager for [Node.js](http://nodejs.org)

##### Incorporated Technologies

Execute `npm install` to install these additional requirements:

- [JSdoc3](http://usejsdoc.org) - The backbone of our documentation syntax and parser/generator
- [Nunjucks](http://mozilla.github.io/nunjucks/) - The templating engine used to generate static HTML content
- [Grunt.js](http://gruntjs.com/) - Task runner to help automate certain portions of generating and building the site
- [Prism.js](http://prismjs.com/) - The code/syntax highlighter in the output
- [JQuery](http://jquery.com/) - The runtime progressive-enhancement JavaScript library used to interact with the static DOM

If you have not installed the Grunt command-line tools, execute `npm install -g grunt-cli`.
