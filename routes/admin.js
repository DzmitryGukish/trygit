var express = require('express');
var config = require('../config');
var router = express.Router();
var LoginError = require('../models/users').LoginError;
var User = require('../models/users').users;
var http = require('http');
var util = require('util');

console.log('Hello from routes/admin.js');

function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, LoginError);
  this.status = status;
  this.message = message || http.STATUS_CODES[status] || "Error";
};
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';


/* GET home page. */
router.get('/', function(req, res, next) {
  var title = config.get('title');
  var username = 'Incognito';
  req.session.number = req.session.number + 1 || 1;
  console.log(req.session.number);
  res.render('index', {
    title: title,
    username: username,
    sessionNumber: req.session.number
  });
});

router.get('/login', function(req, res, next) {
  var title = config.get('title');
  res.render('login', {
    title: title
  });
});

router.post('/login', function(req, res, next) {
  var username = req.body.name;
  var password = req.body.password;

  User.authorize(username, password, function (err, user) {
    if (err) {
      if (err instanceof LoginError) {
        return next(new HttpError(403, err.message.headers));
      } else {
        return next(err);
      }
    }
    req.session.userId = user._id;
    res.send({});

  });
});

var checkUser = function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/');
  }
}

router.get('/links', checkUser, function(req, res, next) {

});

module.exports = router;
