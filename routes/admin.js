var express = require('express');
var config = require('../config');
var router = express.Router();
var LoginError = require('../models/users').LoginError;
var HttpError = require('../models/errors').HttpError;
var User = require('../models/users').users;
var http = require('http');
var util = require('util');

// show login form
router.get('/login', function(req, res, next) {
  var title = config.get('title');
  res.render('login', {
    title: title
  });
});

// execute entrance to system or registration
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

// check is user logged
var checkUser = function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/');
  }
}

// show user's own links and statistics to him-self
router.get('/links', checkUser, function(req, res, next) {

});

module.exports = router;
