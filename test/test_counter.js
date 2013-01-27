// test_counter.js
var assert = require('assert')
  , counter = require('../lib/counter')
  , config = require('../config')
  , async = require('async');
  ;

describe('Counter', function() {
  this.timeout(50000);

  xit('should retrieve all entries without since', function(done) {
    counter.fetch(null, function(err, results) {
      assert.equal(null, err);
      done();
    })
  });

  xit('should retrieve all updates', function(done) {
    async.waterfall([
      function(cb) {
        counter.latest(function(err, timestamp) {
          assert.equal(null, err);
          cb(null, timestamp);
        });
      },
      function(timestamp, cb) {
        counter.fetch(timestamp, function(err, results) {
          assert.equal(null, err);
          cb(null, results);
        })
      }
    ], function(err, result) {
      assert.equal(null, err);
      done();
    });
  });

  xit('should show the latest stat', function(done) {
    async.waterfall([
      function(cb) {
        counter.latest(function(err, timestamp) {
          cb(null, timestamp);
        });
      },
      function(timestamp, cb) {
        counter.stat(timestamp, function(err, entries) {
          cb(null, entries);
        });
      }
    ], function(err, result) {
      console.log(result);
      done();
    });
  });

  it('should retrieve the diff and get the latest stat', function(done) {
    async.waterfall([
      function(cb) {
        counter.latest(function(err, timestamp) {
          assert.equal(null, err);
          cb(null, timestamp);
        });
      },
      function(timestamp, cb) {
        counter.fetch(timestamp, function(err, latest) {
          assert.equal(null, err);
          cb(null, latest);
        })
      },
      function(timestamp, cb) {
        counter.stat(timestamp, function(err, entries) {
          cb(null, entries);
        });
      }

    ], function(err, entries) {
      assert.equal(null, err);
      console.log(entries);
      done();
    });
  });
})