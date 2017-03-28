"use strict";

const path = require('path'),
	  fs = require('fs'),
	  expect = require('expect.js'),
	  sinon = require('sinon'),
	  chalk = require('chalk'),
	  utils = require("../index");

const TEST_SRC = path.join(process.cwd(), "test/src");

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

	it("getArgvs - without parameter", function() {
		var processArgvs = process.argv;
		process.argv = ["node", "mocha", "--a", "2"];

		let argv = utils.getArgvs();

		let result = { 
			_: [],
			a: 2
	  	};

	  	delete argv["$0"];

	  	expect(argv).to.eql(result);

	  	process.argv = processArgvs;

	});

	it("getArgvs - with parameter", function() {

		let setArgv = [
			'1',
			'2',
			"-a=123",
			"--ab=123",
			"-b 12",
			"--bc",
			"123",
		];
		
		let argv = utils.getArgvs(setArgv);
		delete argv["$0"];

		expect(argv).to.eql({ _: [ 1, 2 ], a: 123, ab: 123, b: ' 12', bc: 123 });
		
	});

	it("getNpmArgvs", function() {

		let npmConfig = process.env.npm_config_argv;
		process.env.npm_config_argv = '{"remain":[],"cooked":["run","dev","--entry","index"],"original":["run","dev","--entry=index"]}';
		
		let npmArgvs = utils.getNpmArgvs();

		expect(npmArgvs.entry).to.eql('index');

		process.env.npm_config_argv = npmConfig;

	});
});

describe("html files", function() {

	it("getHtmlEntry -- level=0", function() {
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

		expect(utils.getHtmlEntry({srcPath : ""})).to.eql([]);

		let htmlFies = utils.getHtmlEntry({srcPath : htmlFolder});

		expect(htmlFies).to.eql(result);
	});

	it("getHtmlFile -- level=0", function() {
		let htmlFolder = path.join(TEST_SRC);

		let result = [ 'comment', 'detail', 'index' ];

		expect(utils.getHtmlFile()).to.eql([]);

		let htmlFies = utils.getHtmlFile(htmlFolder);

		expect(htmlFies).to.eql(result);
	});


	it("getHtmlEntry -- level=1 & filterHtmlFile", function() {
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

    	let htmlFiles = utils.getHtmlEntry({srcPath: htmlFolder, level: 1});

		expect(htmlFiles).to.eql(result);

		expect(utils.filterHtmlFile(htmlFiles)).to.eql(result);

		result = result.slice(0, 1);

		expect(utils.filterHtmlFile(htmlFiles, ['comment'])).to.eql(result);
	});

	it("getHtmlEntry - level=1 & filterHtmlFileByCmd", function() {
		let npmConfig = process.env.npm_config_argv;
		process.env.npm_config_argv = '{"remain":[],"cooked":["run","dev","--entry","index,detail"],"original":["run","dev","--entry=index,detail"]}';

		let htmlFolder = path.join(TEST_SRC, "page");

		let result = [ 
  			{ 
  				key: 'detail',
    			path: path.join(htmlFolder, '/detail/index.html') 
    		},
  			{ 
  				key: 'index',
    			path: path.join(htmlFolder, '/index/index.html') 
    		} 
    	];

  		let htmlFiles = utils.getHtmlEntry({srcPath: htmlFolder, level: 1});

  		htmlFiles = utils.filterHtmlFileByCmd(htmlFiles);

  		expect(htmlFiles).to.eql(result);

		process.env.npm_config_argv = npmConfig;
	});

});

describe("sprites files", function() {
	it("getSpriteEntry", function() {
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

    	expect(utils.getSpriteEntry({srcPath: ""})).to.eql([]);

    	let spriteFiles = utils.getSpriteEntry({srcPath: spriteFolder});

    	expect(spriteFiles).to.eql(result);
	});

	it("getSpriteFolder", function() {
		let spriteFolder = path.join(TEST_SRC, "css/sprites");

		let result = [ 'btn', 'list' ];

		expect(utils.getSpriteFolder()).to.eql([]);

    	let spriteFiles = utils.getSpriteFolder(spriteFolder);

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
  			'js/index': [ path.join(TEST_SRC, 'page/index/index.jsx') ] 
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

  		expect(utils.filterJsFile(jsFiles, ["detail"])).to.eql(result);

	});

	it("getJsEntry - level=1 & filterJsFileByCmd", function() {
		let npmConfig = process.env.npm_config_argv;
		process.env.npm_config_argv = '{"remain":[],"cooked":["run","dev","--entry","index,detail"],"original":["run","dev","--entry=index,detail"]}';

		let jsFolder = path.join(TEST_SRC, "page");

		let result = { 
  			'js/detail': [ path.join(TEST_SRC, 'page/detail/index.js') ],
  			'js/index': [ path.join(TEST_SRC, 'page/index/index.jsx') ] 
  		};

  		let jsFiles = utils.getJsEntry({
  			srcPath: jsFolder,
  			fileName: "index",
  			extensions: ["js", "jsx"],
  			keyPrefix: "js/",
  			level: 1
  		});

  		jsFiles = utils.filterJsFileByCmd(jsFiles);

  		expect(jsFiles).to.eql(result);

		process.env.npm_config_argv = npmConfig;
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

  	it("log - string", function() {
  		log.restore();
  		var consoleLog = sinon.stub(console, 'log');

		utils.log('success', 'green');
		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['green']('success'))).to.be(true);

		consoleLog.restore();
  	});

  	it("log - object", function() {
  		log.restore();
  		var consoleLog = sinon.stub(console, 'log');

  		utils.log({info: 'success'}, 'green');
		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['green'](JSON.stringify({info: 'success'})))).to.be(true);
  		
  		consoleLog.restore();
  	});
});

