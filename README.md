## steamer-webpack-utils
steamer webpack util functions


### Functions

#### Example project folder

```javascript
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

```javascript
	var htmlFiles = getHtmlFile('src');

	// it returns
	["index", "spa", "detail"]
```

* filterHtmlFile
	- select html files for compilation, usually used with `getHtmlFile`

```javascript
	var htmlFiles = filterHtmlFile(['index', 'spa', 'detail'], ['index']);

	// finally returns
	['index']

	// if second option is ignored
	var htmlFiles = filterHtmlFile(['index', 'spa', 'detail']);

	// it returns the original array
	['index', 'spa', 'detail']
```

*  getSpriteFolder
	- get sprite folder

```javascript
	var spriteFolders = getSpriteFolder('src/img/sprites');

	// it returns
	['button', 'icon']
```

* getJsFile
	- get js files automatically

```javascript
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

```javascript
	utils.filterJsFile({
		"js/index": [....],
		"js/spa": [....],
		"js/detail": [...],
	}, ["js/index"])

	// finally returns
	{
		"js/index": [....]
	}

	// if second option is ignored
	utils.filterJsFile({
		"js/index": [....],
		"js/spa": [....],
		"js/detail": [...],
	});

	// it returns the original object
	{
		"js/index": [....],
		"js/spa": [....],
		"js/detail": [...],
	}


```

* addPlugins
	- add webpack plugins
	
```javascript
	addPlugins(webpackConfig, webpackPlugin, webpackPluginConfig);
```

### Changelog
* v0.1.0 finish basic features
* v0.1.3 add js and html filter functions
* v0.1.5 filterJsFile and filterHtmlFile supports return the original object/array
