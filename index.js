'use strict';

const fs = require('fs'),
	  path = require('path');

module.exports = {
	/**
	 * get html files automatically
	 * @param  {String} srcPath [directory contains html files]
	 * @return {Array}          [array of html files path]
	 */
	getHtmlFile: function(srcPath) {

		if (!fs.existsSync(srcPath)) {
			return [];
		}
		
		// read html filename from 
		let srcFiles = fs.readdirSync(srcPath);

		srcFiles = srcFiles.filter((item, index) => {
		    return !!~item.indexOf('.html');
		});

		srcFiles = srcFiles.map((item, index) => {
		    return item.replace('.html', '');
		});

		return srcFiles;
	},

	/**
	 * get sprite folder, only depth 1st folder matter
	 * @param  {String} spritePath [sprite image parent folder]
	 * @return {Array}             [sprite folder]
	 */
	getSpriteFolder: function(spritePath) {
		
		if (!fs.existsSync(spritePath)) {
			return [];
		}

		let srcFiles = fs.readdirSync(spritePath);

		srcFiles = srcFiles.filter((item, index) => {
		    return !~item.indexOf('.');
		});

		return srcFiles;
	},
	/**
	 *  get js files automatically
	 * @param  {String} srcPath [directory contains js files]
	 * @param  {String} jsDirectory [js directory]
	 * @param  {String} fileName    [js filename]
	 * @param  {Array} extensions   [possiable js extension]
	 * @return {Object}             [Object of js files path]
	 */
	getJsFile: function(srcPath, jsDirectory, fileName, extensions) {
		let jsFileArray = {};

		if (!fs.existsSync(srcPath)) {
			return jsFileArray;
		}

		//read js filename
		let srcFiles = fs.readdirSync(path.join(srcPath, jsDirectory));
		
		srcFiles = srcFiles.filter((item, index) => {
		    return item !== 'common';
		});

		srcFiles.map((item, index) => {
			extensions.map((ext, index) => {
				let jsPath = path.join(srcPath, jsDirectory, item, 'main.' + ext);
				if (fs.existsSync(jsPath)) {
					jsFileArray['js/' + item] = [jsPath];
				}
			});
		});

		// console.log(jsFileArray);
		return jsFileArray;
	},

	/**
	 * add plugin for webpack config
	 * @param {Object} conf   [webpack config]
	 * @param {Object} plugin [webpack plugin]
	 * @param {Object} opt    [plugin config]
	 */
	addPlugins: function(conf, plugin, opt) {
		conf.plugins.push(new plugin(opt));
	}
};