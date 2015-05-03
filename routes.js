var passport = require('passport');
var Account = require('./models/account');
var router = require('express').Router();

var Switch = require('./models/switches');

router.get('/', function(req, res) {
  Switch.find( function ( err, switches, count ){
    res.render( 'index', {
      user: req.user,
      switches : switches
    });
  });
});

router.get('/register', function(req, res) {
  res.render('register', {
    user: req.user
  });
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
    if (err) { console.log('error while user register!', err); return next(err); }

    console.log('user registered!');

    res.redirect('/');
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
router.post( '/create', function ( req, res ){
  console.log(JSON.stringify(req.body));
  console.log("THIS IS THE CREATE CALLBACK");
  new Switch({
    elementID : req.body.elementID,
    dataID  : req.body.dataID,
    group  : req.body.group
  }).save( function( err, comment, count ){
        res.redirect( '/' );
      });
});

router.post('/delete',function ( req, res ){
  Switch.remove({elementID:req.body.elementID}, function( err, comment, count ){
    res.redirect( '/switches' );
  });
  console.log();
  console.log("Deleted: " + req.body.elementID);
  console.log();
});

module.exports = router;