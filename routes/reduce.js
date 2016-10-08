var express = require('express');
var config = require('../config');
var router = express.Router();
var User = require('../models/users').users;
var http = require('http');
var util = require('util');
// var HttpError = require('../models/errors');

console.log('Hello from routes/reduce.js');


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

router.get(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: 'Link ' + req.path + ' not found',
    error: {},
  });
});

module.exports = router;
