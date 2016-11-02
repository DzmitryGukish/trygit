var express = require('express');
var config = require('../config');
var router = express.Router();


/* GET home page. */

/*****
  ENABLED ROUTES:

for all:
  GET site/   - home
  GET site/a/login
  POST site/a/login
  GET site/[A-Za-z0-9]{1,10} - redirect to real-url

for authorized:
  POST site/a/logout - logout then redirect to /

for users:
  GET site/a/profile - user profile
  UPD site/a/profile - user profile
  GET site/a/links - list of links
  GET site/a/links/%link% - get link info, id is short-url
  PUT site/a/links/add - add user link (short-url, real-url)
  DELETE site/a/links/del/%link%  - not delete in real, just sign as deleted
  UPD site/a/links/%link% - do update link

for admin:
  GET site/a/users - show all users list
  GET site/a/users/%user% - show user profile with his own links
  UPD site/a/users/%user% - update user purposes
  GET site/a/links - show all links list with owners
  GET site/a/links/%link% - show link info
  UPD site/a/links/%link% - update link info
  DEL site/a/links/%link% - disable link info

*****/
router.get('/', function(req, res, next) {
  var title = config.get('title');
  var username = null;
  var locals = {title: title};
  if (username && username != null) {
    locals.username = username;
  }
  res.render('index', {locals});
});

router.get('/a/login', function(req, res, next) {
  var title = config.get('title');
  res.render('login', {
    locals:{
      title: title
    }
  });
});

router.get('/:link', function(req, res, next) {
  var title = config.get('title');
  var locals = {
    title: title,
    path: req.params.link,
    realPath: '#'
  };
  res.render('process', {locals});
});

module.exports = router;
