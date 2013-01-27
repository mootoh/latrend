// test Pocket

var chai = require('chai')
  , assert = chai.assert
  , pocket = require('../lib/pocket')
  , config = require('../config')
  , redis = require('redis').createClient()
  ;

// http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

describe('Pocket', function() {
  xdescribe('auth', function() {
    it('should get a request token from a valid consumer key ', function(cb) {
      pocket.getRequestToken(config.CONSUMER_KEY, function(err, token) {
        assert.equal(null, err);
        console.log(token);
      });
    })

    it('should get an access token from a valid request token', function(cb) {
      pocket.getAccessToken(config.CONSUMER_KEY, config.REQUEST_TOKEN, function(err, response) {
        assert.equal(null, err);
        console.log(response);
        cb();
      });
    });
  });

  xdescribe('Retrieve', function() {
    this.timeout(5000);

    xit('should get actual entries with a valid tokens', function (cb) {
      pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
        assert.equal(null, err);
        var fs = require('fs');
        fs.writeFileSync('entries.json', response);
        cb();
      })
    });

    xit('should get entries after since', function (cb) {
      pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
        assert.equal(null, err);
        var fs = require('fs');
        fs.writeFileSync('after.json', response);
        cb();
      }, {
        since:1357500632
      });
    });

    xit('should get count of unread entries', function(done) {
      pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
          assert.equal(null, err);
          assert.isNotNull(response.since);
          assert.isTrue(Object.size(response.list) > 0);
          // var fs = require('fs');
          // fs.writeFileSync('/tmp/unread.json', JSON.stringify(response));
          done();
      }, {
        state:'unread'
      });
    });

    it('should get count of arhcived entries', function(done) {
      pocket.get(config.CONSUMER_KEY, config.ACCESS_TOKEN, function(err, response) {
          assert.equal(null, err);
          assert.isNotNull(response.since);
          assert.isTrue(Object.size(response.list) > 0);
          var fs = require('fs');
          fs.writeFileSync('/tmp/archived.json', JSON.stringify(response));
          done();
      }, {
        state:'archive'
      });
    });
  });

  describe('stats', function() {
    before(function(done) {
      redis.del('latrend:stats:pocket', function(err) {
        assert.isNull(err);
        done();
      });
    });

    it('should add a stat', function(done) {
      var stat = {
        date: Math.round(new Date().getTime() / 1000),
        total: 3,
        unread: 2,
        archived: 1
      };
      pocket.addStat(stat, function(err) {
        done();
        assert.isNull(err);
      })
    })

    it('should have a stat', function(done) {
      pocket.latestStat(function(err, stat) {
        assert.isNull(err);
        console.log(stat);
        assert.equal(3, stat.total);
        done();
      })
    });
  })
});