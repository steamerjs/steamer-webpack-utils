## steamer-webpack-utils
steamer webpack util functions


### Functions

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
* v0.1.0 finish basic features and add es6 and es5 support
