
#Enyo.js API Reference Generator

The purpose of this project is to coordinate the accumulation and generation of the API documentation reference for [enyo](https://github.com/enyojs/enyo) and its [public libraries](https://github.com/enyojs). It accomplishes this by leveraging available technologies, including itself, according to the limitations of its requirements at the time it was originally authored.

> In the future, [my hope](https://github.com/clinuz) is that the project will be able to better fulfill its ultimate purpose by coordinating all documentation and developer guidance into a single, normalized and cohesive source that is performant, extensible and comprehensive. For now, that is not possible.

### System requirements

The developer guide requires a unix-y shell. If you wish to build the full docs you will need Linux or Mac OS X. If you're feeling adventurous, you can convert the shell task into a grunt task (possibly with grunt-pandoc or one of the pandoc node modules.

### Technologies

##### Required Core Technologies

- [Node.js](http://nodejs.org/) - Everything relies on `node`
- [npm](https://www.npmjs.org/) - Package manager for [Node.js](http://nodejs.org) (installed with node)
- [pandoc](http://johnmacfarlane.net/pandoc/) - A universal document converter, used to convert markdown to HTML. Be sure to make available on your path if it is not. (tip: 'brew install pandoc' on Mac)

##### Global npm Requirements

- [Grunt.js](http://gruntjs.com/) - Command line client: `npm install -g grunt-cli`
- [Bower](http://bower.io/) - Dependency management tool: `npm install -g bower`

##### Incorporated Technologies

Execute `npm install` and then `bower install` to install these additional requirements:

- [JSdoc3](http://usejsdoc.org) - The backbone of our documentation syntax and parser/generator
- [Nunjucks](http://mozilla.github.io/nunjucks/) - The templating engine used to generate static HTML content
- [Grunt.js](http://gruntjs.com/) - Task runner to help automate certain portions of generating and building the site
- [Prism.js](http://prismjs.com/) - The code/syntax highlighter in the output
- [JQuery](http://jquery.com/) - The runtime progressive-enhancement JavaScript library used to interact with the static DOM

### File System Setup

The enyo-docs scripts assume that enyo and its libraries will be siblings and the libraries will be in the `lib` directory in the standard Bootplate way. In other words:

```
Parent
+- enyo-docs
+- enyo
+- lib
	+- onyx
	+- layout
	+- moonstone
	+- canvas
	+- spotlight
```

Directories to be scanned (and other options for jsDoc) can be found in `jsdoc-conf.json`

### Building The Docs

To build the docs, simply execute grunt:

```
grunt
```

Generated docs go into the `output` directory.

### Additional notes

Two special 'macros' are used within the enyo docs source:

* `$api` - Converted into the relative location of the root document directory. Used primarily in the developer-guide to locate api references.
* `$dev-guide` - Converted into the relative location of the developer guide. Used primarily in the enyo source to point towards the developer guide articles.
