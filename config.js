var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));

exports.ACCESS_TOKEN = config.ACCESS_TOKEN;
exports.CONSUMER_KEY = config.CONSUMER_KEY;
exports.REQUEST_TOKEN = config.REQUEST_TOKEN;