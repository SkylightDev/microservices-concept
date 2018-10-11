var createError = require('http-errors');
var express = require('express');

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
winston = require('./config/winston');

var crypto = require('crypto');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var MongoMock = require('mongomock');

//mocking database
var db = {
    users:[
        {_id:'1',firstName:'Natasha',lastName:'Kerensky', nickname:'Black Widow', password:crypto.createHmac('sha256', 'testpassword').digest('hex'), email:'natasha@test.com', country:'Outreach'},
        {_id:'2',firstName:'Takashi',lastName:'Kurita', nickname:'Kurita', password:crypto.createHmac('sha256', 'testpassword2').digest('hex'), email:'kurita@test.com', country:'Draconis'},
        {_id:'3',firstName:'Jamie',lastName:'Wolf', nickname:'Dragoon', password:crypto.createHmac('sha256', 'testpassword3').digest('hex'), email:'wolf@test.com', country:'Inner Sphere'},
    ]
}
//variable accessible in all application
mongo = new MongoMock(db);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/favicon.ico', (req, res) => res.status(204));

//app.use(bodyParser.json({ type: 'application/json' }));
// We add the middleware after we load the body parser
app.use(expressValidator());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // return json instead of error page
  res.status(err.status || 500);
  res.json({status:err.status, message:err.message});
});

module.exports = app;
