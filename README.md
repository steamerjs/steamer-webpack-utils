## steamer-webpack-utils
steamer webpack util functions


### Functions

For function parameter details, you can take a look at `index.js`

* getHtmlFile
	- return html files automatically
```
	var htmlFiles = getHtmlFile('src');
```
*  getSpriteFolder
	- get sprite folder
```
	var spriteFolders = getSpriteFolder('src/img/sprites');
```

* getJsFile
	- get js files automatically
```
	var jsFiles = getJsFile('src', 'page', 'main', ['js', 'jsx']);
```

* addPlugins
	- add webpack plugins
```
	addPlugins(webpackConfig, webpackPlugin, webpackPluginConfig);
```

### Changelog
* v0.1.0 finish basic features
