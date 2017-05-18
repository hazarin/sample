var express = require('express');
var router = express.Router();

/* GET membership register page. */
router.get('/', function(req, res, next) {
  res.render('membership', { title: 'Membership' });
});

router.post('/', function(req, res, next) {
  'use strict'
  let User = req.app.get('User');
  let body = req.body;
  body.username = body.email_first;
  User.register(body, body.password_first, function(err) {
      res.render('membership', { error: err});
  });


  res.render('membership', { title: 'Post'})
});


module.exports = router;
