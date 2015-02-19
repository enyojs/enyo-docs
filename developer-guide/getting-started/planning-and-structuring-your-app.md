% 计划和组织应用

Enyo 应用会像单页面 HTML5 文件一样简单，但当我们开始开发很炫的应用时，就会有很多
不同的资源需要管理，版本和信赖项需要跟踪，查错的选项需要控制。为了提供流畅的工作
流，Enyo 团队对于应用结构接受了一些约定。在 [Bootplate](bootplate.html) 应用模板
 (在 [Moonstone](https://github.com/enyojs/bootplate-moonstone) 和
 [Onyx](https://github.com/enyojs/bootplate) 不同) 中可以看到，我们鼓励你基于
  Bootplate 来开发。这些约定在下面也有详细描述。

## 基本的脚手架

Enyo 的设计让插件库，应用和 Enyo 自己都可以移动。使用这些通用的文件夹约定可以极大
地简化资源的管理。

推荐的插件库文件夹结构像这样：

        <plugin>
            assets/
            source/
            package.js
            (readmes, licenses, nfos)

* `source` 包含了 JavaScript 模块，样式表，或者给插件的别的原材料

* `assets` 典型地包含图像或者其它资源，它们既用在生产环境中，也用在开发/查错中。
    你可以放任意多的文件夹，文件夹名称也没什么特别的--比如，工程中可能会有
     `images` 和 `json`文件夹。然而，我们建议你把这些项目话一个叫 `assets`
    的文件夹中，这样最终用户马上就能知道这个文件夹在最终布署时是需要的。

* `package.js` 是一个清单，列明在这个库里的文件。

* `<plugin>` 文件夹通常包含其它项目，比如读我，许可，或者别的文件。

推荐的应用设置也类似，但包括了一些增加项：

        <application>
            assets/
            enyo/
            lib/
            build/
            source/
            tools/
            (readmes, licenses, nfos)
            debug.html
            deploy.json
            index.html
            package.js

* `enyo` 文件夹包含 Enyo 框架源代码的复件。像在下面讨论的，可以把 `enyo` 从别
    的通用的位置引用过来，而不像下面那样嵌入在项目里，但是为了版本和完整性，
    我们建议你在自己的应用中保留一个 Enyo。

* `lib` 文件夹包含所有插件或者其它项目中用到的资源。

* `build` 文件夹是_最小化后_资源的主目录，这些资源是优化过后的 JavaScript 和
    CSS 文件， 这些文件去除了注释，空格和其它对功能性没有决定性影响的特性。在
    JavaScript 文件里，语法有的时候会变化（例如：变量名称可能缩短）来缩小
    文件尺寸。

    `deploy` 脚本运行时会生成最小化的文件。该脚本从 `deploy.json` 中读取配置
    信息然后激发不同的 `minify` 脚本，它才真正执行优化。（注意，一般情况下是没
    必要直接调用 `minify`。）

    `deploy` 运行成功后，在 `build` 里的输出有两个 JavaScript 文件（`app.js`
    是你的应用代码，`enyo.js` 是框架代码）和两个相应的 CSS 文件（`app.css` 和
     `enyo.css`）。

* `tools` 文件夹放置了上述两个版本的 `deploy` 脚本，`deploy.bat` (用于
     Windows) 和 `deploy.sh` (用于 Mac 和 Linux)。

    在开发时，你从 `source` 目录中直接载入应用。（如果你在用 Bootplate模板，你
    可以载入 `debug.html`。)  当你准备布署应用后，执行 `deploy` 脚本来创建应用
    的一个版本，该版本的代码最小化同时删除了不重要的文件。

## 库文件夹和插件

Enyo 的基础设施是倾向能支持各种广泛的插件。这不是技术的要求，这个约定是把插件
放到一个叫 `lib` 的目录里和 `enyo` 相对应：

        <application>
            enyo/
            lib/
                aPluginFolder/
                    assets/
                    source/
                    package.js
                    (readmes, licenses, nfos)

再次注意，标准文件结构用于这个插件。

## 标准快照

如果我们组合两个上面的例子，我会得到完整建议的目录结构：

        <application>
            assets/
            build/
                enyo.js
                enyo.css
                app.js
                app.css
            enyo/
            lib/
                aPluginFolder/
                    assets/
                    source/
                    package.js
                    (readmes, licenses, nfos)
            source/
            tools/
            debug.html
            deploy.json
            index.html
            package.js
            (readmes, licenses, nfos)

如原来提到的，为组织应用的生产版，复制文件树然后运行 `deploy` 来生成布署版本里面
去除子开发和查错的资源。缺省情况下，会在叫 `deploy` 中创建这个版本。

这是布署树建议的文件结构：

        <application>/
            deploy/
                assets/
                build/
                    enyo.js
                    enyo.css
                    app.js
                    app.css
                lib/
                    aPluginFolder/
                        assets/
                        (licenses)
                index.html

注意 `enyo` 文件夹本身对布署来说不是必需的。

## 分享 Enyo

正如前面提到的，也有可能创建一个应用指向共享的 Enyo 复本和/或插件。这个情况下，
共享的资源通常可以在以下位置找到：

        <shared-root>/
            enyo/
            lib/
                aPlugin/

下面的结构显示两个应用，两个都从 `<shared-root>` 载入 Enyo 和插件：

        <apps-root>
            app1/
                assets/
                source/
                index.html
            app2/
                assets/
                source/

这种类型的设置主要用在发布插件，创建一套一起布署的应用，或者为 Enyo 源代码
本身工作。
