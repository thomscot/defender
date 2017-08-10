/*******************************
 * Module dependencies default *
 *******************************/
var express = require('express')
  , indexController = require('./routes/index')
  , membersController = require('./routes/members')
  , contactController = require('./routes/contact')
  , path = require('path');
/*******************************
 * Module dependencies (added) *
 *******************************/
var bootstrap = require('express-bootstrap-service')
 , mongo = require('mongodb')
 , monk = require('monk')
 , db = monk('localhost:27017/defender', { bufferMaxEntries: 0 }) // as attempt to issue a command to db immediately the failure is returned if there's no connection
 , favicon = require('serve-favicon')
 , logger = require('morgan')
 , cookieParser = require('cookie-parser')
 , bodyParser = require('body-parser')
 , expressValidator = require('express-validator');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/******************
 *app.use section *
 ******************/
 
app.use(bootstrap.serve);
// uncomment after placing your favicon in /public
//app.use(favicon(dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Make our db accessible to our router
// we're adding the object db (monk connection) to every HTTP req the app makes
// TODO: maybe not optimal
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/', indexController);
app.use('/members', membersController);
app.use('/contact', contactController);


// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/*****************
* ERROR HANDLERS *
******************/

// development error handler (print stacktrace)
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler (no stacktraces leaked to user)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;