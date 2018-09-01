if ("production" !== process.env.NODE_ENV) {
	// use it for hot reload
	module.exports = require('./root/Root.dev');
	var title = "<% title %>";
}
else {
	module.exports = require('./root/Root.prod');
}
