const express = require('express');
const router = express.Router();

/* GET membership register page. */
router.get('/', function(req, res, next) {
  let User = res.locals.User;

  // let mailer = res.locals.mailer;
  //
  // mailer.send('email_confirmation', {
  //   to: 'iovamckey@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
  //   subject: 'Test Email', // REQUIRED.
  //   otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
  // }, function (err) {
  //   if (err) {
  //     // handle error
  //     console.log(err);
  //     res.send('There was an error sending the email');
  //     return;
  //   }
  //   res.redirect('/register/success');
  // });

  res.render('membership', { title: 'Membership' });
});

router.post('/', function(req, res, next) {
  let User = req.app.get('User');
  let body = req.body;
  body.email = body.email_first;

  User.register(body, body.password_first, function(err) {
      if (err) {
        res.render('membership', { error_message: err});
      } else {
        let mailer = app.locals.mailer;
        mailer.send('email', {
          to: 'iovamckey@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
          subject: 'Test Email', // REQUIRED.
          otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
        }, function (err) {
          if (err) {
            // handle error
            console.log(err);
            res.send('There was an error sending the email');
            return;
          }
          res.redirect('/register/success');
        });
      }

  });
});


module.exports = router;
