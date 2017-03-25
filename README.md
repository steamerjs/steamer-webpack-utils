## steamer-webpack-utils
steamer 脚手架 webpack utils 函数

[![NPM Version](https://img.shields.io/npm/v/steamer-webpack-utils.svg?style=flat)](https://www.npmjs.com/package/steamer-webpack-utils)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://travis-ci.org/SteamerTeam/steamer-webpack-utils)
[![Deps](https://david-dm.org/SteamerTeam/steamer-webpack-utils.svg)](https://david-dm.org/SteamerTeam/steamer-webpack-utils)
[![Coverage](https://coveralls.io/repos/github/SteamerTeam/steamer-webpack-utils/badge.svg)](https://coveralls.io/github/SteamerTeam/steamer-webpack-utils)


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
 |   |-- spa
 |   |    |-- main.js
 |   |    |-- index.html
 |   |
 |   |-- detail
 |        |-- main.jsx
 |        |-- index.html
 |
 |-- img
 |    |-- sprites
 |          |- button
 |          |- icon
 |
 |
 |-- index.html
 |-- spa.html
 |-- detail.html
 |-- main.js
```

若你想查看具体接口参数，请参阅 `index.js`

* getHtmlFile
	- 自动获取 `html` 文件
	- 参数 `Object`
		- `option.srcPath` `{String}` 包含有 `html` 文件的目录
		- `option.level` `{Integer}` 0 表示在当前目录寻找，1 表示在下一级目录寻找

```javascript
var htmlFiles = getHtmlFile({
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

var htmlFiles = getHtmlFile({
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
```

* filterHtmlFile
	- 筛选 `html` 文件, 通常与 `getHtmlFile` 一起使用
	- 参数
		- `htmlFiles`, `{Array}`, 所有 `html` 文件
		- `selectedFiles`, `{Array}`, 选中的 `html` 文件

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
  		key: 'index',
    	path: 'path/src/page/index/index.html'
    } 
], ['index']);

// 最终返回
[ 
  	{ 
  		key: 'index',
    	path: 'path/src/page/index/index.html'
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

// it returns the original array
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

*  getSpriteFolder
	- 自动获取合图文件
	- 参数
		- `srcPath`, `{String}`, 源文件目录

```javascript
var spriteFolders = getSpriteFolder('src/img/sprites');

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

* getJsFile
	- 自动获取 `js` 文件，此 `api` 即将被弃用，请改用 `getJsEntry`

```javascript
var jsFiles = getJsFile('src', 'page', 'main', ['js', 'jsx']);

// it returns
{
	'js/index': ['xxx/project/src/page/index/main.js'],
	'js/spa': ['xxx/project/src/page/spa/main.js'], 
	'js/detail': ['xxx/project/src/page/index/main.jsx'],
}
```

* getJsEntry
 - 自动获取 `js` 文件
 - 参数, Object
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
		- selectedFiles, {Array}, 选中的 `js` 文件

```javascript
utils.filterJsFile({ 
	'js/comment': [ 'path/src/page/comment/index.js' ],
		'js/detail': ['path/src/page/detail/index.js' ],
		'js/index': [ 'path/src/page/index/index.js' ] 
	}, 
	["js/index"]
);

// finally returns
{ 
	'js/index': [ 'path/src/page/index/index.js' ] 
}

// 如果 selectedFiles 参数被忽略，则完整返回
```

* addPlugins
	- 给 `webpack` 配置添加 插件
	
```javascript
	addPlugins(webpackConfig, webpackPlugin, webpackPluginConfig);
```

* getArgs
	- 获取命令行参数
	- 参数
		- `argvs`, `{Object}`, 具体参数，可留空，若留空，则自动返回 `process.argv` 被处理的参数

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