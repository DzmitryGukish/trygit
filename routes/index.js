var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = process.env.npm_package_title;
  res.render('index', { title: title });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
