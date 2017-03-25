"use strict";

const path = require('path'),
	  fs = require('fs'),
	  expect = require('expect.js'),
	  sinon = require('sinon'),
	  chalk = require('chalk'),
	  utils = require("../index");

const TEST_SRC = path.join(process.cwd(), "test/src");

describe("html files", function() {

	it("getHtmlFile -- level=0", function() {
		let htmlFolder = path.join(TEST_SRC);

		let result = [ 
			{ 
				key: 'comment',
		    	path: path.join(htmlFolder, 'comment.html') 
		    },
		  	{ 
		  		key: 'detail',
		    	path: path.join(htmlFolder, 'detail.html')
		    },
		  	{ 
		  		key: 'index',
		    	path: path.join(htmlFolder, 'index.html')
		    } 
		];

		expect(utils.getHtmlFile({srcPath : ""})).to.eql([]);

		let htmlFies = utils.getHtmlFile({srcPath : htmlFolder});

		expect(htmlFies).to.eql(result);
	});


	it("getHtmlFile -- level=1 & filterHtmlFile", function() {
		let htmlFolder = path.join(TEST_SRC, "page");

		let result = [ 
			{ 
				key: 'comment',
    			path: path.join(htmlFolder, '/comment/index.html')
    		},
  			{ 
  				key: 'detail',
    			path: path.join(htmlFolder, '/detail/index.html') 
    		},
  			{ 
  				key: 'index',
    			path: path.join(htmlFolder, '/index/index.html') 
    		} 
    	];

    	let htmlFiles = utils.getHtmlFile({srcPath: htmlFolder, level: 1});

		expect(htmlFiles).to.eql(result);

		expect(utils.filterHtmlFile(htmlFiles)).to.eql(result);

		result = result.slice(0, 1);

		expect(utils.filterHtmlFile(htmlFiles, ['comment'])).to.eql(result);
	});

});

describe("sprites files", function() {
	it("getSpriteFolder", function() {
		let spriteFolder = path.join(TEST_SRC, "css/sprites");

		let result = [ 
			{ 
				key: 'btn',
    			path: path.join(spriteFolder, 'btn')
    		},
  			{ 
  				key: 'list',
    			path: path.join(spriteFolder, 'list') 
    		} 
    	];

    	expect(utils.getSpriteFolder({spritePath: ""})).to.eql([]);

    	let spriteFiles = utils.getSpriteFolder({spritePath: spriteFolder});

    	expect(spriteFiles).to.eql(result);
	});
});

describe("js files", function() {
	it("getJsFile", function() {
		let result = { 
			'js/comment': [ path.join(TEST_SRC, 'page/comment/main.js') ],
  			'js/detail': [ path.join(TEST_SRC, 'page/detail/main.js') ],
  			'js/index': [ path.join(TEST_SRC, 'page/index/main.js') ] 
  		};

  		expect(utils.getJsFile("", 'page', 'main', ['js', 'jsx'])).to.eql([]);
  		
  		let jsFiles = utils.getJsFile(TEST_SRC, 'page', 'main', ['js', 'jsx']);

  		expect(jsFiles).to.eql(result);
	});

	it("getJsEntry - level=0", function() {

		let jsFolder = path.join(TEST_SRC);

		let result = { 
			main: [ path.join(TEST_SRC, 'main.js') ] 
		};

		expect(utils.getJsEntry({
  			srcPath: ""
  		})).to.eql([]);

  		let jsFiles = utils.getJsEntry({
  			srcPath: jsFolder
  		});

  		expect(jsFiles).to.eql(result);
	});

	it("getJsEntry - level=1 & filterJsFile", function() {

		let jsFolder = path.join(TEST_SRC, "page");

		let result = { 
			'js/comment': [ path.join(TEST_SRC, 'page/comment/index.js') ],
  			'js/detail': [ path.join(TEST_SRC, 'page/detail/index.js') ],
  			'js/index': [ path.join(TEST_SRC, 'page/index/index.js') ] 
  		};

  		let jsFiles = utils.getJsEntry({
  			srcPath: jsFolder,
  			fileName: "index",
  			extensions: ["js", "jsx"],
  			keyPrefix: "js/",
  			level: 1
  		});

  		expect(jsFiles).to.eql(result);

  		expect(utils.filterJsFile(jsFiles)).to.eql(result);

  		delete result['js/comment'];
  		delete result['js/index'];

  		expect(utils.filterJsFile(jsFiles, ["js/detail"])).to.eql(result);

	});


});

describe("others", function() {

	it("addPlugins", function() {
		let conf = {
			plugins: []
		};

		let plugin = function(opt) {
			return opt;
		};

		utils.addPlugins(conf, plugin, {abc: 123});

		expect(conf).to.eql({ plugins: [ { abc: 123 } ] });
	});


	it("getArgs", function() {
		utils.getArgs();
	});
});

describe("print message:", function() {
	var spyLog, spyError, log;

	beforeEach(function() {
		log = sinon.stub(utils, 'log');
	});

	afterEach(function() {
		// log.restore();
	});

	it("error", function() {
		utils.error('error');

		expect(utils.log.calledOnce).to.be(true);
		expect(utils.log.calledWith('error', 'red')).to.be(true);
		log.restore();
  	});

  	it("info", function() {
		utils.info('info');

		expect(utils.log.calledOnce).to.be(true);
		expect(utils.log.calledWith('info', 'cyan')).to.be(true);

		log.restore();
  	});

  	it("warn", function() {
		utils.warn('warn');

		expect(utils.log.calledOnce).to.be(true);
		expect(utils.log.calledWith('warn', 'yellow')).to.be(true);

		log.restore();
  	});

  	it("success", function() {
		utils.success('success');

		expect(utils.log.calledOnce).to.be(true);
		expect(utils.log.calledWith('success', 'green')).to.be(true);

		log.restore();
  	});

  	it("log", function() {
  		log.restore();
  		var consoleLog = sinon.stub(console, 'log');

		utils.log('success', 'green');

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['green']('success'))).to.be(true);

		consoleLog.restore();
  	});
});
