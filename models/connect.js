var config = require('../config');
var nano = require('nano')(config.get("db:url"));

console.log("db:url is ", config.get("db:url"));

var database = nano.db.use(config.get("db:name"));
console.log("db:name is ", config.get("db:name"));


function insertRecord(rec, recType, callbackSuccess, callbackFail) {
  console.log('argc is ', arguments.length);
  if (3 == arguments.length) {
    callbackFail = callbackSuccess;
  }
  if (recType === 'user' || recType === 'link') {
    console.log('recType: ', recType);
    var key = recType + ':' + rec.name.toLowerCase();
    console.log('Fetch. key: ', key);
    database.fetch({keys: key}, function (err, body) {
      if (err) return callbackFail(err);
      console.log('Fetch. key: ', key);
      if (body.total_rows > 0 && body.rows[0].error != 'not_found') {
        database.insert(rec, key, function (err, body) {
          if (callbackSuccess && typeof callbackSuccess == "function") {
            return callbackSuccess(err, body);
          }
        });
      } else {
        if (callbackFail && typeof callbackFail == "function") {
          return callbackFail(err, body);
        } else {
          return false;
        }
      }
    });
  } else {
    if (callbackFail && typeof callbackFail == "function") {
      return callbackFail(new Error('Record type "' + recType + ' "can not be applied.'));
    } else {
      return false;
    }
  }
};

function insertUser(rec, callback) {
  console.log('func user');
  insertRecord(rec, 'user', function (err, body) {
      if (callback && typeof callback == "function") {
        return callback(err, body);
      } else {
        return (err);
      }
    }
  );
}

function insertLink(rec, callback) {
  var key = 'link:' + rec.name.toLowerCase();
  insertRecord(rec, 'link', function (err, body) {
      if (callback && typeof callback == "function") {
        return callback(err, body);
      } else {
        return (err);
      }
    }
  );
}


// insertUser({name: "Ron Sharman", email: "ronsharman@mail.com"}, function (err, body) {
//   console.log(body,'ok');
// });


var orm = {
  insertUser: insertUser,
  insertLink: insertLink
}

module.exports.orm = orm;
