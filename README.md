## steamer-webpack-utils
steamer 脚手架 webpack utils 函数

[![NPM Version](https://img.shields.io/npm/v/steamer-webpack-utils.svg?style=flat)](https://www.npmjs.com/package/steamer-webpack-utils)
[![Travis](https://img.shields.io/travis/steamerjs/steamer-webpack-utils.svg)](https://travis-ci.org/steamerjs/steamer-webpack-utils)
[![Deps](https://david-dm.org/steamerjs/steamer-webpack-utils.svg)](https://david-dm.org/steamerjs/steamer-webpack-utils)
[![Coverage](https://img.shields.io/coveralls/steamerjs/steamer-webpack-utils.svg)](https://coveralls.io/github/steamerjs/steamer-webpack-utils)


### 接口函数

#### 项目目录示例

```javascript
src
 |-- page
 |___|
 |   |-- index
 |   |    |-- main.js
 |   |    |-- index.html
 |   |     
 |   |-- comment
 |   |    |-- main.js
 |   |    |-- index.html
 |   |
 |   |-- detail
 |        |-- main.jsx
 |        |-- index.html
 |        |-- index1.html
 |
 |-- img
 |    |-- sprites
 |          |- button
 |          |- icon
 |
 |
 |-- index.html
 |-- comment.html
 |-- detail.html
 |-- main.js
```

若你想查看具体接口参数，请参阅 `index.js`

* fs 具备 [fs-extra](https://github.com/jprichardson/node-fs-extra) 的能力

* getHtmlEntry
	- 自动获取 `html` 文件
	- 参数 `{Object}`
		- `option.srcPath` `{String}` 包含有 `html` 文件的目录
		- `option.level` `{Integer}` 0 表示在当前目录寻找，1 表示在下一级目录寻找
		- `options.keyType` `{String}` 返回 `key` 值的类型， 默认 `folderName` (用父文件夹名作 `key`), 其它值 `fileName`(用文件名作为 `key`)

```javascript
var htmlFiles = getHtmlEntry({
	srcPath: path.join(process.cwd(), "src")
});

// 返回
[ 
	{ 
		key: 'comment',
		path: 'path/src/comment.html'
	},
	{ 
		key: 'detail',
		path: 'path/src/detail.html'
	},
	{ 
		key: 'index',
		path: 'path/src/index.html'
	} 
]

var htmlFiles = getHtmlEntry({
	srcPath: path.join(process.cwd(), "src/page"),
	level: 1
});

// 返回
[ 
	{ 
		key: 'comment',
		path: 'path/src/page/comment/index.html'
	},
	{ 
		key: 'detail',
		path: 'path/src/page/detail/index.html'
	},
	{ 
		key: 'index',
		path: 'path/src/page/index/index.html'
	} 
]

var htmlFiles = getHtmlEntry({
	srcPath: path.join(process.cwd(), "src/page"),
	level: 1,
	keyType: 'fileName',
});
// 返回

[ 
	{ 
		key: 'index',
    	path: 'path/src/page/comment/index.html'
    },
  	{ 
  		key: 'index',
    	path: 'path/src/page/detail/index.html'
    },
    { 
  		key: 'index1',
    	path: 'path/src/page/detail/index1.html'
    },
  	{ 
  		key: 'index',
    	path: 'path/src/page/index/index.html'
    } 
]
```

* filterHtmlFile
	- 筛选 `html` 文件, 通常与 `getHtmlEntry` 一起使用
	- 参数
		- `htmlFiles`, `{Array}`, 所有 `html` 文件
		- `selectedFiles`, `{Array}`, 选中的 `html` 文件, 支持glob

```javascript
var htmlFiles = filterHtmlFile([ 
	{ 
		key: 'comment',
		path: 'path/src/page/comment/index.html'
	},
	{ 
		key: 'detail',
		path: 'path/src/page/detail/index.html'
	},
	{ 
		key: 'detail-m',
		path: 'path/src/page/detail-m/index.html'
	},
	{ 
		key: 'index',
		path: 'path/src/page/index/index.html'
	} 
], ['detail*']);

// 最终返回
[ 
  	{ 
  		key: 'detail',
    	path: 'path/src/page/detail/index.html'
    },
  	{ 
  		key: 'detail-m',
    	path: 'path/src/page/detail-m/index.html'
    } 
]

// 如果第二个参数被忽略，则完整返回
var htmlFiles = filterHtmlFile([ 
	{ 
		key: 'comment',
    	path: 'path/src/page/comment/index.html'
    },
  	{ 
  		key: 'detail',
    	path: 'path/src/page/detail/index.html'
    },
  	{ 
  		key: 'index',
    	path: 'path/src/page/index/index.html'
    } 
]);

// 它返回原有的数组
[ 
	{ 
		key: 'comment',
    	path: 'path/src/page/comment/index.html'
    },
  	{ 
  		key: 'detail',
    	path: 'path/src/page/detail/index.html'
    },
  	{ 
  		key: 'index',
    	path: 'path/src/page/index/index.html'
    } 
]
```

* filterHtmlFileByCmd
	- 根据 npm 命令进行 html 文件的筛选
	- 参数
		- htmlFiles, {Array}, 所有 `html` 文件, 支持glob

```javascript
// 如果你使用以下命令启动你的脚本，npm run start -- --entry=detail*
var htmlFiles = [ 
	{ 
		key: 'comment',
		path: 'path/src/page/comment/index.html'
	},
	{ 
		key: 'detail',
		path: 'path/src/page/detail/index.html'
	},
	{ 
		key: 'detail-m',
		path: 'path/src/page/detail-m/index.html'
	},
	{ 
		key: 'index',
		path: 'path/src/page/index/index.html'
	} 
];

utils.filterHtmlFileByCmd(htmlFiles);

// 返回值如下
[
	{
		key: 'detail',
		path: 'path/src/page/detail/index.html'
	},
	{
		key: 'detail-m',
		path: 'path/src/page/detail-m/index.html'
	}
]
```

*  getSpriteEntry
	- 自动获取合图文件
	- 参数,  `{Object}`
		- `options.srcPath`, `{String}`, 源文件目录

```javascript
var spriteFolders = getSpriteEntry('src/img/sprites');

// 返回
[
	{ 
		key: 'btn',
		path: 'path/src/img/sprites/btn'
	},
	{ 
		key: 'list',
		path: 'path/src/img/sprites/list'
	} 
]
```

* getJsEntry
 - 自动获取 `js` 文件
 - 参数, `{Object}`
 	- `option.srcPath`, {String}, 包含 `js` 文件的目录
	- `option.fileName`, {String}, 主入口文件,默认 `main`
	- `option.extensions`, {Array}, 主入口文件可能的后缀，默认 `["js"]`
	- `option.keyPrefix`, {String}, 返回对象 `key` 的前缀
	- `option.level`, {Integer}, 0 表示在当前目录寻找，1 表示在下一级目录寻找

```javascript
var jsFiles utils.getJsEntry({
	srcPath: path.join(process.cwd(), "src")
});

// 返回
{ 
	main: [ 'path/src/main.js') ] 
}

var jsFiles = utils.getJsEntry({
	srcPath: path.join(process.cwd(), "src/page"),
	fileName: "index",
	extensions: ["js", "jsx"],
	keyPrefix: "js/",
	level: 1
});

// 返回
{ 
	'js/comment': [ 'path/src/page/comment/index.js' ],
	'js/detail': [ 'path/src/page/detail/index.js' ],
	'js/index': [ 'path/src/page/index/index.js' ] 
}
```

* filterJsFile
	- 筛选 js 文件, 通常搭配 `getJsEntry` 或者 `getJsFile` 使用
	- 参数
		- jsFiles, {Object}, 所有 `js` 文件
		- selectedFiles, {Array}, 选中的 `js` 文件, 支持glob

```javascript
utils.filterJsFile({ 
		'js/comment': [ 'path/src/page/comment/index.js' ],
		'js/detail': ['path/src/page/detail/index.js' ],
		'js/detail-m': ['path/src/page/detail-m/index.js' ],
		'js/index': [ 'path/src/page/index/index.js' ] 
	}, 
	["js/detail*"]
);

// 最后返回如下
{ 
	'js/detail': [ 'path/src/page/detail/index.js' ],
	'js/detail-m': [ 'path/src/page/detail-m/index.js' ]
}

// 如果 selectedFiles 参数被忽略，则完整返回
```

* filterJsFileByCmd
	- 根据 npm 命令进行 js 文件的筛选
	- 参数
		- jsFiles, {Object}, 所有 `js` 文件, 支持glob

```javascript
// 如果你使用以下命令启动你的脚本，npm run start -- --entry=js/detail*

var jsFiles = { 
	'js/comment': [ 'path/src/page/comment/index.js' ],
	'js/detail': ['path/src/page/detail/index.js' ],
	'js/detail-m': ['path/src/page/detail-m/index.js' ],
	'js/index': [ 'path/src/page/index/index.js' ] 
};

jsFiles = utils.filterJsFileByCmd(jsFiles);

// 返回值为
{ 
	'js/detail': [ 'path/src/page/detail/index.js' ],
	'js/detail-m': [ 'path/src/page/detail-m/index.js' ]
}
```

* walkAndReplace
	- 给目录内文件内容进行替换
	- 参数
		- folder, {String}, 目录路径
		- extensions, {Array}, 需要替换的文件后缀，如为空数组，则所有文件都要替换
		- replaceObj, {Object}, 需要替换的标签内容

```javascript
// 内容标签格式一律为 <% key %>, 以下内容是将目录内所有 js 和 html 文件中的 <% title %> 标签内容替换为 index

utils.walkAndReplace(srcFolder, [".js", ".html"], {title: 'index'});

```

* copyTemplate
	- 将模板拷贝到指定位置
	- 参数
		- srcFolder, {String}, 源目录
		- destFolder, {String}, 目标目录
```javascript

utils.copyTemplate(TEST_SRC, TEST_DIST);

```

* addPlugins
	- 给 `webpack` 配置添加 插件
	
```javascript
	addPlugins(webpackConfig, webpackPlugin, webpackPluginConfig);
```

* getArgvs
	- 获取命令行参数
	- 参数
		- `argvs`, `{Object}`, 具体参数，可留空，若留空，则自动返回 `process.argv` 被处理的参数

* getNpmArgvs
	- 获取npm命令行参数
```javascript
// 如 npm start -- --entry=index

var npmArgvs = getNpmArgvs();

// npmArgvs.entry 值为 "index"
```

* error
	- 报错信息
	- 参数
		- msg, {String}, 报错文本

* info
	- 正常信息
	- 参数
		- msg, {String}, 正常文本

* warn
	- 警告信息
	- 参数
		- msg, {String}, 警告文本

* success
	- 成功信息
	- 参数
		- msg, {String}, 成功文本

* getHtmlFile
	- 自动获取 `html` 文件，此 `api` 即将被弃用，请改用 `getHtmlEntry`

```javascript
var htmlFiles = getHtmlFile(path.join(process.cwd(), "src"));

// it returns
["index", "comment", "detail"]
```

* getJsFile
	- 自动获取 `js` 文件，此 `api` 即将被弃用，请改用 `getJsEntry`

```javascript
var jsFiles = getJsFile('src', 'page', 'main', ['js', 'jsx']);

// 返回
{
	'js/index': ['xxx/project/src/page/index/main.js'],
	'js/comment': ['xxx/project/src/page/comment/main.js'], 
	'js/detail': ['xxx/project/src/page/index/main.jsx'],
}
```

* getSpriteFolder
	- 获取合图文件，此 `api` 即将被弃用，请改用 `getSpriteEntry`

```javascript
var spriteFolders = getSpriteFolder('src/img/sprites');

// 返回
['button', 'icon']
```
