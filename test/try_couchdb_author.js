var nano = require('nano')('http://127.0.0.1:5984');
var config = require('../config');

var dbName = 'testdb123';
var testDb;

function destroyTestDbs(cb) {
  nano.db.destroy('testdb', function (err) {
    // nano.db.destroy('test123', function (err) {
      // nano.db.destroy('test', function (err) {
        console.log('destroyed');
        cb();
      // });
    // });
  });
};

function connectTestDb(callback) {
  console.log('connect to db ' + dbName + '.');
  testDb = nano.db.use(dbName);
  checkAuthor(null,
    function (err, data) {
      console.log('author exists');
      for(r in data.rows) {
        console.log(data.rows[r].doc.author);
      };
      callback();
    },
    function (err, data) {
      console.log('author not exists');
      insertAuthor(err, function (e, d) {
        if (e) throw e;
        console.log('author inserted');
        callback();
      })
    }
  );
  // testDb.insert({author: "I am", dataCreate: Date()}, "author");
}

function checkAuthor(err, cbTrue, cbFalse) {
  testDb.fetch({"id": "author"}, function (err, data) {
    if (err) throw err;
    // console.log(data);
    if (0 != data.total_rows) {
      return cbTrue(err, data);
    } else {
      return cbFalse(err, data);
    }
  });
}

function insertAuthor(err, cb) {
  testDb.insert({author: "I am", dataCreate: Date()}, "author", function (err, data) {
    return cb(err, data);
  });
}

function createTestDb(callback) {
  nano.db.list(function (err, data) {
    var findDb = false;
    data.forEach(function (db) {
      if (db === dbName) {
        findDb = true;
      }
      // console.log(db);
    });
    if (!findDb) {
      console.log('db ' + dbName + ' not found. create.');
      nano.db.create(dbName, function (err) {
        if (err) throw err;
        connectTestDb(function () { callback(); });
      });
    } else {
      connectTestDb(function () { callback(); });
    }
    console.log('OK');
  });
};

function checkIndexExists(rec, idx, callbackTrue, callbackFalse) {
  var keys = [];
  if ('array' == typeof idx) {
    for(i in idx) {
      keys.push(rec[idx[i]]);
    }
  } else {
    keys.push(rec[idx]);
  }
  console.log("keys: ", keys);
  testDb.fetch({keys: keys}, function (err, body) {
    if (err) throw err;
    console.log("body :", body);
    console.log("body.rows[0].error:", body.rows[0].error);
    if (body.total_rows > 0 && body.rows[0].error != 'not_found') {
      return callbackTrue(err, body);
    } else {
      return callbackFalse(err, body);
    }
  });
}

function insertRecord(rec, idx) {
  checkIndexExists(rec, idx,
    function (err, data) {
      console.log('record with idx ' + idx + ' are exists. insertion cancelled.');
    },
    function (err, data) {
      console.log('record with idx ' + idx + ' aren`t exists. insertion proceed.');
      testDb.insert(rec, function (err, body) {
        if (err) throw err;
        return body;
      })
    }
    );
}


// destroyTestDbs(function () {
createTestDb(function () {
  insertRecord({user: "Zooma", email: "zooma@deluxe.com"}, ["user", "email"]);
});
// });

