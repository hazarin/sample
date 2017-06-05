/**
 * Created by hazarin on 26.05.17.
 */
const express = require('express');
const router = express.Router();
const models = require('../models');

router
.get('/calendars', (req, res, next) => {

  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication required'});
  }

  const Product = models.Product;

  models.Calendar.findAll(
    {
      where: {'$Product.user_id$': req.user.id},
      include: {model: Product, required: true }
    }
  )
  .then(calendars => {
    if(!calendars) {
      return res.status(404).send({message: 'Calendars no found'})
    }
    return res.status(200).send(calendars);
  })
  .catch(
    error => { return res.status(400).send(error) });

})
.post('/activities/:calendarId', (req, res, next) => {
  const Calendar = models.Calendar;
  const Product = models.Product;
  const Activity = models.Activity;

  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication requred'});
  }


  models.Calendar.findOne(
    {
      where: {
        '$Product.user_id$': req.user.id,
        // id: req.params.calendarId
      },
      include: {model: Product, required: true }
    }
  )
  .then((calendar) => {
    if(calendar === null) {
      return res.status(404).send({message: 'Calendar no found'})
    }
    req.body.calendar_id = req.params.calendarId;

    return models.Activity.build(req.body)
    .save()
    .then(activity => {
      return res.status(201).send(activity)
    })
    .catch(error => {
      return res.status(400).send(error)
    });


  })
  .catch(
    error => {
      return res.status(400).send(error)
    });


})
.get('/activities/:calendarId',  (req, res, next) => {
  const Calendar = models.Calendar;

  return models.Activity
  .findAll(
    {
      where: {'$Calendar.id$': req.params.calendarId},
      include: {model: Calendar, required: true }
    }
  )
  .then(activities => {
    if(!activities) {
      return res.status(404).send({message: 'Activities no found'})
    }
    return res.status(200).send(activities);
  })
  .catch(
    error => {
      return res.status(400).send(error)
    });

})
.get('/confirm/:confirmKey', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).send({message: 'Already logged in'});
  }

  models.User.findOne(
    {where: {activationKey: req.params.confirmKey, verified: false}}).
    then(user => {

      user.update({verified: true, activationKey: null})
      .then(() => {
          return res.status(200).send({message: 'Activation success'});
        })
      .catch((error) => {
        return res.status(200).send(error);
      });

    }).catch(error => {
      return res.status(200).send(error);
    });
})
.post('/register', (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.status(400).send({message: 'Already logged in'});
  }

  const password = req.body.password_first === req.body.password_second ? req.body.password_first : false;
  if (password === false) {
    return res.status(400).send({message: "Passwords didn't match"});
  }
  const email = req.body.email_first === req.body.email_second ? req.body.email_first : false;
  if (email === false) {
    return res.status(400).send({message: "Email didn't match"});
  }
  req.body.email = req.body.email_first;

  models.User.register(req.body, req.body.password_first, (err, user) => {
    let mailer = res.locals.mailer;
    let config = res.locals.app.get('config');
    let dev_mode = res.locals.app.get('env') === 'development';
    var confirmUrl = config.frontend.confirmation_email_uri;

    if (err !== null) {
      return res.status(400).send(err);
    } else {
      let mailer = res.locals.mailer;
      confirmUrl = confirmUrl + user.activationKey;
      mailer.send('email_confirmation', {
        to: dev_mode ? config.frontend.debug_mail : user.email,
        subject: 'A Daily Clock account confirmation',
        link: confirmUrl,
      }, (err) => {
        if (err) {
          console.log(err);
          return res.status(400).send('There was an error sending the email');
        }
        return res.status(200).send({message: 'Mail send'});
      });
    }

  });
})
.post('/reset/:resetKey', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).send({message: 'Already logged in'});
  }

  const password = req.body.password_first === req.body.password_second ? req.body.password_first : false;
  if (password === false) {
    return res.status(400).send({message: "Passwords didn't match"});
  }

  return models.User.findOne({where: {resetPasswordKey: req.params.resetKey, verified: true}})
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User no found'});
    }

    models.User.resetPassword(user.email, password, req.params.resetKey, (err, user) => {
      if (err !== null) {
        return res.status(400).send(err);
      }

      return res.status(200).send({message: 'Password successfully changed'});
    })

  }).catch(error => res.status(400).send(error));
})
.get('/reset/:resetKey', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).send({message: 'Already logged in'});
  }

  return models.User.findOne({where: {resetPasswordKey: req.params.resetKey, verified: true}})
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User no found'});
    }

    return res.status(200).send({message: 'User exists'});
  }).catch(error => res.status(400).send(error));

  })
.post('/reset', (req, res, next) => {

  if (req.isAuthenticated()) {
    return res.status(400).send({message: 'Already logged in'});
  }

  return models.User.findOne({where: {email: req.body.email, verified: true}})
  .then(user => {

    if (user === null) {
      return res.status(404).send({message: 'User no found'})
    }

    models.User.setResetPasswordKey(user.email, (err, user) => {
      let mailer = res.locals.mailer;
      let config = res.locals.app.get('config');
      let dev_mode = res.locals.app.get('env') === 'development';
      var restoreUrl = config.frontend.password_reset_uri;

      if (err !== null) {
        return res.status(400).send(err);
      }

      restoreUrl = restoreUrl + user.resetPasswordKey;

      mailer.send('email_reset', {
        to: dev_mode ? config.frontend.debug_mail : user.email,
        subject: 'A Daily Clock password reset',
        link: restoreUrl,
      }, (err) => {
        if (err) {
          console.log(err);
          return res.status(400).send('There was an error sending the email');
        }
        return res.status(200).send({message: 'Mail send'});
      });
    });
  });

})
.get('/membership', (req, res, next) => {

  return models.Catalog
  .findAll({type: 'membership'})
  .then((items) => {
    return res.status(200).send(items);
  }).catch(error => res.status(400).send(error));
})
.get('/', (req, res, next) => {

  if (!req.isAuthenticated()) {
    return res.status(401).send({message: 'Authentication requred'})
  }

  return models.User.find({where: {id: req.user.id}}).then(user => {
    if (!user) {
      return res.status(404).send({message: 'User no found'})
    }
    res.status(200).send({
      email: user.email,
      verified: user.verified,
      firstName: user.firstName,
      surName: user.surName,
      address: user.address,
      postalCode: user.postalCode,
      city: user.city,
      phone: user.phone,
      country: user.country,
      membership: user.membership,
    })
  }).catch(error => res.status(400).send(error))

})
.get('/logout', (req, res, next) => {
  if (req.isAuthenticated() === false) {
    return res.status(400).send({message: 'Not logged in'});
  }
  req.logout();
  return res.status(200).send({message: 'Logged out'});
})
.post('/contact', (req, res, next) => {
  let user = req.isAuthenticated() ? req.user : null;

  if (user !== null) {
    req.body.user_id = user.id;
  };

  return models.Message
  .build(req.body)
  .save()
  .then(message => res.status(201).send({message: 'Message send'}))
    .catch(error => res.status(400).send(error));

})
.post('/login', (req, res, next) => {
  let User = res.locals.User;

  let passport = res.locals.passport;

  if (req.isAuthenticated()) {
    return res.status(200).send({message: 'Already logged in'});
  }

  return passport.authenticate('local',
    (err, user, info) => {
      return err
        ? res.status(400).send(err)
        : user
          ? req.logIn(user, (err) => {
            return err
              ? res.status(400).send(err)
              : res.status(200).send({
                email: user.email,
                verified: user.verified,
                firstName: user.firstName,
                surName: user.surName,
                address: user.address,
                postalCode: user.postalCode,
                city: user.city,
                phone: user.phone,
                country: user.country,
                membership: user.membership,
              });
          })
          : res.status(400).send(info);
    })(req, res, next);

});

module.exports = router;
