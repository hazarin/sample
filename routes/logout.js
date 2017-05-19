const express = require('express');
const router = express.Router();

/* Logout page. */
router.get('/', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
