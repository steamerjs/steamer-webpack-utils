## steamer-webpack-utils
steamer webpack util functions


### Functions

#### Example project folder

```
src
 |-- page
 |___|
 |   |-- index
 |   |    |-- main.js
 |   |     
 |   |-- spa
 |   |    |-- main.js
 |   |
 |   |-- detail
 |        |-- main.jsx
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
```

For function parameter details, you can take a look at `index.js`

* getHtmlFile
	- return html files automatically
```
	var htmlFiles = getHtmlFile('src');

	// it returns
	["index", "spa", "detail"]
```

* filterHtmlFile
	- select html files for compilation, usually used with `getHtmlFile`

```
	var htmlFiles = filterHtmlFile(['index', 'spa', 'detail'], ['index']);

	// finally returns
	['index']
```

*  getSpriteFolder
	- get sprite folder
```
	var spriteFolders = getSpriteFolder('src/img/sprites');

	// it returns
	['button', 'icon']
```

* getJsFile
	- get js files automatically
```
	var jsFiles = getJsFile('src', 'page', 'main', ['js', 'jsx']);

	// it returns
	{
		'js/index': ['xxx/project/src/page/index/main.js'],
		'js/spa': ['xxx/project/src/page/spa/main.js'], 
		'js/detail': ['xxx/project/src/page/index/main.jsx'],
	}
```

* filterJsFile
	- select js files for compilation, usually used with `getJsFile`
```
	utils.filterJsFile({
		"js/index": [....],
		"js/spa": [....],
		"js/detail": [...],
	}, ["js/index"])

	// finally returns
	{
		"js/index": [....]
	}

```

* addPlugins
	- add webpack plugins
```
	addPlugins(webpackConfig, webpackPlugin, webpackPluginConfig);
```

### Changelog
* v0.1.0 finish basic features
* v0.1.3 add js and html filter functions
