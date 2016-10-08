var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ConnectCouchDB = require('connect-couchdb')(session);
var config = require('./config');

var adminRoutes = require('./routes/admin');
var reduсeRoutes = require('./routes/reduce');

var app = express();

// View engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var storeOptions = {
  name: 'myapp-sessions'
};

app.use(session({
  secret: config.get("session:secret"),
  key: config.get("session:key"),
  resave: true,
  saveUninitialized: true,
  cookie: config.get("session:cookie"),
  // ,
  // store: new ConnectCouchDB(storeOptions) // <- that's who resend header!
}));

app.use('/', reduсeRoutes);
app.use('/a', adminRoutes);


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.status);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;

