var express = require('express')
  , http = require('http')
  , path = require('path')
  , pocket = require('./lib/pocket')
  ;

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  var moment = require('moment');

  pocket.statInRange(0, 7, function(err, stats) {
    stats.map(function(stat) {
      stat.date = new Date(stat.date * 1000);
      stat.fromNow = moment(stat.date).fromNow();
    })
    res.render('index', {title:'Laters ±', stats:stats});
  })
});

app.get('/stats', function(req, res) {
  pocket.statInRange(0, 7, function(err, stats) {
    /*
    stats.map(function(stat) {
      stat.date = stat.date * 1000;
    })
*/
    res.send(stats);
  })
})
/*
app.get('/delta*', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({'added':1, 'archived':2, params:req.query}));
});
*/

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});