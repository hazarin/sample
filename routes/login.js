var express = require('express');
var router = express.Router();

/* Login page. */
router.get('/', function(req, res, next) {
  res.locals.flash = req.flash();
  res.render('login', { title: 'Login'})
});

router.post('/', function(req, res, next) {
  let passport = res.locals.passport;

  if (req.isAuthenticated()) {
    res.redirect('/');
  }

  req.flash('some_error', 'sometext');

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'User credentials invalid',
    successFlash: 'Welcome!'
  })(req, res, next);
});

module.exports = router;
