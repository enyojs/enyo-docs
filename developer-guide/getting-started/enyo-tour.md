% Enyo: 简明教程

感谢下载Enyo！本文档帮助你熟悉这个框架是怎么组成的以及各个部分提供了什么。

在一个 Enyo 发行版中，你会发现如下文件夹：

* **enyo** - 核心
* **lib** - 所有插件，附加库放置的地方
* **moonstone** - UI 组件工具箱，为电视优化过
* **onyx** - Enyo 最初的 UI 库，为移动设备优化过
* **spotlight** - 一个控制焦点状态的专用库
* **layout** - 布局组件集合
* **enyo-ilib** - 提供本地化服务的库
* **canvas** - 用于生成基于 HTML5 canvas 视图的组件
* **extra** - 增加的工具组件

## Enyo

框架核心，在源码中简单认为是 `enyo`，它提供了强大的特性来开发复杂的应用和附加库，这些都是以模块化的 Web 栈基础之上的：

* **对象封装，继承，有等级的所有权** - 类和组件（Kinds and Components）
* **视图和DOM插件模型** - Ui组件和控制（UiComponent and Control）
* **事件路由** - 分发和信号（Dispatcher and Signals）
* **服务器模型** - Async and Ajax
* **基础的 HTML 组件** - 基础用户界面（Base UI）
* **触摸支持** - 触摸滚动和手势仿真
* **包载入** - `enyo.depends()` 和 `package.js`

这些部分实际上是分享的（它可以很容易地创建小型 Enyo），但我们相信它们形成了一个有用的工作集合，所以我们把它们作为 Enyo 核心呈现给大家。

以下所有东西都是基于核心的可选项。可以根据你应用的需要选择。不过，这些只是一个参考库，我们会有一个大生态圈，那里的插件可能会有不同的外观和感觉，布局选项，服务封装等。请到 [Enyo 社区像册](http://enyojs.com/gallery)去看看创建和分享一个组件或插件库是多么容易的事。

## Moonstone

Moonstone 库提供了一个美化过的图形界面组件，它特意为电视应用进行了设计和优化。它正在扩展，目前包括：

* **按钮**（普通，图标，收音机按钮和触发按钮）
* **输入**（文本输入框，文本输入区域，富文本输入区域）
* **列表**
* **弹出菜单**
* **标题栏**
* **分组框**
* **进度条**
* **滑块**

## Onyx

Onyx 是原先和Enyo一起发布的UI库。虽说Moonstone大部分替代了它，但它偶尔也会露一手。

Onyx, the original UI library that shipped with the Enyo framework, remains the
library of choice for mobile device apps.  While Moonstone has generated most of
the publicity recently, new Onyx development is also in the works.  We encourage
you to check out the [Onyx source](https://github.com/enyojs/onyx), and stay
tuned.

## Spotlight

The Spotlight library manages focus state, enabling users to navigate through
Enyo applications in either 5-way mode (using the directional arrow and Return
keys on a keyboard, or the corresponding buttons on a traditional television
remote control) or pointer mode (using a mouse or touchscreen).

## Layout

Enyo 组件也许可以用纯 HTML/CSS 技术来布局，我们提供的布局库让你更容易，更高效而且跨浏览器地解决布局的需要：

* **自适应的行和列**
* **列表**
* **面板**

你可以在[这](https://github.com/enyojs/layout)看到有关布局的选项。

## enyo-ilib

The `enyo-ilib` library provides localization support for the Enyo framework.
The heavy lifting is done by the open-source `iLib` library; `enyo-ilib` is
essentially a compatibility layer, making it easy for Enyo app developers to
access the powerful features of `iLib` without having to deal with messy,
locale-specific details.

## 画布（Canvas）

Enyo 封装同样适用于以画布为基础的组件，它像传统UI一样工作，我们提供了一个库抽象了画布的通用功能象 Enyo 组件：

* **画布和画布控制**
* **形状**（圆，矩形）
* **文本**
* **图像**


You can easily extend these to create complex graphical applications and games,
such as our [Pirate Pig](http://enyojs.com/samples/piratepig) canvas demo app.

## 扩展（Extra）

"extra"扩展库包括了一些有用的工具组件，范例中使用了这些组件。

## 开始（Bootplate）


Bootplate 是一个模板，它给开发新 Enyo 应用提供了一个完整的解决方案，并且包括在每一个发行版中。它包括当前版本的 Enyo 和最常用的库（Moonstone 和 Layout），也包括了用来布置应用的最小化脚本，源码和附件。从这里开始使用 Bootlate。

The [Bootplate](bootplate.html) templates provide complete starter projects
containing everything you need to develop and deploy Enyo apps out of the box.
These templates contain current versions of Enyo, along with the most common
libraries used by app developers (Moonstone or Onyx, Layout, etc.) and scripts
to minify and create deployable versions of the source and assets.

## 阅读更多

* 如果你喜欢一步一步介绍 Enyo，这里是 [Moonstone 应用教程](moonstone-app-tutorial.md)。
* 立即写 Enyo 应用，去 [Bootplate](bootplate.md)。
* 了解更多 Enyo 应用结构细节，看[计划和构建你的应用指南](planning-and-structuring-your-app.md)。
* 还不能满足你？看当前文档的[全部列表](../index.md)，
