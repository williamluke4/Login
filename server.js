var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var exphbs  = require('./index.js'); // "express-handlebars"
var mongoose = require('mongoose');
var passport = require('passport');
var exec = require('child_process');
var LocalStrategy = require('passport-local').Strategy;
var pkg = require('./package.json');


var app = express();
app.set('port', process.env.PORT || 3700);

var server = app.listen(app.get('port'), function() {
  console.log(pkg.name, 'Listening On Port ', server.address().port);
});
var io = require('socket.io')(server);
var hbs = exphbs.create({
  defaultLayout: 'layout',
    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'shared/templates/',
        'views/partials/'
    ]

});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ keys: ['secretkey1', 'secretkey2', '...']}));

app.use(express.static(path.join(__dirname, 'public')));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Connect mongoose
mongoose.connect('mongodb://127.0.0.1:27017/nodejs', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});

// Register routes
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


function sendMessage(message, socket, elementID, webState,callback){
    exec.execFile('../remote',
        ['-m', message],
        function (error, stdout, stderr) {
            console.log("The message is: " + message);
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if( stdout.indexOf("RECIVED:") > -1){
                var state = stdout.split('RECIVED: ')[1].split('.')[0];
                console.log("Sending Message Back To Client");
                socket.emit(
                    "callbackButton",
                    {
                        webstate: webState,
                        message: "received",
                        operation: message,
                        state: state,
                        switchID: elementID

                    });
            }

            else if(stdout.indexOf("NO REPLY") > -1) {
                console.log('NO REPLY' + elementID + ' ' + webState);

                socket.emit(
                    "failed",
                    {
                        webstate: webState,
                        switchID: elementID
                    });

            }

            if (error !== null) {
                console.log('exec error: ' + error );

                socket.emit(
                    "callbackError",
                    {
                        webstate: webState,
                        error: error,
                        switchID: elementID

                    });

            }


        });
}


io.sockets.on('connection', function (socket) {
  socket.on('send', function (data) {

    sendMessage(data.message, socket, data.switchID, data.webstate);

  });
});


