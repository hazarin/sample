const express = require('express');
const router = express.Router();

/* Logout page. */
router.get('/', function(req, res, next) {
  req.logout();
  res.locals.isAuthenticated = req.isAuthenticated();
  return res.redirect('/');
});

module.exports = router;
