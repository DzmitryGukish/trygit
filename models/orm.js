var config = require('../config');
var nano = require('nano')(config.get("db:url"));
var db = nano.db.use(config.get("db:name"));

var orm = {
  // inst = {};

  checkKey: function (key, callback) {
    db.get(key, function (err, body, headers) {
      if (err) return callback(err);
      return callback(null, body, headers);
    });
  },

  checkEmail: function (email, callback) {
    db.get(email, function (err, body, headers) {
      if (err) return callback(err);
      return callback(null, body, headers);
    });
  },

  listEmail: function (callback) {
    db.view('emails', 'emails', function (err, body) {
      if (err) return callback(err);
      var list = body.rows;
      return callback(null, list);
    });
  },

  insertRecord: function (rec, key, callback) {
    if (2 == arguments.length) {
      callback = key;
      key = null;
    };
    db.insert(rec, key, function (err, body, headers) {
      if (err) return callback(err);
      return callback(null, body, headers);
    })
  },

  insertUser: function (rec, callback) {
    var key = rec.name;
    db.get(key, function (err, body, headers) {
      if (err) {
        if (err.errid === 'non_200') {
          // this point to insert
          db.insert(rec, key, function (errIns, bodyIns, headersIns) {
            return callback(errIns, bodyIns, headersIns);
          })
        } else {
          // some else errors
          return callback(err);
        }
      } else {
        return callback(new Error('user exists'), body, headers);
      }
    });
  }
};

module.exports = orm;
