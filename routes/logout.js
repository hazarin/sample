var express = require('express');
var router = express.Router();

/* Logout page. */
router.get('/', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
