var fs = require('fs');
var crypto = require('crypto');

var users = function(db) {
  var usersFile = __dirname + '/usersdb.json';

  var loadList = function(callback) {
    uList = {};
    fs.stat(usersFile, function (err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          callback(null, {});
        } else {
          console.log(err);
        }
      } else {
        if (stats.isFile()) {
          fs.readFile(usersFile, function(err, data) {
            if (err) {
              callback(err);
            };
            uList = JSON.parse(data);
            callback(null, uList);
          });
        }
      }
    })
  };

  // loadList(function (err) {
  //   if (err) {
  //     if (err.code !== 'ENOENT') {
  //       console.log(' new file ');
  //     } else {
  //       console.log(err);
  //     }
  //   }
  // });

  var saveList = function(uList, callback) {
    var content = JSON.stringify(uList);
    // console.log(content);
    fs.writeFile(usersFile, content, function(err) {
      if (err) {
        throw (err);
      };
      return callback();
    });
  };

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
    loadList(function(err, userList) {
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
    });
  };

  this.newUser = function(name, pass, callback) {
    loadList(function (err, usersL) {
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
