var Db = require('../models/users.js');

var users = new Db();

var fn = function(err, salt, hash) {
  if (err) {
    console.log(err);
  } else {
    console.log('new user created');
  }
};

users.newUser('admin', 'secret', fn);

users.newUser('manager', 'topsecret', fn);

users.newUser('accounter', 'highsecret', fn);

users.newUser('accounter2', 'losecret', fn);
