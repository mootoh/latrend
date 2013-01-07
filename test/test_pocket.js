// test Pocket

var assert = require('assert')
  , pocket = require('../lib/pocket')
  , config = require('../lib/config')
  ;

describe('Pocket', function() {
  xdescribe('auth', function() {
    it('should get a request token from a valid consumer key ', function(cb) {
      getRequestToken(config.CONSUMER_KEY, function(err, token) {
        assert.equal(null, err);
        console.log(token);
      });
    })

    it('should get an access token from a valid request token', function(cb) {
      getAccessToken(config.CONSUMER_KEY, config.REQUEST_TOKEN, function(err, response) {
        assert.equal(null, err);
        console.log(response);
        cb();
      });
    });
  });

  describe('Retrieve', function() {
    this.timeout(5000);

    xit('should get actual entries with a valid tokens', function (cb) {
      pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
        assert.equal(null, err);
        var fs = require('fs');
        fs.writeFileSync('entries.json', response);
        cb();
      })
    });

    it('should get entries after since', function (cb) {
      pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
        assert.equal(null, err);
        var fs = require('fs');
        fs.writeFileSync('after.json', response);
        cb();
      }, {
        since:1357500632
      });
    });
  });
});