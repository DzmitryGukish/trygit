var nano = require('nano')('http://localhost:5984');
var db = nano.db.use('urlmanaging');
var crypto = require('crypto');

var users = function(db) {
  var usersDB = '';

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
      return callback(new Error('cannot find user ' + name));
    };
    hash(pass, user.salt, function(err, hash) {
      if (err) {
        return callback(err);
      };
      if (hash === user.hash) {
        return callback(null, user);
      };
      return callback(new Error('invalid password'));
    });
  };

  this.newUser = function(name, pass, callback) {
    loadList(function(err, usersL) {
      if (!err) {
        if (usersL && usersL[name]) {
          return callback(new Error('user ' + name + ' exists'));
        } else {
          hash(pass, function(err, salt, hash) {
            if (err) {
              return callback(err);
            } else {
              usersL[name] = {  name: name, salt: salt, hash: hash };
              return saveList(usersL, callback);
            }
          });
        }
      }
    });
  };

  return this;
}

module.exports = users
