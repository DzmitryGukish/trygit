var express = require('express');
var config = require('../config');
var router = express.Router();
var User = require('../models/users').users;
var http = require('http');
var util = require('util');
var HttpError = require('../models/errors').HttpError;


/* GET home page. */
router.get('/', function(req, res, next) {
  var title = config.get('title');
  var username = 'Incognito';
  req.session.number = req.session.number + 1 || 1;
  res.render('index', {
    title: title,
    username: username,
    sessionNumber: req.session.number
  });
});

router.get('/:link', function(req, res, next) {
  var link = req.params.link;
  if (link === 'a') {
    res.redirect('/');
  } else {
    res.render('broken',{
      title: config.get('title'),
      link: link
    });
  }
});


module.exports = router;
