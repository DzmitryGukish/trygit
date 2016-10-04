var crypto;
try {
  crypto = require('crypto');
  console.log('crypto support is enabled!');
  var pwd = 'secret';
  var len = 128;
  var iterations = 100000;
  var digest = 'sha512';
  crypto.randomBytes(len, function(err, salt) {
    if (err) throw err
    salt = salt.toString('base64');
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash) {
      if (err) throw err;
      console.log('salt is ' + salt + '\n' + 'hash is ' + hash.toString('base64'))
    })
    // Salt = salt.toString('base58')
    // console.log('now salt is ' + salt)
  })
} catch (err) {
  console.log('crypto support is disabled!');
}
