var orm = require('../models/orm.js');

// console.log(orm);
// console.log(orm.name);

orm.insertRecord({name: "John Dow", email: "johndow@mail.com"}, function (err, body, headers) {
  if (err) {
    if (err.errid == 'non_200') {
      return console.log("Records key exists");
    } else {
      return console.log(err.message);
    }
  }
  console.log("body: ", body, 'ok');
  console.log("headers: ", headers, 'ok');
});
