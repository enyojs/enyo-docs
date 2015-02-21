% 与 Enyo 的第一步

## 准备开发环境

作为 Enyo 开发者，你有很大的自由去选择开发平台和工具来写你的应用代码。你可能在
Windows, Mac, 或者 Linux 环境。仅需要一些简单的工具就可以弄好并运行了。

### 文本编辑

写 Enyo 代码，只需要文本编辑器。任何一种编辑器都足够用，包括基础的自由软件如
[Notepad++](http://notepad-plus-plus.org/)（Windows） 或者
[TextWrangler](http://www.barebones.com/products/textwrangler/)（Mac）。
对那些物有所值的软件，Enyo 团队倾向用 [Sublime Text](http://www.sublimetext.com/)，
该软件可在 Mac 和 Windows 下使用，或者只能在 Mac 下使用
的 [TextMate](http://macromates.com/)。

### Git 客户端

目前发行 Enyo 核心、库和“bootplate" 用的主要是 GitHub，所以你需要有现代的 Git
客户端安装在机器里。在本文档里，我们用 git 命令行，但你也可以使用喜欢的图形界面
git 客户端。

你可以在 [git-scm.com](http://git-scm.com/downloads)下载你的操作系统对应的 git
客户端。

（注意：Enyo "bootplate" 模板同样在 **LG webOS TV SDK** 中一起分发，它可能使用
在 SDK 中的 `ares-generate` 命令生成，该命令不需要 Git。 如果使用
**LG webOS TV SDK** ，而且不打算在你的应用中用 Git 来控制版本，你不需要安装
Git 客户端。）

### Node.js

Enyo 框架包含了基于 `Node.js` 的工具用来最小化和布署应用。 `Node.js` 是服务器端
的运行时（像是服务器端的 Perl, Python, Ruby 和其他语言的解释器）用于在服务器上运
行 JavaScript 脚本。甚至可以只用 `Node.js` 本身作为主 Web 服务器（下面会看到）。

可以在 [nodejs.org](http://nodejs.org/) 下载你的操作系统对应版本的 `node.js`。

### Web 浏览器和 Web 服务器

在开发过程中，你可以用任何现代浏览器来测试你的代码。也许在浏览器中可以直接打开本
地文件，但我们还是强烈建议你通过 HTTP 服务器来打开应用。这个建议有很多好处，其
中包括有能力从远程设备进行测试。

在 Web 服务器上运行你的应用可以避免 Chrome 浏览器对 AJAX 的安全限制。如果想选择
在 Chrome 开发，*并且*直接从文件系统打开你的文件，你需要在命令行启动浏览器并加
上 `"--allow-file-access-from-files"` 这个参数。（在Windows中，你可以创建一个
快捷链接到 `Chrome.exe` ,并把这个参数放在快捷链接的目标属性中。然后每次运行浏览
器的时候都使用这个快捷链接。在 Mac 和 Linux 中有类似的解决办法。）

如果你目前没有运行本地 Web 服务器，你会发现安装 Apache/MySQL/PHP 软件套装很方
便，比如 [BitNami WAMPStack](http://bitnami.org/stack/wampstack) (Windows)
或者 [MAMP](http://www.mamp.info/en/index.md) (Mac)。

像前面提到的，另外一个解决办法是用 `Node.js` 来创建自己的简单 HTTP 服务器。
下面告诉你怎么做：

* 安装 `Node.js`。

* 用 npm 安装 `serve` 包：

```
        npm install -g serve
```

* 创建一个目录用于存放服务器的脚本，进入该目录，然后运行 `serve` 来启动服务器，
例如：

    + `mkdir <my_doc_root>`
    + `cd <my_doc_root>`
    + `serve`

* 可以从 3000 端口来接入你的应用，用 URL 可以是 `http://localhost:3000/debug.html`。

## 获取 Enyo 源代码

### Bootplate

如果你是 Enyo 开发的新人，你会希望把 Enyo 源代码作为现成的项目模板的一部分。
这个 enyojs 项目包括这样一些我们称为 "bootplate" (BOOTstrap + boilerPLATE) 模板
的东西。每个 bootplate 模板会有 Enyo 核心代码，一个或多个与项目相关的库，一个
“你好世界”这种应用，和一个推荐的文件夹结构用来组织本应用中的文件。关于
bootplate 模板，包括设置介绍，见[Bootplate：在5分钟内用 Enyo 从0到60](bootplate.md)。

想用 Moonstone UI 库来启动应用，克隆 `bootplate-moonstone` 仓库到本地机器里：

### 独立的代码仓库

当然，你也可以自由克隆 `enyo` 或者任何其它独立的库代码仓库，如：

```
    git clone https://github.com/enyojs/enyo.git <myEnyoDirectory>
```

如果你计划把改变提交回代码库，请确定创建自己的代码仓库分支并在本地机器上克隆这个
代码仓库分支。

## 下一步

如果你还没做，请通读 [Moonstone 应用教程](moonstone-app-tutorial.md)。现在你
有了所有必需的工具，试着按照教程的步骤在你自己的机器里运行这些代码。

如果你觉得有困难，或者你想要自己探索，参见 [Bootplate](bootplate.md) 文档中一
些有用的提醒。
