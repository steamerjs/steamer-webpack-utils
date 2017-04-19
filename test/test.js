"use strict";

const path = require('path'),
	  fs = require('fs-extra'),
	  expect = require('expect.js'),
	  sinon = require('sinon'),
	  chalk = require('chalk'),
	  utils = require("../index"),
	  klawSync = require('klaw-sync');

const TEST_SRC = path.join(process.cwd(), "test/src"),
	  TEST_DIST = path.join(process.cwd(), "test/dist");

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
			_: ['node', 'mocha'],
			a: 2,
			'$0': 'mocha'
	  	};

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

	it("walkAndReplace", function() {

		var replaceObj = {title: "list", body: "hello world!"};

		var readFileSyncStub = sinon.stub(fs, 'writeFileSync').callsFake(function(filepath, content) {
			let rawContent = fs.readFileSync(filepath, "utf-8");

			Object.keys(replaceObj).forEach((key) => {
				rawContent = rawContent.replace(new RegExp("<% " + key + " %>", "gi"), function() {
					return replaceObj[key];
				});
			});

			expect(content).to.eql(rawContent);
			
		});

		let srcFolder = path.join(TEST_SRC);

		utils.walkAndReplace(srcFolder, [".js", ".html"], replaceObj);

		readFileSyncStub.restore();

	});

	it("copyTemplate - folder exists", function() {

		var existsSyncStub = sinon.stub(fs, "existsSync").callsFake(function() {
			return true;
		});

		expect(function() {
			utils.copyTemplate("src", "dest");
		}).to.throwError();

		existsSyncStub.restore();

	});

	it("copyTemplate - folder exists", function() {

		utils.copyTemplate(TEST_SRC, TEST_DIST);

		expect(fs.existsSync(TEST_DIST)).to.be(true);

		fs.removeSync(TEST_DIST);

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
				key: 'index',
    			path: path.join(htmlFolder, '/comment/index.html')
    		},
    		{ 
				key: 'index1',
    			path: path.join(htmlFolder, '/comment/index1.html')
    		},
    		{ 
				key: 'index2',
    			path: path.join(htmlFolder, '/comment/index2.html')
    		},
  			{ 
  				key: 'index',
    			path: path.join(htmlFolder, '/detail/index.html') 
    		},
  			{ 
  				key: 'index',
    			path: path.join(htmlFolder, '/index/index.html') 
    		} 
    	];

    	let htmlFiles = utils.getHtmlEntry({srcPath: htmlFolder, level: 1, keyType: 'fileName'});

		expect(htmlFiles).to.eql(result);

		expect(utils.filterHtmlFile(htmlFiles)).to.eql(result);

		result = result.slice(2, 3);

		expect(utils.filterHtmlFile(htmlFiles, ['index2'])).to.eql(result);
	});

	it("getHtmlEntry - level=1 & filterHtmlFileByCmd", function() {
		var filterByCmdStub = sinon.stub(utils, "getArgvs").callsFake(function() {
			return { _: [ 'run', 'dev' ], entry: 'index,detail', '$0': 'tools/script.js' };
		});

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

  		filterByCmdStub.restore();

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

		var filterByCmdStub = sinon.stub(utils, "getArgvs").callsFake(function() {
			return { _: [ 'run', 'dev' ], entry: 'index,detail', '$0': 'tools/script.js' };
		});

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

		filterByCmdStub.restore();
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

