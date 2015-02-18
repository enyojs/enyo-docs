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

**注：** 要用 `generator-enyo`，你首先需要 [Node.js](http://nodejs.org) 和
 [Node 包管理器](https://npmjs.org) 已经安装在 Mac OS 或 Linux 电脑里。

1. Use the Node Package Manager `(npm)` to install `generator-enyo`:

	```
		sudo npm install -g generator-enyo
	```

    Note that this will install Yeoman, if it is not already installed.  (Also
    note that `sudo` may not be necessary on all platforms.)

2. Run the generator, specifying the name of your new app:

	```
		yo enyo <myApp>
	```

    This will create the `<myApp>` directory and populate it with the necessary
    files for an Enyo application.  The Onyx UI library is included by default;
    to choose a different UI library, use the `-m` or `--mode` flag, e.g.:

	```
		yo enyo -m=moonstone <myApp>

		yo enyo --mode=moonstone <myApp>
	```

### 另外的方法

1. 从[enyojs.com](http://enyojs.com/get-enyo/)下载 bootplate zip 文件，解压缩并
   打开 `bootplate-moonstone` 文件夹（对于 Onyx 版本来说是 `bootplate` 文件夹）。

2. 在浏览器中载入 `debug.html` 然后看 "Hello World"。

## 开发

到这里，你可以从模板提供的 `source/app.js` 文件来开始普通的开发、测试循环。随着应用会增长，它会包括越来越多的 JavaScript 和 CSS 文件，还包括自带 `package.js` 文件的库，别忘了把这些包括在你顶级的 `source/package.js` 文件中。 下面将要提到的 `deploy` 脚本会为了布署而整合他们进入优化过的 JavaScript 和 CSS 文件中。

出于本章的目的，让我们假设你已经完成了所有 "HelloWorld" 应用的工作，准备把注意力移到布署流程上来了。

At this point, you would refine your project through the normal cycle of
development and testing, starting with the `source/app.js` file provided in the
template.  As your app grows to include more and more JavaScript and CSS files,
and libraries with their own `package.js` files, make sure to include these in
your top-level `source/package.js` and the `deploy` script described below will
combine them all into optimized JavaScript and CSS files for deployment.

For the purposes of this article, let's assume that you've completed all of your
work on the "HelloWorld" app, and turn our attention to the deployment process.

## 开发

### 用 generator-enyo

One advantage of installing `generator-enyo` is that it makes deploying your app
extremely easy.  Just enter the application directory and issue the command:

```
	yo enyo:deploy
```

The optimized app will be created in a directory called `deploy` within the
application directory.

Your project is now ready to deploy to various HTML5-ready targets.  For details
about deploying apps to specific platforms, see [Platform-Specific
Deployment](../deploying-apps/platform-specific-deployment.html).

### 另一种方法

如果你不用 `generator-enyo`，用下面的步骤布署应用：


1. 确认你已经在系统里安装了 node.js 。为了让布署脚本运行，你需要 0.8 或以上版本。你可以从 [nodejs.org](http://nodejs.org) 下载。

2. 用如下的办法生成布署方案：

   * 打开命令窗 (Windows) 或 终端 (Mac/Linux).

   * 在命令行，进入 bootplate 文件夹的根。

   * 运行 `tools\deploy.bat` 脚本 (Windows) 或 `./tools/deploy.sh` (Mac/Linux)。

 (注：在2.1.1版之前，进入 `tools` 文件后运行 `deploy.bat` 或 `./deploy.sh`)

当构建完成，在 `build` 这个目录下，会有两个压缩的 JavaScript 文件，两个压缩的 CSS 文件；`app.js` 和 `app.css` 包含你的应用代码， `enyo.js` 和 `enyo.css` 包含框架代码。

`build` 文件夹和其它一套补充文件（ `index.html` 文件载入你的应用，应用使用的任何图像或者其它资源等）复制到最终的布署文件夹 `deploy`。
3. 打开布署文件夹，在浏览器中载入 `index.html` ，会看到 "Hello World" (但是很快！)。

现在你的项目为不同的 HTML5 可用的目标作好布署的准备。关于在特定平台上布署应用的细节，可以参见[特定平台布署](../deploying-apps/platform-specific-deployment.md)。

1. Make sure that you have the Node.js runtime (version 0.8 or later) installed
    on your system.

2. Make a deployment build as follows:

    * Open a command prompt (Windows) or terminal window (Mac/Linux).

    * On the command line, navigate to root of your bootplate folder.

    * Run the `tools\deploy.bat` script (Windows) or `./tools/deploy.sh`
        (Mac/Linux).

    When the build is complete, there will be two compressed JavaScript files
    and two compressed CSS files in a folder called `build`; `app.js` and
    `app.css` contain your application code, while `enyo.js` and `enyo.css`
    contain framework code.

    The `build` folder and a set of complementary files (an `index.html` file
    that loads your app, any images or other resources used by the app, etc.)
    are then copied into the final deployment folder, called `deploy`.

3. Open the `deploy` folder, load `index.html` in a browser, and see "Hello
    World" (but faster!).

## 有关 Bootplate 项目更多的说明

### 嵌入的 Enyo

设置 Bootplate 项目来使用_嵌入的_ Enyo。换句话说， Enyo 库和其它依赖项完全储存在项目文件夹内。这些资源相对小，并把所有依赖项放在一起，这样可以让开发者控制版本，也可以轻易布署封装好的包（如：PhoneGap 建造）。
 
Bootplate projects are set up to use _embedded_ Enyo.  In other words, the Enyo
library and other dependencies are stored completely inside the project folder.
These resources are relatively small, and keeping all the dependencies together
allows the developer to control versions and to easily deploy sealed packages
(e.g., PhoneGap builds).

### 开发与布署

When developing and debugging your project, it's common to need various source
files and helper tools that are not needed in the final package.  For this
reason, we have the concept of making an application _deployment_.   A
deployment refers to a final production package, ready for inclusion in an app
store or other method of distribution.

An important feature of bootplate projects is that you can generate deployments
from them with relative ease.

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

* `assets` contains images or other data files for you projects. Files in this
    folder are intended to be necessary for deployment.

* `build` contains JavaScript and CSS source files that have passed through the
    optimization script.  If the `build` folder does not exist, it will be
    created when the `deploy` script is run.

* `enyo` contains the Enyo framework source files.  This folder is only
    necessary for debugging, and may be deleted for deployment.

* `lib` contains various plugin files.  Individual folders in `lib` may come
    from various sources and may have custom rules for deployment.  In general,
    `assets` or `images` folders are required, and other files are only for
    debugging.

* `source` contains the code source files or other debug-only materials.

* `tools` contains the `deploy` shell script.

* `debug.html` loads the application without using any built files; loading
    `debug.html` is generally the easiest way to debug.

* `index.html` loads the application using built files only.  If built files are
    not available, it will redirect to `debug.html`.

### 更新框架代码

`generator-enyo` uses the latest stable version of each Bootplate template.
(And each version of Bootplate, in turn, references a particular version of Enyo
core and each of its associated libraries.)  From time to time, the Bootplate
versions specified by the `generator-enyo` tool will be updated, as new stable
builds become available.

To check for updates to `generator-enyo`, use the command

```
	sudo npm update -g generator-enyo
```

If an updated version was found and installed, you may update the framework code
for a given application by entering the app's directory and issuing the command

```
	yo enyo:update
```

(Note that `generator-enyo` supports a number of additional options, which we
will be documenting shortly.)

**附加读物**

* [Moonstone 应用教程](moonstone-app-tutorial.html)
* [特定平台的开发](../deploying-apps/platform-specific-deployment.html)
