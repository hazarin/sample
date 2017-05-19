const express = require('express');
const router = express.Router();

/* GET success registration page. */
router.get('/', function(req, res, next) {
  res.render('register_success', { title: 'Express' });
});

module.exports = router;
