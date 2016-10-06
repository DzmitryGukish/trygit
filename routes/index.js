var express = require('express');
var config = require('../config');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  var title = config.get('title');
  var username = 'Incognito';
  res.render('index', {
    title: title,
    username: username,
  });
});

router.get('/login', function(req, res, next) {
  var title = config.get('title');
  res.render('login', {
    title: title
  });
});

var Users = require('../models/users');

router.get('/users', function(req, res, next) {
  Users.find({}, function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  })
});

router.post('/user', function(req, res, next) {
  if (req.body.name && req.body.pwd) {
    User.insert({name: req.body.name, password: req.body.pwd}, function (err, body) {
      if (err) {
        res.render('error', {message: err.message, error: err});
      } else {
        res.render('index', {message: "success"})
      }
    });
  }
});

module.exports = router;
