// Pocket (getpocket.com)

var https = require('https');

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

function get(consumerKey, accessToken, callback) {
  var options = {
    hostname: 'getpocket.com',
    path: '/v3/get',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF0-8',
      'X-Accept':'application/json'
    }
  };

  var responseData = '';
  var req = https.request(options, function(res) {
    res.on('data', function(chunk) {
      responseData += chunk;
    });
    res.on('end', function() {
      callback(null, responseData);
    })
  });

  req.on('error', function(e) {
    callback(e);
  });

  var body = {
    consumer_key: consumerKey,
    access_token: accessToken
  };

  req.write(JSON.stringify(body));
  req.end();
}


exports.getRequestToken = getRequestToken;
exports.redirectURL = redirectURL;
exports.getAccessToken = getAccessToken;
exports.get = get;