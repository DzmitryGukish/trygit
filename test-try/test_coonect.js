var orm = require('../models/orm.js');

// console.log(orm);
// console.log(orm.name);

// orm.insertRecord({name: "John Dow", email: "johndow@mail.com"}, "John Dow", function (err, body, headers) {
//   if (err) {
//     if (err.errid == 'non_200') {
//       return console.log("Records key exists");
//     } else {
//       return console.log(err.message);
//     }
//   }
//   console.log("body: ", body, 'ok');
//   console.log("headers: ", headers, 'ok');
// });

// orm.insertUser({name: "Johan Dow", email: "johandow@mail.com"}, function (err, body, headers) {
//   console.log("err: ", err, ' .end');
//   if (body) console.log("body: ", body, ' .end');
//   if (headers) console.log("headers: ", headers, ' .end');
// });

orm.listEmail(function (err, list) {
  if (err) throw err;
  list.forEach(function (doc) {
    console.log(doc.key, '//', doc.value);
  })

});
