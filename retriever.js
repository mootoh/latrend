var pocket = require('./lib/pocket')
 , config =require('./config')
 , redis = require('redis').createClient()
 , async = require('async')
 ;

async.waterfall([
  function(cb) { // last update
    pocket.latestStat(function(err, stat) {
      // cb(err, stat ? stat.date : null);
      // retrieve full list every time for now,
      // because we cannot know which item is archived or deleted from unread list easily
      cb(err, null);
    });
  },
  function(since, cb) {
    options = {
      state: 'all',
      detailType: 'simple'
    };
    if (since)
      options.since = parseInt(since)+1;

    pocket.retrieve(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
      var unread = 0,
        archived = 0,
         deleted = 0;

      for (var k in response.list) {
        if (!response.list.hasOwnProperty(k))
          continue;

        var entry = response.list[k];
        if (entry.status === '0') // unread or added
          unread++;
        else if (entry.status === '1') // archive
          archived++;
        else if (entry.status === '2') // deleted
          deleted++;
      };

      var stat = {
        date:response.since,
        unread: unread,
        archived: archived,
        deleted: deleted
        // total: unread + archived
      };
      pocket.addStat(stat, function(err) {
        cb(err, stat.date);
      });
    }, options);
  }
], function(err, results) {
  process.exit();
});