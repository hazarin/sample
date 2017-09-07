const express = require('express');
const router = express.Router();

/* Login page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.locals.flash = req.flash();
  res.render('login', { title: 'Login'})
});

router.post('/', function(req, res, next) {
  let passport = res.locals.passport;

  if (req.isAuthenticated()) {
    return res.redirect('/');
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
