// counter.js

var pocket = require('./pocket')
  , fs = require('fs')
  , async = require('async')
  , config = require('../config')
  , redis = require('redis').createClient()
  ;

function fetch(since, callback) {
  var options = since ? {since:since} : null;

  pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
    if (err) {
      console.log('error: ' + err);
      callback(err);
      return;
    }

    if (parseInt(since) === parseInt(response.since)) {
      console.log('no change detected. skip saving it in redis');
      callback(null, response);
      return;
    }

    async.parallel([
      function(cb) {
        redis.set('pocket:' + response.since, JSON.stringify(response), function(err) {
          cb(err);
        });
      }, function(cb) {
        redis.set('latest:pocket', response.since, function(err) {
          cb(err);
        });
      }, function(cb) {
        redis.set('prev:pocket', since, function(err) {
          cb(err);
        });
      }
    ], function(err, result) {
      callback(err, response.since);
    });
  }, options);
}

function latest(callback) {
  redis.get('latest:pocket', function(err, obj) {
    callback(err, obj);
  })
}

function stat(timestamp, callback) {
  async.waterfall([
    function(cb) {
      redis.get('prev:pocket', function(err, obj) {
        cb(err, obj);
      })
    }, function(prev, cb) {
      redis.get('pocket:' + timestamp, function(err, obj) {
        var entries = JSON.parse(obj);
          var added = [],
          archived = [],
          deleted = [],
          others = [];

        for (var k in entries.list) {
          var entry = entries.list[k];

          if (prev && parseInt(entry.time_added) - parseInt(prev) > 0)
            added.push(entry);
          switch (parseInt(entry.status)) {
            case 0:
              others.push(entry);
              break;
            case 1:
              archived.push(entry);
              break;
            case 2:
              deleted.push(entry);
          }
        }
        cb(err, {
          timestamp:timestamp,
          added:added,
          archived:archived,
          deleted:deleted,
          others:others
        });
      });
    }
  ], function(err, results) {
    callback(err, results);
  });
}

exports.fetch = fetch;
exports.latest = latest;
exports.stat = stat;