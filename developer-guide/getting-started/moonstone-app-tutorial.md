﻿% 教程：创建 Moonstone 应用

## 介绍

在本教程中，我们用 Moonstone UI 库来创建一个电视应用。该应用演示 Flickr 搜索，
并按照 Moonstone 的 ”总能看见“面板模式。

我们将会演练创建 "Search" 和 "Detail" 面板视图，精心制作
 [enyo.Source]($api/#/kind/enyo.Source)，
[enyo.Collection]($api/#/kind/enyo.Collection) 和
[enyo.Model]($api/#/kind/enyo.Model) 子类来满足 Flickr API 的需要，并绑定为视图
返回的数据--这些都是在数据驱动的应用中，你需要在交互活动中处理的典型事件。 

如果你想对我们最后会得到什么结果有个印象，你可以[查看完整的应用](http://enyojs.github.io/moon-flickr) 或
[浏览完整的源代码](https://github.com/enyojs/moon-flickr)。

## 1. 设置你的开发环境

有四种主要工具用来组成不可分割的 Enyo 开发：

* 你喜爱的 **代码编辑器**
* **Git 客户端**，用来签出 Enyo bootplate 模板
* **Node.js**，服务器端的 JavaScript 运行时，用来最小化你完成后的应用
* **Web 浏览器** 和 **Web 服务器**。虽然不是严格要求，服务器可以避免 Chrome 里对
浏览器的安全限制，还包括其它好处。

[和 Enyo 的第一步](first-steps.md) 提供了获得和安装这些工具的详细介绍，还有相应的建议选项（比较赞同的）。如果你已经熟悉这些工具，随你自己的想法安装并进入第2步。

## 2. 获取 "bootplate" 项目模板

我们从克隆 GitHub 里的 `bootplate-moonstone` 项目模板开始。

虽然 [Enyo 第一步](first-steps.md) 包含了本步骤，但重新写一下 Git 的重要命令没有坏处：

```
    git clone --recursive --branch 2.5.1 https://github.com/enyojs/bootplate-moonstone.git <myapp>
```

## 3. 定制应用的样本文件

克隆完成后，我们要对模板进行一些定制以适应新应用。

* 在 `debug.html` 和 `index.html` 里，设定 `<title>` 标签为 `"Moonstone Flickr"`。

* 在 `source/views/views.js` 中设置名字空间 (`"flickr"`)，我们定制的类就从
  `MyApp.MainView` 重命名成 `flickr.MainView`。

* 同样，在 `source/app.js` 中相应地改变 `MyApp.Application` 和 `MyApp.MainView` 的
  名字为 `flickr.Application` 和 `flickr.MainView`。

**仅供参考：**  The files we just modified comprise the set of
files involved in the startup of your bootplate app.  When `debug.html` (or,
after deployment, `index.html`) is opened, it first loads the Enyo core CSS and
JavaScript files, along with the application's top-level `package.js`.  The
top-level `package.js` loads any Enyo libraries your app depends on, and then
the application's `app.js` file.  `app.js` defines your top-level
[enyo.Application]($api/#/kind/enyo.Application), registers an `enyo.ready`
callback (fired when the DOM is ready), and creates an instance of the
application.  Finally, by default, `enyo.Application` automatically renders the
"main view" upon instantiation--i.e., it creates and renders the `MainView` kind
from `main.js`, thus starting your app.

## 4. 设置主视图

Since this app will be based on the Moonstone "Always Viewing" Panel pattern,
let's set up our main view to have a [moon.Panels]($api/#/kind/moon.Panels)
instance (which will be responsible for maintaining a stack of panels and
transitioning them left and right) and a single instance of
[moon.Panel]($api/#/kind/moon.Panel), the base kind for views added to
`moon.Panels`.

**编辑文件： source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.MainView",
        classes: "moon enyo-fit",
        components: [
            {kind: "moon.Panels", classes: "enyo-fit", pattern: "alwaysviewing", popOnBack: true, components: [
                {kind: "moon.Panel", title: "First Panel"}
            ]}
        ]
    });
```

Here we've created a simple kind named `flickr.MainView`, which is a subkind of
[enyo.Control]($api/#/kind/enyo.Control) (the default kind when no `kind`
property is specified).  As per our plan, the main view contains an instance of
`moon.Panels`, which in turn contains an instance of `moon.Panel`.

**本代码更多的注释：**

* **类**

    * The `moon` class applies standard Moonstone styling to the application.
        This is required at the top-level view of Moonstone apps.

    * The `enyo-fit` class fits the view to the bounds of its parent (in this
        case, `document.body`) via absolute positioning.

* **`moon.Panels` properties**

    * Applying `enyo-fit` to the `moon.Panels` kind again fits it to its parent
        (`flickr.MainView`), resulting in the panels' being set to full-screen.

    * Setting `pattern` to `"alwaysviewing"` configures `moon.Panels` to arrange
        panels according to the "Always Viewing" panel pattern.  In short, the
        active panel(s) will be positioned over the right 50% of the screen with
        semi-transparency, so that the underlying fullscreen content of the app
        (e.g. video player, audio player, photos, etc.) is partially visible.

    * By default, `moon.Panels` will not automatically remove panels as the user
        navigates back up the breadcrumb history.  Setting `popOnBack: true`
        automatically pops panels off the stack (destroying them) once they are
        moved back offscreen.

**专家小窍门：** Strictly speaking, `enyo-fit` will position the control within
    the bounds of the control's "offset parent", which is an HTML term referring
    to the first parent element up the DOM hierarchy from the element that is
    either `position: absolute` or `position: relative`.  This will skip over
    parents that are `position: static` (the default for new elements), which
    may be confusing at first.  To force a parent to be a control's "offset
    parent", simply set `position: relative` on the intended parent's CSS.

**[在 JSFiddle 中查看第4步代码的结](http://jsfiddle.net/enyojs/84DRr/)**

## 5. 为搜索创建面板

In the previous step, we added a dummy `moon.Panel` instance as a child of the
`moon.Panels`.  Now, let's create a `moon.Panel` subkind to implement the view
in which the user searches for photos and browses the results.

**加入文件： source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        kind: "moon.Panel",
        title: "Search Flickr",
        titleBelow: "Enter search term above",
        headerOptions: {inputMode: true, dismissOnEnter: true},
        handlers: {
            onInputHeaderChange: "search"
        },
        search: function(inSender, inEvent) {
            alert(inEvent.originator.get("value"));
        }
    });
```

Looking at `flickr.SearchPanel`, we see that it accepts input in the header and
catches the `onInputHeaderChange` event that's generated, using a handler method
called `search()`.  We'll eventually use this method to fetch search results
from the Flickr API.

**本代码更多的注释：**

* **headerOptions** - Internally, `moon.Panel` contains a
    [moon.Header]($api/#/kind/moon.Header) as part of its "chrome" (a term we
    use to refer to controls contained within another kind, which are not
    accessible to the _user_ of the kind).  Many common properties of
    `moon.Header`, such as `title`, `titleBelow`, and so on, are brought forward
    as properties on `moon.Panel` for convenience.  If there are other
    properties of the header that you would like to configure, you can set them
    on a `headerOptions` property.

    * **inputMode** - Configures the header to allow typing in the title area.

    * **dismissOnEnter** - Configures the input in the header to blur the input
        (and dismiss any virtual keyboard) when the user presses **Enter**.

* **handlers**

    * The `handlers` block catches events bubbled from this kind or any of its
        children.  Here we set up this kind to call its `search()` function when
        `onInputHeaderChange` is caught.

    * `onInputHeaderChange` is an event bubbled from `moon.Panel`'s internal
        `moon.Header` when the input value changes, e.g., when the user presses
        **Enter** or the input loses keyboard focus.

* **search()**

    Note the signature of the handler function.  `search()` takes two arguments:
    `inSender` and `inEvent`.  This is a common signature for all Enyo event
    handlers.  `inSender` is a reference to the last control that bubbled the
    event--in this case, the `flickr.SearchPanel` instance itself.  `inEvent`
    contains any information related to the event, including the `originator`, a
    reference to the control that initially bubbled the event (i.e., the header
    inside the panel).

* By calling `inEvent.originator.get("value")`, we can retrieve the current
    value of the input from the `value` property on `moon.Header`.  For now, we
    just display the value in an alert to make sure everything is working
    properly.

Returning to `flickr.MainView`, we'll use our new `flickr.SearchPanel` as the
first panel in the main view's `moon.Panels`, replacing the generic `moon.Panel`
that we declared in Step 4.

**Edit file: source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.MainView",
        classes: "moon enyo-fit",
        components: [
            {kind: "moon.Panels", classes: "enyo-fit", pattern: "alwaysviewing", popOnBack: true, components: [
                {kind: "flickr.SearchPanel"}  // Use our new flickr.SearchPanel
            ]}
        ]
    });
```

**[在 JSFiddle 中查看第5步代码的结果](http://jsfiddle.net/enyojs/d7dr3/)**

## 6. 在搜索面板中加入网格布局

Next, let's add a [moon.DataGridList]($api/#/kind/moon.DataGridList) to the
search panel.  We'll use this to display thumbnails of the search results.

**Edit file: source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",	
        kind: "moon.Panel",
        title: "Search Flickr",
        titleBelow: "Enter search term above",
        headerOptions: {inputMode: true, dismissOnEnter: true},
        handlers: {
            onInputHeaderChange: "search"
        },
        components: [
            {kind: "moon.DataGridList", fit: true, name: "resultList", minWidth: 250, minHeight: 300, components: [
                {kind: "moon.GridListImageItem", imageSizing: "cover", useSubCaption: false, centered: false}
            ]}
        ],
        search: function(inSender, inEvent) {
            alert(inEvent.originator.get("value"));
        }
    });
```

Here we've added a `components` block, the contents of which are placed under
the header inside of the panel.  Within the `components` block, we have a
`moon.DataGridList`, which has a
[moon.GridListImageItem]($api/#/kind/moon.GridListImageItem) that serves as the
list template that is repeated for each model.

**Additional notes on this code:**

* **moon.DataGridList**

    * **fit: true** - Note that the `moon.DataGridList` instance has its `fit`
        property set to `true`.  By default, `moon.Panel` lays out the child
        components under the header using
        [enyo.FittableRowsLayout]($api/#/kind/enyo.FittableRowsLayout).
        That layoutKind causes one component with `fit: true` to be resized to
        take up any remaining space left by the other components.  In this case,
        since the grid list is the only component, it will expand to fill the
        entire space under the header.

    * **minWidth** and **minHeight** - `moon.DataGridList` lays out and sizes
        its child components in a grid according to the `minWidth` and
        `minHeight` (and `spacing`) properties.  The grid uses a "fixed-spacing"
        algorithm that ensures there is no unused whitespace in the grid area by
        starting with the minimum size specified, and then scaling up the size
        of the items to completely fill a row, while maintaining the aspect
        ratio of the original minimum size.  This ensures that grids are
        uniformly spaced with no unwanted whitespace, regardless of the size of
        the grid area.

* **moon.GridListImageItem** - For details on the options passed to this
    control, see the [API docs]($api/#/kind/moon.GridListImageItem).

If you try running the app after these changes, you shouldn't see any changes
from the previous step.  That's because the DataGridList requires data in order
to render items; right now, we have none.  In the next step, we'll rectify this
situation.

**[在 JSFiddle 中查看第6步代码的结](http://jsfiddle.net/enyojs/45Zn4/)**

## 7. 绑定数据集与网格

As we've just seen, a DataGridList requires a collection of data to drive the
set of items rendered in the list.  [enyo.Collection]($api/#/kind/enyo.Collection)
is a subkind of [enyo.Component]($api/#/kind/enyo.Component) that provides an
array-like data structure for handling instances of
[enyo.Model]($api/#/kind/enyo.Model), with support for observing additions to
and deletions from the array.  The `DataGridList` will render one instance of
the controls in its `components` block for each model contained in the
collection.  The model will then be set to the `model` property of the top-level
control for each item, and bindings from the `model` property into the view
properties will control how data from each model is represented in the view.

**仅供参考：** If you're interested in a complete overview of
Enyo's data-layer features, including bindings, observers, computed properties,
models, collections, and data-aware controls (such as DataGridList), see [Building
Data-Driven Apps](../building-apps/managing-data/building-data-driven-apps.html).

To make this grid go, first we'll create a generic `enyo.Collection` when the
panel is instantiated by overriding the `SearchPanel` control's `create()`
method.  We set the new collection as the value of an instance variable on the
control, which we'll call "photos":

**编辑文件：source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        create: function() {
            this.inherited(arguments);
            this.set("photos", new enyo.Collection());
        }
        ...
    });
```

Next, we'll add a binding from that instance variable to the `collection`
property of our DataGridList:

**编辑文件：source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        bindings: [
            {from: "photos", to: "$.resultList.collection"}
        ],
        ...
    });
```

Then we'll add bindings from the `model` property on GridListImageItem (which,
you may recall, will be retrieved from the collection and set on each item by
the DataGridList) to properties on the `GridListImageItem`.  Note that this
assumes each model will have a schema that includes properties named `title` and
`thumbnail`.

**编辑文件：source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        components: [
            {kind: "moon.DataGridList", ..., components: [
                {kind: "moon.GridListImageItem", ..., bindings: [
                    {from: "model.title", to: "caption"},
                    {from: "model.thumbnail", to: "source"}
                ]}
            ]}
        ],
        ...
    });
```

Finally, let's give our new collection some placeholder data, to make sure it's
all hooked up correctly.  We'll remove this once we have actual data fetched
from Flickr to use.

**编辑文件：source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        create: function() {
            this.inherited(arguments);
            this.set("photos", new enyo.Collection([
                {title: "Photo 1", thumbnail: "http://lorempixel.com/300/300/?1"},
                {title: "Photo 2", thumbnail: "http://lorempixel.com/300/300/?2"},
                {title: "Photo 3", thumbnail: "http://lorempixel.com/300/300/?3"},
                {title: "Photo 4", thumbnail: "http://lorempixel.com/300/300/?4"}
            ]));
        },
        ...
    });
```

The final `flickr.SearchPanel` implementation for this step should look like this:

**文件：source/views/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        kind: "moon.Panel",
        title: "Search Flickr",
        titleBelow: "Enter search term above",
        headerOptions: {inputMode: true, dismissOnEnter: true},
        handlers: {
            onInputHeaderChange: "search"
        },
        components: [
            {kind: "moon.DataGridList", fit: true, name: "resultList", minWidth: 250, minHeight: 300, components: [
                {kind: "moon.GridListImageItem", imageSizing: "cover", useSubCaption: false, centered: false, bindings: [
                    {from: "model.title", to: "caption"},
                    {from: "model.thumbnail", to: "source"}
                ]}
            ]}
        ],
        bindings: [
            {from: "photos", to: "$.resultList.collection"}
        ],
        create: function() {
            this.inherited(arguments);
            this.set("photos", new enyo.Collection([
                {title: "Photo 1", thumbnail: "http://lorempixel.com/300/300/?1"},
                {title: "Photo 2", thumbnail: "http://lorempixel.com/300/300/?2"},
                {title: "Photo 3", thumbnail: "http://lorempixel.com/300/300/?3"},
                {title: "Photo 4", thumbnail: "http://lorempixel.com/300/300/?4"}
            ]));
        },
        search: function(inSender, inEvent) {
            alert(inEvent.originator.get("value"));
        }
    });
```

**本代码更多的注释：**

* **create()** - The `create()` function is called as part of every component's
    lifecycle.  Superkinds of your controls will also have their `create()`
    functions called, so it is important to always call the superkind's
    implementation by calling `enyo.inherited(arguments);`.  This is a standard
    way of calling the supermethod.  You can read more about the Enyo component
    lifecycle in [Kinds](../key-concepts/kinds.html),
    [Components](../key-concepts/components.html), and
    [Controls](../key-concepts/controls.html).

* **enyo.Collection** - A collection may get its data statically, from a
    passed-in array of records, or dynamically, from a call to the `fetch()` API
    on the collection.  At the moment, we're just using static data.

**[View the code and results of Step 7 in JSFiddle](http://jsfiddle.net/enyojs/D4qAD/)**

## 8. 为 Flickr API 创建数据源

Dummy data does not make for an interesting app, so in the next few steps, we'll
start making custom data-related kinds for interacting with the Flickr API.  In
this step, we'll build a subkind of [enyo.Source]($api/#/kind/enyo.Source) to
fetch data from Flickr.

Enyo provides a layered approach to defining logic specific to fetching,
committing changes, and deleting records from back-end data sources.  At the
foundation, these are based on `enyo.Source`, which implements an abstract API for
the `fetch`, `commit`, `find`, and `destroy` operations common to all
collections and models you'll retrieve from a given back-end.  Subkinds of
`enyo.Collection` and `enyo.Model` may then specify a default data source to
perform these operations, fetching/committing/destroying data in the collection
or model on behalf of itself, often by passing properties on the model or
collection subkind that provide the source with information about how to
retrieve the data.  A model or collection may also provide overrides for any of
these operations on a case-by-case basis as needed.

Enyo provides two concrete data sources by default, one for fetching data from
an Ajax source using XHR ([enyo.AjaxSource]($api/#/kind/enyo.AjaxSource))
and one for fetching data from a Jsonp source
([enyo.JsonpSource]($api/#/kind/enyo.JsonpSource)).  Both of these sources
assume a REST interface by default, but may be customized.

We will be using Flickr's Jsonp Web services; this will make testing in the
browser easier, since Jsonp lets us avoid the cross-origin security restrictions
that browsers implement.  As such, our source will extend `enyo.JsonpSource`.

First, we'll create a `flickr.Source` subkind that sets the `urlRoot` property,
which `enyo.JsonpSource` uses as the base URL for making requests.  This URL is
common to all requests to the Flickr API, so it makes sense to specify it on the
source directly:

**Add to file: source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.Source",
        kind: "enyo.JsonpSource",
        urlRoot: "https://api.flickr.com/services/rest/",
    });
```

Next, let's override the fetch/commit/destroy API that `enyo.JsonpSource`
provides to better suit our needs.  Since we'll be utilizing read-only portions
of the API, we only need to override the `fetch()` function.  

Specifically, we'll take the `opts` object used by `enyo.JsonpSource`'s
`fetch()` implementation and add properties that all Flickr requests will need.
This includes customizing the `callbackName` property to match the one expected
by Flickr's API.  We'll also set the `api_key` and `format` keys on the `params`
hash, which will be expanded into query string parameters on the Jsonp request.

**编辑文件：source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.Source",
        kind: "enyo.JsonpSource",
        urlRoot: "https://api.flickr.com/services/rest/",
        fetch: function(rec, opts) {
            opts.callbackName = "jsoncallback";
            opts.params = {};
            opts.params.api_key = "2a21b46e58d207e4888e1ece0cb149a5";
            opts.params.format = "json";
            this.inherited(arguments);
        }
    });
```

Last, we need to register our newly-created source, to make it available for use
by models and collections:

**Add to bottom of file: source/data/data.js**

```javascript
   new flickr.Source({name: "flickr"}); 
```

For more details on the properties available for configuring this source, refer
to the API documentation for [enyo.JsonpSource]($api/#/kind/enyo.JsonpSource)
and [enyo.JsonpRequest]($api/#/kind/enyo.JsonpRequest).  The latter kind is used
internally by `enyo.JsonpSource`, and is configured by properties on the `opts`
hash.

**[View the code and results of Step 8 in JSFiddle](http://jsfiddle.net/enyojs/65hr7/)**

## 9: 为搜索创建子类的集合

Next, we'll create a subkind of `enyo.Collection` that uses our new
`flickr.Source` to fetch a collection of image records based on search text that
we give it.

We'll start with a basic subkind, and tell it to use the `flickr.Source` by default:

**在文件中加入： source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.SearchCollection",
        kind: "enyo.Collection",
        source: "flickr"
    });
```

*注：* We use the name we registered for the source as the value of `source`.

Next, we'll add a published property called `searchText`, and a
`searchTextChanged` handler, which will destroy any previously fetched records
and then fetch more. `searchTextChanged` will be called automatically whenever
the value of `searchText` is altered.

**编辑文件：source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.SearchCollection",
        kind: "enyo.Collection",
        model: "flickr.ImageModel",
        source: "flickr",
        published: {
            searchText: null
        },
        searchTextChanged: function() {
            this.empty({destroy: true});
            this.fetch();
        }
    });
```

Finally, we'll override the collection's `fetch()` function to provide more
information to the source about how to retrieve this specific information.
Along with the search text, the [Flickr photos search
API](https://www.flickr.com/services/api/flickr.photos.search.html) requires us
to pass a `method` query string parameter indicating that we want to search
photos.  There are a number of optional parameters we could specify as well; for
this sample, we'll specify a `sort` value (so that we get interesting photos),
and a limit to the number of results.

```javascript
    enyo.kind({
        name: "flickr.SearchCollection",
        kind: "enyo.Collection",
        source: "flickr",
        published: {
            searchText: null,
        },
        searchTextChanged: function() {
            this.empty({destroy: true});
            this.fetch();
        },
        fetch: function(opts) {
            this.params = {
                method: "flickr.photos.search",
                sort: "interestingness-desc",
                per_page: 50,
                text: this.searchText
            };
            return this.inherited(arguments);
        }
    });
```

Ultimately, the search parameters need to be added to the `params` hash that our
`flickr.Source` passes on to the `JsonpRequest`.  You'll notice above that we
set these in a `params` hash on the collection; we'll update the source to look
for these parameters and add them to the `params` that are passed along:

**编辑文件：source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.Source",
        kind: "enyo.JsonpSource",
        urlRoot: "https://api.flickr.com/services/rest/",
        fetch: function(rec, opts) {
            opts.callbackName = "jsoncallback";
            opts.params = enyo.clone(rec.params);
            opts.params.api_key = "2a21b46e58d207e4888e1ece0cb149a5";
            opts.params.format = "json";
            this.inherited(arguments);
        }
    });
```

Note that we've assigned `opts.params` to a clone of the `params` that exist on
the `rec` property (which is a reference to the model/collection being fetched),
and then added the source parameters to it.  In this way, we combine parameters
specific to the `flickr.SearchCollection` with parameters that apply to all
Flickr requests that we define on `flickr.Source`--implementing a layered
approach that lets us avoid repeating ourselves.

At this point, if we call `set("searchText", "San Francisco")` on an instance of
our `flickr.SearchCollection`, we should get result data loaded into the
collection.  But there is one final step.

If we look at a sample of the [data
returned](https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=interestingness-desc&per_page=50&text=San%20Francisco&api_key=2a21b46e58d207e4888e1ece0cb149a5&format=json&jsoncallback=enyo_jsonp_callback_0)
from a call to the API, we can see that it is not actually an array, which is
what `enyo.Collection` expects.  The array of photo records is actually nested
a couple levels down in the object returned:

**Sample response from Flickr "flickr.photos.search" API**

```
    {
        "photos": {
            "page": 1,
            "pages": 171118,
            "perpage": 50,
            "total": "8555851",
            "photo": [
                {
                    "id": "8866167062",
                    "owner": "23101599@N03",
                    "secret": "2a48819a28",
                    "server": "3748",
                    "farm": 4,
                    "title": "My Wife and The Union Jack",
                    "ispublic": 1,
                    "isfriend": 0,
                    "isfamily": 0
                },
                {
                    "id": "8589709770",
                    "owner": "72199305@N00",
                    "secret": "77042e76b3",
                    "server": "8237",
                    "farm": 9,
                    "title": "Into the Fog",
                    "ispublic": 1,
                    "isfriend": 0,
                    "isfamily": 0
                },
                ...
            ]
        }
    }
```

To deal with this, Enyo provides a `parse()` function that allows us to
transform data retrieved from the server into data appropriate for our specific
collections and models.  In our implementation of `parse()`, we simply take the
passed-in `data` argument (which reflects the raw data received) and return the
array that we actually want to load into the collection--which, in this case, is
`data.photos.photo`:

**编辑文件：source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.SearchCollection",
        ...
        options: { parse: true },
        ...
        parse: function(data) {
            return data && data.photos && data.photos.photo;
        }
    });
```

*注：* By default, Enyo will not call the `parse` method unless you set the `parse` option to `true`.

**[View the code and results of Step 9 in JSFiddle](http://jsfiddle.net/enyojs/PLqj6/)**

## 10: 为图片记录创建模式子类

There's one last piece we need before we can hook everything up and see it all
in action.  That's an `enyo.Model` subkind to wrap the records that are fetched
by our `flickr.SearchCollection`.  To be clear, `enyo.Collection` doesn't
_require_ a custom subkind of `enyo.Model`; it will default to wrapping the individual
objects of the array it receives, with a generic `enyo.Model`, allowing the
properties on the records to be bindable using Enyo's bindings.

Looking again at the data returned from the Flickr API, we discover something
interesting--the data doesn't include a URL for the image!

```
    [
        {
            "id": "8866167062",
            "owner": "23101599@N03",
            "secret": "2a48819a28",
            "server": "3748",
            "farm": 4,
            "title": "My Wife and The Union Jack",
            "ispublic": 1,
            "isfriend": 0,
            "isfamily": 0
        },
        {
            "id": "8589709770",
            "owner": "72199305@N00",
            "secret": "77042e76b3",
            "server": "8237",
            "farm": 9,
            "title": "Into the Fog",
            "ispublic": 1,
            "isfriend": 0,
            "isfamily": 0
        },
        ...
    ]
```

Since we want to present a grid of images found by the search, this is a
problem.  It turns out that Flickr requires you to construct the URL from the
data returned, according to a [scheme documented in their API
guide](http:s//www.flickr.com/services/api/misc.urls.html).  Essentially, the URL
is assembled as follows:

```
    https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
```

where `[mstzb]` indicates a size option.  To accommodate this, we'll create a
subkind of `enyo.Model` that uses computed properties to dynamically build a
`thumbnail` URL and an `original` URL, based on other properties contained in
the model data:

**编辑文件：source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.ImageModel",
        kind: "enyo.Model",
        computed: [
            {method: "thumbnail", path: ["farm", "server", "id", "secret"]},
            {method: "original", path: ["farm", "server", "id", "secret"]}
        ],
        thumbnail: function() {
            return "https://farm" + this.get("farm") +
                ".static.flickr.com/" + this.get("server") +
                "/" + this.get("id") + "_" + this.get("secret") + "_m.jpg";
        },
        original: function() {
            return "https://farm" + this.get("farm") +
                ".static.flickr.com/" + this.get("server") +
                "/" + this.get("id") + "_" + this.get("secret") + ".jpg";
        }
    });
```

**本代码更多的注释：**

* **computed** - The `computed` array lets us define computed properties and
their dependencies.  Here, we provide the `thumbnail` and `original`
properties, computed according to Flickr's URL schemes.  These properties will
be bindable to our view, just like static properties retrieved from the server,
such as `title`.  If any dependent property specified in the array (`farm`,
`server`, `id`, or `secret`) changes, any bindings to the property will be
notified and re-synced.  In this sample, we won't be changing the dependent
properties after they are fetched from the server, but if we did, they would
update automatically.  Very handy.

Last, we'll tell our `flickr.SearchCollection` to wrap all records fetched, using
our new `flickr.ImageModel` (rather than the default `enyo.Model`) by specifying
the `model` property on the collection:

**编辑文件：source/data/data.js**

```javascript
    enyo.kind({
        name: "flickr.SearchCollection",
        ...
        model: "flickr.ImageModel",
        ...
    });
```

**[View the code and results of Step 10 in JSFiddle](http://jsfiddle.net/enyojs/8uvJE/)**

## 11: 连接输入，集合和网格

At last, it's time to see all of our hard work in action.  To recap what we've
done so far:

* We created a `flickr.SearchPanel` that has a `search` handler function that
    fires when the input header's text changes.

* We added a `moon.DataGridList` to the search panel, which gets its data from a
    generic collection with dummy data.

* We created `flickr.Source`, `flickr.Collection`, and `flickr.ImageModel`
    subkinds for fetching image models from the Flickr API's search endpoint.

So, let's hook these pieces together.  First, in our `flickr.SearchPanel`, we'll
set the grid list's collection type to be our new `flickr.SearchCollection`:

**编辑文件：source/view/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        create: function() {
            this.inherited(arguments);
            this.set("photos", new flickr.SearchCollection());
        }
    });
```

Next, when the `search` input change handler fires, we'll set the input text to
the search collection's `searchText` property:

**编辑文件：source/view/views.js**

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        search: function(inSender, inEvent) {
            this.$.resultList.collection.set("searchText", inEvent.originator.get("value"));
        }
    });
```

You may recall that setting `searchText` kicks off a fetch of the
`flickr.SearchCollection` via the `flickr` source, using the parameters passed
from the collection.  When the collection gets its data, each record will be
wrapped in our `flickr.ImageModel`, and the `moon.DataGridList` will be notified
that new models were added to its `collection` property.  The grid list will
render an instance of `moon.GridListImageItem` controls for each model, and will
use the bindings we set up from the `title` attribute and `thumbnail` computed
property to update each item's view properties.  And that's it!  We now have a
functioning search panel.

Try it out by typing something into the input in the header and pressing
**Enter**.  You should see a list of images corresponding to your search text.

**[View the code and results of Step 11 in JSFiddle](http://jsfiddle.net/enyojs/ktXWd/)**

## 12. 在搜索面板内加入载入转盘

The Flickr API may take a bit of time to return the results of the search, so
we'll add a [moon.Spinner]($api/#/kind/moon.Spinner) control to be shown while
the collection is fetching, to let the user know we're working on returning
their data.

We can place the spinner in the header's "client" area.  This is exposed on
`moon.Panel` via the `headerComponents` array:

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        headerComponents: [
            {kind: "moon.Spinner", content: "Loading...", name: "spinner"}
        ],
        ...
    });
```

`enyo.Collection` provides a `status` property that is updated with its current state.
We can bind the spinner's `showing` property to updates of this property and use a transform
to test for the specific conditions we're interested in:

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        ...
        headerComponents: [
            {kind: "moon.Spinner", content: "Loading...", name: "spinner"}
        ],
        ...
        bindings: [
            ...,
            {from: "photos.status", to:"$.spinner.showing", transform: function(value) {
                return this.photos.isBusy();
            }}
        ],
        ...
    });
```

That's all there is to it!  Now, when you press **Enter** to start a search, you
should see the spinner run until the data is returned and the list is updated.

*注：* A transform is a handy way to convert data in one format to another, such as converting a string to a number. In this case, we could have looked up all the status codes for the collection that correspond to a busy state and converted that to the boolean we need, however, collection provides a convenience method called `isBusy()` that does exactly what we need.

**[View the code and results of Step 12 in JSFiddle](http://jsfiddle.net/enyojs/3D7BM/)**

## 13. 创建图片细节面板

Now that we have a fully functioning search panel, let's move ahead and add a
photo detail panel.  This will show a larger version of the image selected from
the search panel, along with some more detailed information about the photo--for
example, the user who took the photo and the date it was taken.

First, we'll create another subkind of `moon.Panel` for our detail panel, and
place a [moon.Image]($api/#/kind/moon.Image) in the `components` block.  (We'll use
the panel header's `titleBelow` and `subTitleBelow` properties to show the other
data.)

```javascript
    enyo.kind({
        name: "flickr.DetailPanel",
        kind: "moon.Panel",
        layoutKind: "FittableColumnsLayout",
        components: [
            {kind: "moon.Image", fit: true, sizing: "contain"}
        ]
    });
```

**本代码更多的注释：**

* **layoutKind** - As mentioned earlier, the default `layoutKind` for
    `moon.Panels` is `FittableRowsLayout`.  Here we change the value to
    `FittableColumnsLayout` so that components are laid out as columns.

* **moon.Image**

    * **fit** - Because the image is the only component, setting `fit: true` on it
        makes it fill the entire width of the panel client area.

    * **sizing** - This is a property of `moon.Image` (and
        [enyo.Image]($api/#/kind/enyo.Image)) that allows us to
        specify sizing options for the image.  Since we don't know the aspect
        ratio of the image, setting `sizing` to `"contain"` causes the longer
        dimension to be fit to the available space, so that there is no cropping
        or stretching.

When we push this panel onto our main view's `moon.Panels` (in the next step),
we'll set a `model` property on the panel, from which we'll access the image
URL. So let's go ahead and set up bindings from the model's `title` and
`original` URL attribute to the view.  

```javascript
    enyo.kind({
        name: "flickr.DetailPanel",
        kind: "moon.Panel",
        layoutKind: "FittableColumnsLayout",
        components: [
            {kind: "moon.Image", fit: true, sizing: "contain", name: "image"}
        ],
        bindings: [
            {from: "model.title", to: "title"},
            {from: "model.original", to: "$.image.src"}
        ]
    });
```

We can't see this panel yet because we haven't put it into the view.  Let's move
on to our next step and do that.

**[在 JSFiddle 中查看第13步代码的结果](http://jsfiddle.net/enyojs/pDU5r/)**

## 14. Add handlers for transitioning to detail page

To get our new `flickr.DetailPanel` onto the screen, we'll need to push a new
panel onto the `moon.Panels` instance owned by our `flickr.MainView`.  There are
many patterns you could use to achieve this, depending on the information
architecture and control structure of your application.  

For this sample, we'll consider the `flickr.MainView` to be the panel controller
for the app (since it owns the panels instance), and provide a custom
`onRequestPushPanel` event API for requesting that new panels be pushed onto the
panel stack.

First, we'll add a handler for the new custom `onRequestPushPanel` event to
`flickr.MainView`; this handler will call the `pushPanel` API on our
`moon.Panels` instance:

```javascript
    enyo.kind({
        name: "flickr.MainView",
        ...
        handlers: {
            onRequestPushPanel: "pushPanel"
        },
        ...
        pushPanel: function(inSender, inEvent) {
            this.$.panels.pushPanel(inEvent.panel);
        }
    });
```

We'll expect the event to have a `panel` property, which will hold the panel
definition passed to the `pushPanel()` API on `moon.Panels` to create, render,
and push the new panel onto the panel stack.  With this mechanism in place, any
child of `flickr.MainView` may bubble an `onRequestPushPanel` event with a
`panel` property to push a new panel onto the stack.

First, let's go back to the `flickr.SearchPanel` and add a tap handler to the
grid list items that will use this new event API:

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        components: [
            {kind: "moon.DataGridList", ..., ontap: "itemSelected", ...}
        ],
        ...
        itemSelected: function(inSender, inEvent) {
            // inEvent.index will reference the index associated with the tapped item
            // inEvent.model will reference the model associated with the tapped item
        }
    });
```

**本代码更多的注释：**

* **itemSelected()**

    * Since the `ontap` handler was placed on the DataGridList, any tap events
        bubbling out of the grid list will be caught by the `itemSelected()`
        function.

    * Note that any events bubbled from subkinds of
        [enyo.DataRepeater]($api/#/kind/enyo.DataRepeater) (such as
        `moon.DataGridList`) will include `inEvent.model` and `inEvent.index`
        properties to allow you to identify the item that originated the event
        and the model associated with it.

Next, we declare that the `flickr.SearchPanel` will bubble the
`onRequestPushPanel` event, and then implement the `itemSelected()` handler to
bubble the event, passing the panel definition in the event payload:

```javascript
    enyo.kind({
        name: "flickr.SearchPanel",
        events: {
            onRequestPushPanel: ""
        },
        components: [
            {kind: "moon.DataGridList", ..., ontap: "itemSelected", ...}
        ],
        ...
        itemSelected: function(inSender, inEvent) {
            this.doRequestPushPanel({panel: {kind: "flickr.DetailPanel", model: inEvent.model}});
        }
    });
```

**本代码更多的注释：**

* **events** - By declaring `onRequestPushPanel` in the `events` block, we tell
    the framework (and anyone who uses the kind) that this kind will bubble that
    event.  While this is a convention for defining the kind's API, the
    declaration also gives us an automatic `do<EventName>` convenience function
    for bubbling the event.

* **doRequestPushPanel()** - Calling the convenience method
    `doRequestPushPanel()` is equivalent to calling
    `this.bubble("onRequestPushPanel", <event>)`.  As the second parameter, we
    pass an "event payload" object that contains a `panel` property, as expected
    by the `onRequestPushPanel` handler in `flickr.MainView`.  The `panel`
    property contains the definition of the panel kind we want to push onto the
    panel stack--namely, `flickr.DetailPanel`.  We also pass the model
    associated with the item tapped as a property of the newly created detail
    panel, to be used by bindings into the view.

Go ahead and try this: Do a search, then click on an image.  The search panel
should "breadcrumb" and animate to the left, while the detail panel should
appear with the title set and the image displayed below the header.

**[View the code and results of Step 14 in JSFiddle](http://jsfiddle.net/enyojs/PZBTC/)**

## 15. 获得图片详细信息

Recall that we wanted to show some more detail on the photo detail page, such
as the name of the user who took the photo and the date it was taken.  Although
Flickr provides this information, it is, unfortunately, not included in the
records returned from the search API.  It is actually quite common for REST APIs
that a fetch of a collection of models to return only a subset of the available
fields.  A subsequent fetch of the record (using the model's primary key) is
then needed to get the full set of fields.

No problem.  We'll just go back to our `flickr.ImageModel` and implement a
`fetch()`/`parse()` scheme similar to what we have in our collection, to enable
the fetching of a full image record based on the partial information obtained
from the search collection.  When we move to the detail panel, we'll call
`fetch()` on the model to request the additional information.

First, let's set the `source` for the image model to our Flickr source,
and then override the `fetch()` function on `enyo.Model` to pass `flickr.Source`
a `params` hash with the information needed to fetch detailed image models
(similar to what we did in `flickr.SearchCollection`):

```javascript
    enyo.kind({
        name: "flickr.ImageModel",
        source: "flickr",
        ...
        fetch: function(opts) {
            this.params = {
                method: "flickr.photos.getinfo",
                photo_id: this.get("id")
            };
            return this.inherited(arguments);
        }
    });
```

Here, we set the `method` parameter to `flickr.photos.getinfo` to reach the
[Flickr photo information endpoint](https://www.flickr.com/services/api/flickr.photos.getinfo.html).
We also pass a `photo_id` property, whose value will already be available from
the partial field set loaded by the collection.

Next, let's examine the [data we get
back](https://api.flickr.com/services/rest/?method=flickr.photos.getinfo&photo_id=59948935&api_key=2a21b46e58d207e4888e1ece0cb149a5&format=json&jsoncallback=enyo_jsonp_callback_1)
from a call to this endpoint:

**Sample of data returned by call to "flickr.photos.getinfo" API**

```
    {
        "photo": {
            "id": "59948935",
            "secret": "a91e6e451d",
            "server": "28",
            "farm": 1,
            "dateuploaded": "1131178052",
            "isfavorite": 0,
            "license": "0",
            "safety_level": "0",
            "rotation": 0,
            "owner": {
                "nsid": "44124472651@N01",
                "username": "Ben McLeod",
                "realname": "Ben McLeod",
                "location": "Portland, OR, USA",
                "iconserver": "1",
                "iconfarm": 1,
                "path_alias": "benmcleod"
            },
            ...
            "dates": {
                "posted": "1131178052",
                "taken": "2005-11-05 02:03:00",
                "takengranularity": "0",
                "lastupdate": "1389562416"
            },
            ...
        }
    }
```

Again, the data fields for the `flickr.ImageModel` attributes are nested inside
a `photos` object, so we'll need to add a `parse()` function to our model to
return just the set of fields to be added to the model's attributes from the raw
data.  For performance, `enyo.Model` only makes the top-level
properties bindable.  Since we're interested in the `owner.realname` and
`dates.taken` fields, we can deal with those in the `parse()` function also:

```javascript
    enyo.kind({
        name: "flickr.ImageModel",
        ...
        options: { parse: true },
        ...
        parse: function(data) {
            data = data.photo || data;
            data.title = data.title._content || data.title;
            data.username = data.owner && data.owner.realname;
            data.taken = data.dates && data.dates.taken;
            return data;
        }
    });
```

**本代码更多的注释：**

* Since `parse()` processes data returned from both the `search` API and the
    `getInfo` API, we need to ensure that the method works in both cases.
    Unfortunately, there are slight differences in how the returned data is
    formatted for the two cases.  For example, the `search` API returns `title`
    as a top-level property, while `getinfo` returns the title in the
    `title._content` property.  So our `parse()` function must deal with these
    differences.

* We also move the `realname` and `taken` properties (when present) from their
    nested locations directly onto the data hash being returned, so that they
    are bindable as top-level attributes.

Note that we won't see a change in the app yet, since we're not explicitly
fetching the full model yet.  We'll do that next.

**[View the code and results of Step 15 in JSFiddle](http://jsfiddle.net/enyojs/mX9Z9/)**

## 16. Fetch and bind detailed image data to detail panel

Now that we have a `fetch()` method on our model that can retrieve detailed
information, let's put it to use.

Although we could have the collection automatically fetch detailed information
as soon as the model is loaded into the collection, that would require a lot of
network overhead for data that may never be shown (since we'll only show it if
the user moves to the detail page for that item).  So we'll only fetch the
detailed data once the user has decided to view the detail page.

We could call `fetch()` in the `itemSelected` handler in `flickr.SearchPanel`,
but we'll avoid doing so for one simple reason: performance.  Since we'll bind
the detail properties to the view, the data will be pushed into the view
(causing a DOM update) as soon as it is fetched.  In general, that's great, but
some platforms have trouble maintaining acceptable animation frame rates while
updating the DOM.  Since the `itemSelected` handler calls `pushPanels()`,
causing an immediate panel animation, we'll defer calling the model `fetch()`
until the animation completes.

Luckily, `moon.Panels` lets us specify a callback (`transitionFinished`) that
allows us to do post-transition work, such as updating the view.  We'll
implement this on our panel instance, and call `this.model.fetch()` when we are
moving _to_ the detail panel (i.e., when the "to" index is greater than the
"from" index):

```javascript
    enyo.kind({
        name: "flickr.DetailPanel",
        ...
        transitionFinished: function(inInfo) {
            if (inInfo.from < inInfo.to) {
                this.model.fetch();
            }
        }
    });
```

Now all we need to do is add some bindings to get our detailed data properties
(`realname` and `taken`) into the view.  Here are some simple bindings that bind
these fields into the panel header's `titleBelow` and `subTitleBelow`
properties:

```javascript
    enyo.kind({
        name: "flickr.DetailPanel",
        ...
        bindings: [
            ...
            {from: "model.username", to: "titleBelow"},
            {from: "model.taken", to: "subTitleBelow"}
        ],
        ...
    });
```

We can make it a bit more interesting if we add transform functions to the
bindngs, to format the raw values from the model into more user-friendly
strings:

```javascript
    enyo.kind({
        name: "flickr.DetailPanel",
        ...
        bindings: [
            ...
            {from: "model.username", to: "titleBelow", transform: function(val) {
                return "By " + (val || " unknown user");
            }},
            {from: "model.taken", to: "subTitleBelow", transform: function(val) {
                return val ? "Taken " + val : "";
            }}
        ],
        ...
    });
```

Now, when you move to the detail page, you should see the user and date taken
information in the header as soon as the data is fetched.

**[View the code and results of Step 16 in JSFiddle](http://jsfiddle.net/enyojs/Ld9HJ/)**

## 17. 添加全屏图像视图

The "Always Viewing" panels pattern used in this app is specially designed to
provide a lightweight browsing interface in `moon.Panels` above fullscreen
content, such as fullscreen video playback, audio playback, or photo viewing.
To demonstrate how to switch between the panels overlay and the fullscreen
content, we'll add a simple image viewer in the "basement" (a term we use to
describe the screen area underneath any overlying panels).

First, let's add the image viewer.  [enyo.ImageView]($api/#/kind/enyo.ImageView)
provides a basic image view with scroll-to-zoom and drag-to-pan capability.
We'll place an ImageView in our `flickr.MainView`, _before_ the panels instance,
using the `enyo-fit` class to fit it to the full bounds of the screen:

```javascript
    enyo.kind({
        name: "flickr.MainView",
        components: [
            {kind: "enyo.ImageView", name: "imageViewer", classes: "enyo-fit", src: "assets/splash.png"},
            {kind: "moon.Panels", ...}
        ]
    });
```

Next, let's add another custom event handler to the main view to allow the
`flickr.DetailPanel` (or any other panel we may add in the future) to request
that a new image be loaded into the image viewer:

```javascript
    enyo.kind({
        name: "flickr.MainView",
        handlers: {
            ...
            onRequestFullScreen: "fullscreen"
        },
        ...
        fullscreen: function(inSender, inEvent) {
            this.$.imageViewer.set("src", inEvent.model.get("original"));
            this.$.panels.hide();
        }
    });
```

As before, the custom event handler expects a specific event payload--here the
`model` property should be set to the image model that is requesting fullscreen
viewing.  We'll set the `original` URL property to the `src` property of the
`enyo.ImageView`.  We'll also hide the panels, so that the fullscreen content is
unobstructed.  The user can always return to the panels to resume browsing by
hovering over the handle at the right edge of the screen and tapping.

Now we need to bubble this new event from our detail page.  Let's add a "View
Fullscreen" button to the panel header's client area, along with a tap handler
that bubbles the `onRequestFullScreen` event, passing the model mentioned above:

```javascript
    enyo.kind({
        name: "flickr.DetailPanel",
        ...
        events: {
            onRequestFullScreen: ""
        },
        ...
        headerComponents: [
            {kind: "moon.Button", ontap: "requestFullScreen", small: true, content: "View Fullscreen"}
        ],
        ...
        requestFullScreen: function() {
            this.doRequestFullScreen({model: this.model});
        }
    });
```

You should be able to press the "View Fullscreen" button from the detail view
and see the selected photo fullscreen, then return to browsing by re-opening the
panels via the handle at the right edge.

**[View the code and results of Step 17 in JSFiddle](http://jsfiddle.net/enyojs/AB7J6/)**

## 18. 最后的润色

In our final app, you'll see that we made a few additional improvements:

* We extended `enyo.ImageView` to provide a basic slideshow capability.  Besides
    subkinding `enyo.ImageView`, this entailed moving the `photos` search
    collection up to the main view, to be bindable both to the slideshow and the
    search panel.  We also added one more top-level event handler to request a
    slideshow from the search panel.

* For fun, we added a [moon.ContextualPopup]($api/#/kind/moon.ContextualPopup)
    on the detail page containing a QR code link to the full-size image, to
    allow a user to quickly open the image on a mobile device with a bar-code
    reader app.

Feel free to browse through these additions, and to try adding your own ideas
for features to improve the app!

**View the finished [application](http://enyojs.github.io/moon-flickr)
and [source code](https://github.com/enyojs/moon-flickr)**

## 19. 最小化/布署应用

When you are finished developing your app, you will want to "deploy" it.  As
you'll recall, we've been developing our app in the top-level `debug.html` file,
which loads the full un-minified Enyo core, library, and application source.
This is great for debugging, but when deploying your app to a device or to the
Web, you'll first want to run the `deploy` script supplied with `bootplate`.

To minify/deploy your app, simply run the following from the command line, from
your application's root directory (this requires Node.js; see [Step
1](#set-up-your-development-environment)):

Mac/Linux:

```
    $ tools/deploy.sh -T
```

Windows:

```
    > tools\deploy.bat -T
```

Following a successful run, you should now be able to load `index.html` from the
root of your app, and you should see a significant improvement in load time.
What's more, the `/deploy` folder in the root of your app will contain _only_
the minimum set of files needed for packaging into a native app wrapper like
Cordova/PhoneGap, or deploying to a Web server, with all source files removed.

Please refer to the [Platform-Specific
Deployment](../deploying-apps/platform-specific-deployment.html) guide for more
information.

**Note for webOS developers:** The `ares-package` tool provided with the webOS
SDK should be used to deploy Enyo apps when packaging for webOS.  It will call
the `deploy` script internally as part of the packaging process, so there is no
need to run the bootplate `deploy` script separately.
