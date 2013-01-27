var pocket = require('./lib/pocket')
 , config =require('./config')
 , redis = require('redis').createClient()
 , async = require('async')
 ;

async.waterfall([
  function(cb) { // last update
    pocket.latestStat(function(err, stat) {
      cb(err, stat ? stat.date : null);
    });
  },
  function(since, cb) {
    console.log(since);
    options = {state:'all'};
    if (since)
      options.since = since;

    pocket.retrieve(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
      var unread = 0,
        archived = 0;

      for (var k in response.list) {
        if (!response.list.hasOwnProperty(k))
          continue;

        var entry = response.list[k];
        console.log(k + ': ' + entry);
        if (entry.status === '0') // unread or added
          unread++;
        else if (entry.status === '1') // archive
          archived++;
      };

      var stat = {
        date:response.since,
        unread: unread,
        archived: archived,
        total: unread + archived
      };
      pocket.addStat(stat, function(err) {
        cb(err, stat.date);
      });
    }, options);
  }
], function(err, results) {
  console.log(results);
  process.exit();
});