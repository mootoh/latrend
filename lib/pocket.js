// Pocket (getpocket.com)

var https = require('https')
  , redis = require('redis').createClient()
  ;

var Pocket = function(consumerKey) {
  this.consumerKey = consumerKey;
};

function getRequestToken(consumerKey, callback) {
  var options = {
    hostname: 'getpocket.com',
    path: '/v3/oauth/request',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF0-8',
      'X-Accept':'application/json'
    }
  };

  var req = https.request(options, function(res) {
    res.on('data', function(chunk) {
      body = JSON.parse(chunk);
      if (!body || !body['code'])
        callback('error in parsing response JSON');
      else
        callback(null, body['code']);
    });
  });

  req.on('error', function(e) {
    callback(e);
  });

  var body = {
    consumer_key: consumerKey,
    redirect_uri: 'http://latrend.mootoh.net/',
  };

  req.write(JSON.stringify(body));
  req.end();
}

function redirectURL(requestToken, redirectUrl) {
  return 'https://getpocket.com/auth/authorize?request_token=' + requestToken + '&redirect_uri=' + redirectUrl;
}

function getAccessToken(consumerKey, requestToken, callback) {
  var options = {
    hostname: 'getpocket.com',
    path: '/v3/oauth/authorize',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF0-8',
      'X-Accept':'application/json'
    }
  };

  var req = https.request(options, function(res) {
    res.on('data', function(chunk) {
      body = JSON.parse(chunk);
      if (!body || !body['code'])
        callback('error in parsing response JSON');
      else
        callback(null, body);
    });
  });

  req.on('error', function(e) {
    callback(e);
  });

  var body = {
    consumer_key: consumerKey,
    code: requestToken
  };

  req.write(JSON.stringify(body));
  req.end();
}

function retrieve(consumerKey, accessToken, callback, options) {
  var params = {
    hostname: 'getpocket.com',
    path: '/v3/get',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF0-8',
      'X-Accept':'application/json'
    }
  };

  var responseData = '';
  var req = https.request(params, function(res) {
    res.on('data', function(chunk) {
      responseData += chunk;
    });
    res.on('end', function() {
      callback(null, JSON.parse(responseData));
    })
  });

  req.on('error', function(e) {
    callback(e);
  });

  var body = {
    consumer_key: consumerKey,
    access_token: accessToken
  };

  for (var k in options)
    body[k] = options[k];

  req.write(JSON.stringify(body));
  req.end();
}

var statKey = 'latrend:stats:pocket';

function statInRange(from, to, callback) {
  redis.lrange(statKey, from, to, function(err, results) {
    if (err) {
      callback(err);
      return;
    }
    results = results.map(function(result) {
      result = JSON.parse(result);
      result.total = parseInt(result.unread) + parseInt(result.archived);
      return result;
    })
    callback(err, results);
  });
}

function latestStat(callback) {
  statInRange(0, 0, callback);
}

function addStat(stat, callback) {
  if (typeof(stat) === 'object')
    stat = JSON.stringify(stat);

  redis.lpush(statKey, stat, function(err) {
    callback(err);
  });
}

exports.getRequestToken = getRequestToken;
exports.redirectURL = redirectURL;
exports.getAccessToken = getAccessToken;
exports.retrieve = retrieve;
exports.statInRange = statInRange;
exports.latestStat = latestStat;
exports.addStat = addStat;