var util = require('util');
var nano = require('nano')('http://localhost:5984');
var config = require('../config');
var dbName = config.get('db.name');
var async = require('async');

var db = nano.db.get(dbName, function (err, body) {
  if (err) {
    console.log(JSON.stringify(err));
    nano.db.create(dbName, function (err, body) {
      if (!err) {
        console.log('Database ' + dbName + ' created!');
      }
    })
  }
});

var crypto = require('crypto');

function LoginError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, LoginError);
  this.message = message;
};
util.inherits(LoginError, Error);
LoginError.prototype.name = 'LoginError';


var users = function(db) {
  var usersDB = '';
  var ddb = db;

  var hash = function(pass, salt, callback) {
    var iterations = 100000;
    var len = 128;
    if (3 === arguments.length) {
      crypto.pbkdf2(pass, salt, iterations, len, function(err, hash) {
        callback(err, hash.toString('base64'));
      });
    } else {
      callback = salt;
      crypto.randomBytes(len, function(err, salt) {
        if (err) {
          return callback(err);
        }
        salt = salt.toString('base64');
        crypto.pbkdf2(pass, salt, iterations, len, function(err, hash) {
          if (err) {
            return callback(err);
          }
          callback(null, salt, hash.toString('base64'));
        });
      });
    };
  };

  this.authenticate = function(name, pass, callback) {
    var user = userList[name];
    if (!user) {
      return callback(new LoginError('Cannot find user ' + name));
    };
    hash(pass, user.salt, function(err, hash) {
      if (err) {
        return callback(err);
      };
      if (hash === user.hash) {
        return callback(null, user);
      };
      return callback(new LoginError('Invalid password'));
    });
  };

  this.create = function(name, pass, callback) {
    if (err) {
      return callback(err);
    }

    if (usersL && usersL[name]) {
      return callback(new LoginError('User ' + name + ' exists'));
    }

    hash(pass, function(err, salt, hash) {
      if (err) {
        return callback(err);
      }
      usersL[name] = {  name: name, salt: salt, hash: hash };
      return saveList(usersL, callback);
    });

  };

  this.find = function (scope, callback) {
    // db.
  }

  this.insert = function (user, callback) {
    ddb.insert(user, function (err, body) {
      if (err) {
        callback(err);
      } else {
        callback(null, body);
      }
    })
  }

  this.authorize = function (username, password, callback) {
    var User = this;
    async.waterfall([
      function (callback) {
        User.findOne({username: username}, callback);
      },
      function (user, callback) {
        if (user) {
          if (user.checkPassword(password)) {
            callback(null, user);
          } else {
            callback(new LoginError("Password is wrong"));
          }
        } else {
          var user = new User({username: username, password: password});
          user.save(function (err) {
            if (err) {
              return callback(err);
            }
            callback(null, user);
          })
        }
      }
    ], callback);

  }

  return this;
}

module.exports = users;
module.exports = LoginError;
