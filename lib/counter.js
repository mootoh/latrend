// counter.js

var pocket = require('./pocket')
  , fs = require('fs')
  , config = require('./config')
  ;


function fetch(since, callback) {
  if (! since) {
    pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
      callback(err, response);
    });
  } else {
    pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
      callback(err, response);
    }, {
      since:since
    });
  }
}

function stat(timestamp) {
  var DATA_DIR = './data';
  var entries = JSON.parse(fs.readFileSync(DATA_DIR + '/' + timestamp + '.json'));
  var added = [],
    archived = [],
    deleted = [],
    others = [];

  for (var k in entries.list) {
    var entry = entries.list[k];

    if (parseInt(entry.time_added) - parseInt(entries.since) >= 0)
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

  return {
    timestamp:timestamp,
    since:entries.since,
    added:added,
    archived:archived,
    deleted:deleted,
    others:others
  };
}

function compare(prev, now) {
  var DATA_DIR = './data';
  var prevEntries = fs.readFileSync(DATA_DIR + '/' + prev + '.json');
  var nowEntries = fs.readFileSync(DATA_DIR + '/' + now + '.json');
}

exports.fetch = fetch;
exports.stat = stat;
exports.compare = compare;