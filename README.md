
#Enyo.js API 参考生成器

本项目的目的是为 [enyo](https://github.com/enyojs/enyo) 和它的[公共库](https://github.com/enyojs)积累和生成 API 参考文档。这个目的可以通过已有的技术力量，包括enyo自己， 根据那个时候要求自己编写的局限性。

> 这个项目的最终目的是协调所有文档和开发指南，让它们整合在一个单一，标准化和内聚的源内，这个源可展示，可扩展，可理解。今后，[我希望](https://github.com/clinuz) 这个项目能更好地满足这个目的。目前为止，这个愿望不可能实现。

### 系统要求

开发者指南要求 Unix 类的 shell。如果你希望创建完整的文档，你需要 Linux 或者 Mac OS X。如果你想冒险，你可以把 shell 任务转换成 grunt 任务（可能用 grunt-pandoc 或者 pandoc node 模块）。

### 技术

##### 要求的核心技术

- [Node.js](http://nodejs.org/) - 有关 `node` 的所有东西
- [npm](https://www.npmjs.org/) - [Node.js](http://nodejs.org) 的包管理(已经与node一起安装)
- [pandoc](http://johnmacfarlane.net/pandoc/) - 通用文档转换工具，用来将markdown文件转换成HTML。确保它在你的路径中可以使用。(小窍门：'brew install pandoc' 在 Mac里用)

##### 要求全局 npm

- [Grunt.js](http://gruntjs.com/) - 命令行客户端： `npm install -g grunt-cli`
- [Bower](http://bower.io/) - 依赖管理工具： `npm install -g bower`

##### 集成技术

在 *enyo-docs* 目录下运行 `npm install` 然后 `bower install` 来安然更多需要的东西。

- [JSdoc3](http://usejsdoc.org) - 本文档最主要的语法和解析/生成工具
- [Nunjucks](http://mozilla.github.io/nunjucks/) - 模板引擎，用于生成静态 HTML 内容
- [Grunt.js](http://gruntjs.com/) - Task runner to help automate certain portions of generating and building the site
- [Prism.js](http://prismjs.com/) - 在输出时用的代码/语法高亮工具
- [JQuery](http://jquery.com/) - 作为运行时的先进增强JavaScript库，用于静态 DOM 的交互

### 文件系统设定

enyo-docs 脚本假定 enyo 和它的库是兄弟关系，库是在 *lib* 目录中，像 Bootplate 标准的方式。换句话说：

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

被扫描的目录（和其它 jsDoc 选项）可以在 *jsdoc-conf.json* 里发现。

### 创建文档

为了创建文档，简单地在 *enyo-docs* 目录中运行 grunt：

```
grunt
```

生成的文档会在 *output* 目录内。

### 更多注解

两个特别的 'macros' 会用在 enyo 文档源中：

* `$api` - 转换成文档根目录相对位置。主要用在 developer-guide 里定位 api 参照。
* `$dev-guide` - 转换成开发者指南的相对位置。主要用于在 enyo 源内指向开发者指南的文章。
