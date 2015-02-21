% Bootplate

enyojs 项目包括一套注用模板，称为 "Bootplate" (BOOTstrap + boilerPLATE) 模板。
它们既可以用于创建新项目，也可以用于布署最终项目。

## Bootplate 快速启动

两个 Bootplate 模板有各自的 GitHub 仓库（例如：
[bootplate](https://github.com/enyojs/bootplate) 和
[bootplate-moonstone](https://github.com/enyojs/bootplate-moonstone)），
我们提供两个简单的方法来使用 Bootplate，都不需要直接使用 Git。

### generator-enyo

我们推荐使用 `generator-enyo` 来开始 Bootplate 应用。它用
[Yeoman](http://yeoman.io/) 来实现这个功能。Yeoman 是一个开源的 Web 开发工具
套件。

**注：** 使用 `generator-enyo`前，你首先需要确定
 [Node.js](http://nodejs.org) 和
 [Node 包管理器](https://npmjs.org) 已经安装在 Mac OS 或 Linux 电脑里。

1. 使用 Node Package Manager `(npm)` 来安装 `generator-enyo`:

	```
		sudo npm install -g generator-enyo
	```

   注意，如果 Yeoman 没有没有安装，会先安装它。（同时也要注意 `sudo` 不是在所有
   平台上都是必需的。）

2. 运行生成器，指定你的新应用的名字：

	```
		yo enyo <myApp>
	```

   这会创建 `<myApp>` 目录并在里面生成 Enyo 应用需要的文件。缺省包含 Onyx UI
   库；想要选择不同的 UI 库，用 `-m` 或 `--mode` 选项，如：

	```
		yo enyo -m=moonstone <myApp>

		yo enyo --mode=moonstone <myApp>
	```

### 另外的方法

1. 从[enyojs.com](http://enyojs.com/get-enyo/)下载 bootplate zip 文件，解压缩并
   打开 `bootplate-moonstone` 文件夹（对于 Onyx 版本来说是 `bootplate` 文件夹）。

2. 在浏览器中载入 `debug.html` 然后看 "Hello World"。

## 开发

到这里，你可以从模板提供的 `source/app.js` 文件来开始普通的开发、测试循环。随着应
用增长，它会包括越来越多的 JavaScript 和 CSS 文件，还包括自带 `package.js` 文件
的库，别忘了把这些包括在你顶级的 `source/package.js` 文件中。 下面将要提到
的 `deploy` 脚本会为了布署而整合他们进入优化过的 JavaScript 和 CSS 文件中。

出于本章的目的，让我们假设你已经完成了所有 "HelloWorld" 应用的工作，准备把注意力
移到布署流程上来了。

现在你应该通过普通的开发和测试流程来改进你的项目，可以从模板提供的 `source/app.js`
文件开始。随着应用的增长，会包括越来越多的 JavaScript 和 CSS 文件，还有包括有自己
`package.js` 的库，要确保在顶级 `source/package.js` 里包括这些内容，下面的
`deploy` 脚本会把它们都组合进优化的 JavaScript 和 CSS 文件里用来布署。

出于本文章的目标，让我们假设已经完成了 “HelloWorld”应用，把注意力转到布署的
流程上来。

## 开发

### 用 generator-enyo

安装 `generator-enyo` 的一个优点就是可以让布署应用变得异常容易。只要进入应用目录
然后执行命令：

```
	yo enyo:deploy
```

在 `deploy` 这个目录里会创建优化后的应用。

你的项目现在已经准备好布署到不同的 HTML5 可用的目标上。想要知道如何布署应用到
特定的平台，见 [特定平台布署](../deploying-apps/platform-specific-deployment.html).

### 另一种方法

如果你不用 `generator-enyo`，用下面的步骤布署应用：

1. 确认你已经在系统里安装了 node.js 。为了让布署脚本运行，你需要 0.8 或以上版
   本。你可以从 [nodejs.org](http://nodejs.org) 下载。

2. 用如下的办法生成布署方案：

   * 打开命令窗 (Windows) 或 终端 (Mac/Linux).

   * 在命令行，进入 bootplate 文件夹的根。

   * 运行 `tools\deploy.bat` 脚本 (Windows) 或 `./tools/deploy.sh` (Mac/Linux)。

 (注：在2.1.1版之前，进入 `tools` 文件后运行 `deploy.bat` 或 `./deploy.sh`)

当构建完成，在 `build` 这个目录下，会有两个压缩的 JavaScript 文件，两个压缩的
CSS 文件；`app.js` 和 `app.css` 包含你的应用代码， `enyo.js` 和 `enyo.css`
包含框架代码。

`build` 文件夹和其它一套补充文件（`index.html` 文件载入你的应用，应用使用的任
何图像或者其它资源等）复制到最终的布署文件夹 `deploy`。

3. 打开布署文件夹，在浏览器中载入 `index.html` ，会看到 "Hello World" (但是很快！)。

现在你的项目为不同的 HTML5 可用的目标作好布署的准备。关于在特定平台上布署应用的
细节，可以参见[特定平台布署](../deploying-apps/platform-specific-deployment.md)。

1. 确定你的系统里已经安装 Node.js 运行时（0.8或更新版）。

2. 按以下方法制造布署版：

    * 打开命令行（Windows）或者终端窗口（Mac/Linux）。

    * 在命令行上转到 bootplate 文件夹的根目录。

    * 运行 `tools\deploy.bat` 脚本（Windows）或者 `./tools/deploy.sh`
        (Mac/Linux).

    当建造完成后，在 `build` 目录下会有两个压缩过的 JavaScript 文件和两个压缩过
    的 CSS 文件；`app.js` and `app.css` 包含应用的代码， `enyo.js` 和 `enyo.css`
    包含框架代码。

    `build` 文件夹和相关的一套文件（`index.html` 文件用来载入应用，任何图像或
    其它应用使用的资源等）复制到最终的布署文件夹 `deploy` 中。

3. 打开 `deploy` 文件夹，在浏览器中载入 `index.html` 可以年到 "Hello
    World" （但是更快）。

## 有关 Bootplate 项目更多的说明

### 嵌入的 Enyo

设置 Bootplate 项目来使用_嵌入的_ Enyo。换句话说， Enyo 库和其它依赖项完全储存
在项目文件夹内。这些资源相对小，并把所有依赖项放在一起，这样可以让开发者控制版
本，也可以轻易布署封装好的包（如：PhoneGap 建造）。

### 开发与布署

当开发和查错时，会需要各种各样的源文件和辅助工具，这些东西在最后的包中并不需要。
因为这个原因，我们有了造应用_发布_版的概念。一个发布指最终生产用的包，已经可以
在应用商店中或其它方法发行了。

bootplate 一个最要的特性就是你能用相对容易的方法来生成发布版。

### 文件夹结构

Bootplate 项目有如下结构：

```
	assets/
	build/
	enyo/
	lib/
	source/
	tools/
	debug.html
	index.html
```

* `assets` 包含图像或其它你项目的数据文件。在这个文件夹里的文件应该在布署的时
     候用到。

* `build` 包含 JavaScript 和 CSS 源代码文件，它们会交到优化脚本去。如果 `build`
    文件夹不存在，它会在运行 `deploy` 脚本时生成一个。

* `enyo` 包含 Enyo 框架源代码方文件。这个文件夹只需要用来查错，可能会为布署而
    删除。

* `lib` 包含不同的插件文件。在 `lib` 中不同的文件夹可能来自不同的源，也许有为
    布署定制的规则。总得来说， `assets` 或 `images` 文件夹是需要的，其它文件
    夹只为查错用。

* `source` 包含源代码文件或其它只用于查错的材料。

* `tools` 包含 `deploy` shell 脚本。

* `debug.html` 载入没有任何建造文件的应用；载入 `debug.html` 是查错最简单的方法。

* `index.html` 只载入使用建造文件的应用。如果建造文件不能用，它会重定位到
     `debug.html`.

### 更新框架代码

`generator-enyo` 使用每个 Bootplate 模板最新的稳定版。（每个版本的 Bootplate
参考特定的 Enyo 核心版和相应的库。）当新的稳定版出来时，`generator-enyo` 工具
特定的 Bootplate 版会更新。

检查 `generator-enyo` 更新可以用命令

```
	sudo npm update -g generator-enyo
```

如果更新版被发现并安装，通过进入应用目录并执行以下命令，你可更新框架代码

```
	yo enyo:update
```

（注意 `generator-enyo` 支持很多附加选项，我们会在短期内写入文档。）

**附加读物**

* [Moonstone 应用教程](moonstone-app-tutorial.html)
* [特定平台的开发](../deploying-apps/platform-specific-deployment.html)
