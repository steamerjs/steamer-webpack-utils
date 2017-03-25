'use strict';

const fs = require('fs'),
	  path = require('path'),
	  chalk = require('chalk'),
	  yargs = require('yargs');

module.exports = {
	
	/**
	 * get html files automatically
	 * @param {Object} options
	 *        - {String}  srcPath [directory contains html files]
	 *        - {Integer} level   [0 => current level, 1 => next level]
	 * @return {Array}          [array of html files path]
	 */
	getHtmlFile: function(options) {
		let opt = options || {};

		let level = opt.level || 0,
			srcPath = opt.srcPath || "";

		if (!fs.existsSync(srcPath)) {
			return [];
		}
		
		// read html filename from 
		let srcFiles = fs.readdirSync(srcPath),
			htmlFiles = [];

		if (level) {
			srcFiles.map((item) => {
				let folder = path.join(srcPath, item);
				if (fs.lstatSync(folder).isDirectory()) {
					let subSrcFiles = fs.readdirSync(folder);
					htmlFiles = htmlFiles.concat(getFromSrc(subSrcFiles, item));
				}
			});
		}
		else {
			htmlFiles = htmlFiles.concat(getFromSrc(srcFiles));
		}
		
		function getFromSrc(srcFiles, folderPath) {
			let folder = folderPath || '';

			srcFiles = srcFiles.filter((item) => {
			    return !!~item.indexOf('.html');
			});

			let htmlFiles = [];

			srcFiles = srcFiles.map((item) => {
			    let obj = {};
			    obj.key = folder || item.replace('.html', '');
			    obj.path = path.join(srcPath, folder, item);

			    htmlFiles.push(obj);
			});

			return htmlFiles;
		}

		return htmlFiles;
	},

	/**
	 * get sprite folder, only depth 1st folder matter
	 * @param {Object} options
	 *        - {String} spritePath [sprite image parent folder]
	 * @return {Array}             [sprite folder]
	 */
	getSpriteFolder: function(options) {
		let opt = options || {};

		let spritePath = opt.spritePath || "";

		if (!fs.existsSync(spritePath)) {
			return [];
		}

		let srcFiles = fs.readdirSync(spritePath),
			spriteFiles = [];

		srcFiles = srcFiles.filter((item) => {
		    return !~item.indexOf('.');
		});

		srcFiles.map((item) => {
			let obj = {};
			obj.key = item;
			obj.path = path.join(spritePath, item);
			spriteFiles.push(obj);
		});

		return spriteFiles;
	},

	/**
	 * @deprecated [will be deprecated in next major release]
	 * get js files automatically
	 * @param  {String} srcPath [directory contains js files]
	 * @param  {String} jsDirectory [js directory]
	 * @param  {String} fileName    [js filename]
	 * @param  {Array} extensions   [possiable js extension]
	 * @return {Object}             [Object of js files path]
	 */
	getJsFile: function(srcPath, jsDirectory, fileName, extensions) {

		console.log("steamer-webpack-utils: getJsFile will be deprecated in next major release! Please use getJsEntry instead");

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

		return jsFileArray;
	},
	
	/**
	 * get js files automatically
	 * @param {Object} options
	 *        - {String} srcPath [directory contains js files]
	 *        - {String} fileName    [entry js filename]
	 *        - {Array} extensions   [possiable js extension]
	 *        - {String} keyPrefix  [prefix of key]
	 *        - {Integer} level   [0 => current level, 1 => next level]
	 * @return {Object}             [Object of js files path]
	 */
	getJsEntry: function(options) {
		let opt = options || {};

		let srcPath = opt.srcPath || "", 
			fileName = opt.fileName || "main", 
			extensions = opt.extensions || ["js"], 
			keyPrefix = opt.keyPrefix || "", 
			level = opt.level || 0;

		let jsFileArray = {};

		if (!fs.existsSync(srcPath)) {
			return jsFileArray;
		}

		//read js filename
		let srcFiles = fs.readdirSync(srcPath);

		if (level) {
			srcFiles.filter((item) => {
				let folder = path.join(srcPath, item);
				return fs.lstatSync(folder).isDirectory();
			});

			srcFiles.map((item) => {
				extensions.map((ext) => {
					let jsPath = path.join(srcPath, item, fileName + '.' + ext);

					if (fs.existsSync(jsPath) && !jsFileArray[keyPrefix + item]) {
						jsFileArray[keyPrefix + item] = [jsPath];
					}
				});
			});
		}
		else {
			extensions.map((ext) => {
				let jsPath = path.join(srcPath, fileName + '.' + ext);
				if (fs.existsSync(jsPath)) {
					jsFileArray[keyPrefix + fileName] = [jsPath];
				}
			});
		}

		return jsFileArray;
	},

	/**
	 * select js files for compilation
	 * @param  {Object} jsFiles       [all js files]
	 * @param  {Array} selectedFiles [selected js files]
	 * @return {Array}               [selected js files in certain format]
	 */
	filterJsFile: function(jsFiles, selectedFiles) {

		if (!selectedFiles || !selectedFiles.length) {
			return jsFiles;
		}

		var newJsFiles = {};

		Object.keys(jsFiles).map((item) => {
			if (selectedFiles.includes(item)) {
				newJsFiles[item] = jsFiles[item];
			}
		});

		return newJsFiles;
	},

	/**
	 * select html files for compilation
	 * @param  {Array} htmlFiles     [all html files]
	 * @param  {Array} selectedFiles [selected html files]
	 * @return {Array}               [selected html files in certain format]
	 */
	filterHtmlFile: function(htmlFiles, selectedFiles) {

		if (!selectedFiles || !selectedFiles.length) {
			return htmlFiles;
		}
		
		htmlFiles = htmlFiles.filter((item) => {
			if (selectedFiles.includes(item.key)) {
				return item;
			}
		});

		return htmlFiles;
	},


	/**
	 * add plugin for webpack config
	 * @param {Object} conf   [webpack config]
	 * @param {Object} plugin [webpack plugin]
	 * @param {Object} opt    [plugin config]
	 */
	addPlugins: function(conf, plugin, opt) {
		conf.plugins.push(new plugin(opt));
	},

	/**
	 * 
	 */
	getArgs: function(argvs) {

		if (argvs) {
			return yargs(argvs).argv;
		} 
		else {
			return yargs.argv;
		}
	},

	/**
	 * print error message
	 * @param  {String} str [message]
	 * @return {String}     [msg]
	 */
	error: function(str) {
		this.log(str, 'red');
	},

	/**
	 * print information
	 * @param  {String} str [message]
	 * @return {String}     [msg]
	 */
	info: function(str) {
		this.log(str, 'cyan');
	},

	/**
	 * print warning message
	 * @param  {String} str [message]
	 * @return {String}     [msg]
	 */
	warn: function(str) {
		this.log(str, 'yellow');
	},

	/**
	 * print success message
	 * @param  {String} str [message]
	 * @return {String}     [msg]
	 */
	success: function(str) {
		this.log(str, 'green');
	},

	_isType: function(type, obj) {
		return Object.prototype.toString.call(obj) === '[object ' + type + ']';
	},

	/**
	 * pring message
	 * @param  {String} str   [message]
	 * @param  {String} color [color name]
	 * @return {String}       [message with color]
	 */
	log: function(str, color) {
		str = str || '';
		str = this._isType('Object', str) ? JSON.stringify(str) : str;
		let msg = chalk[color](str);
		console.log(msg);
		return msg;
	}
};