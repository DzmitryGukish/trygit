var nano = require('nano')('http://127.0.0.1:5984');
var config = require('../config');

// var dbName = 'testdb123';
var testDb;

function destroyTestDbs(name, cb) {
  if (typeof name == "function") {
    cb = name;
    name = null;
  };
  if (name) {
    nano.db.destroy(name, function (err) {
      console.log('destroyed');
      cb();
    });
  } else {
    cb();
  }
};

function connectTestDb(name, callback) {
  console.log('connect to db ' + name + '.');
  testDb = nano.db.use(name);
  callback();
}

function createTestDb(name, callback) {
  nano.db.list(function (err, data) {
    var findDb = false;
    data.forEach(function (db) {
      if (db === name) {
        findDb = true;
      }
      // console.log(db);
    });
    if (!findDb) {
      console.log('db ' + name + ' not found. create.');
      nano.db.create(name, function (err) {
        if (err) throw err;
        connectTestDb(name, function () { callback(); });
      });
    } else {
      connectTestDb(name, function () { callback(); });
    }
    console.log('OK');
  });
};

function checkIndexExists(rec, idx, callbackTrue, callbackFalse) {
  var keys = [];
  if (Array.isArray(idx)) {
    for(i in idx) {
      keys.push(rec[idx[i]]);
    }
  } else {
    keys.push(rec[idx]);
  }
  console.log("idx: ", idx);
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

function insertRecord(rec, key, idx) {
  checkIndexExists(rec, idx,
    function (err, data) {
      console.log('record with idx ' + idx + ' are exists. insertion cancelled.');
    },
    function (err, data) {
      console.log('record with idx ' + idx + ' aren`t exists. insertion proceed.');
      testDb.insert(rec, key, function (err, body) {
        if (err) throw err;
        return body;
      })
    }
    );
}

// destroyTestDbs('testdb', function () {
// destroyTestDbs('testdb123', function () {
  createTestDb('testdb', function () {
    insertRecord({user: "Zooma", email: "zooma@deluxe.com"}, "Zooma", ["user", "email"]);
  });
// });
// });

// destroyTestDbs('testdb123', function () { console.log('OK');});


