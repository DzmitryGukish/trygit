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

  insertRecord: function (req, key, callback) {
    if (2 == arguments.length) {
      callback = key;
      key = null;
    };
    db.insert(req, key, function (err, body, headers) {
      if (err) return callback(err);
      return callback(null, body, headers);
    })
  }
};

module.exports = orm;
