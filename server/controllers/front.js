/**
 * Created by hazarin on 26.05.17.
 */
const express = require('express');
const router = express.Router();
const models = require('../models');
const uuid = require('uuid');

const addOrder = (user) => {
  let serial = uuid.v1();

  models.Catalog.findOne({where: {membership: 'time'}}).then((catalog) => {
    models.Product.build({serial: serial}).save()
    .then((product) => {
      let title = 'Order to product with serial number ' + product.serial
      models.Order.build(
        {
          title: title,
          product_id: product.id,
          user_id: user.id,
          catalog_id: catalog.id,
        }
      ).save().then();
    })
    .catch((err) => {
      return err;
    });
  });

  return 0;
}

const activateOrder = (user) => {

  models.Order.findOne({where: {user_id: user.id}})
  .then((order) => {
    order.getProduct()
    .then(product => {

      product.setUser(user)
      .then(() => {
        models.Calendar.build({title: product.serial, product_id: product.id})
        .save().then();
        return;
      })
    })
  })

}

router
.patch('/', (req, res, next) => {
  let data = req.body;
  let disabled = {
    password: true,
  };

  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication requred'});
  }

  for(let key in disabled) {
    if(data.hasOwnProperty(key)) {
      delete data[key];
    }
  }

  models.User.findById(req.user.id)
  .then(user => {
    user.update(data)
    .then(user => {
      return res.status(204).send();
    })
    .catch(err => {
      return res.status(400).send(err);

    })
  })
  .catch(err => {
    return res.status(400).send(err);
  })

})
.patch('/products', (req, res, next) => {
  let data = req.body;
  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication requred'});
  }

  for(let index in data) {
    if (data.hasOwnProperty(index)) {
      let attr = data[index];
      models.Product.findById(index)
      .then(product => {
        product.title = attr;
        product.save().then(product => {
          product.getCalendars().then(calendars => {
            if (calendars !== null && calendars.length > 0) {
              calendars[0].update({title: product.title})
              .then();
            }
          })
        });
      })
      .catch(err => {
        return res.status(400).send(err)
      });
    }
  }

  models.Product.findAll({where: {user_id: req.user.id}})
  .then(products => {
    return res.status(200).send(products);
  })
  .catch(err => {
    return res.status(400).send(err);
  });

})
.post('/products', (req, res, next) => {
  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication requred'});
  }

  models.Product.findOne({
    where: {
      user_id: null,
      serial: req.body.serial,
    }
  })
  .then(product => {
    if(product === null) {
      return res.status(404).send({message: 'Product no found'})
    }
    product.setUser(req.user)
    .then(product => {
        models.Product.findAll({where: {user_id: req.user.id}})
        .then(products => {
          return res.status(200).send(products);
        });
      })
    .catch(err => {
      return res.status(400).send(err);
    })
  })
  .catch(err => {
      return res.status(400).send(err);
  })

})
.get('/products', (req, res, next) => {
  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication requred'});
  }

  models.Product.findAll({where: {user_id: req.user.id }})
  .then(products => {
    return res.status(200).send(products);
  })
  .catch(err => {
    return res.status(400).send(err);
  })
})
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
.delete('/activities/:calendarId/:activityId', (req, res, next) => {
  const Calendar = models.Calendar;
  const Product = models.Product;
  const Activity = models.Activity;

  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication requred'});
  }

  models.Activity.destroy({
    where:{id: req.params.activityId, calendar_id: req.params.calendarId}})
  .then(num => {
    return res.sendStatus(204);
  })
  .catch(err => {
    return res.status(400).send(error);
  });

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
  if (req.isAuthenticated() === false) {
    return res.status(401).send({message: 'Authentication requred'});
  }

  const Calendar = models.Calendar;
  let from = new Date(req.query.from);
  let to = new Date(req.query.to);

  let query = `
  SELECT dt.dt, ac.* FROM Dates as dt
  LEFT JOIN (
    SELECT * FROM Activities WHERE ((activity_date < :dt_to AND \`repeat\` != 'not')
                                   OR (activity_date BETWEEN :dt_from AND :dt_to)) 
                                   AND (calendar_id = :calendar_id)

          ) as ac ON (
        CASE ac.repeat
          WHEN 'not' THEN ac.activity_date
          WHEN 'day'
          THEN
            ac.activity_date + IF(DATEDIFF(dt.dt, ac.activity_date) >= 0, DATEDIFF(dt.dt, ac.activity_date), 0)
          WHEN 'week'
          THEN
            ac.activity_date + IF(DATEDIFF(dt.dt, ac.activity_date) >= 0 AND DATEDIFF(dt.dt, ac.activity_date) MOD 7 = 0, DATEDIFF(dt.dt, ac.activity_date), 0)
          WHEN 'month'
          THEN
            DATE_ADD(ac.activity_date, INTERVAL IF(DATEDIFF(dt.dt, ac.activity_date)>=0 AND DAY(dt.dt)=DAY(ac.activity_date), DATEDIFF(dt.dt, ac.activity_date), 0) DAY)
        END
      )=dt.dt
 WHERE
  dt.dt BETWEEN :dt_from AND :dt_to
 ORDER BY dt.dt, ac.activity_time;`;

  models.sequelize.query(query,
  {
    model: models.Activity,
    replacements: {
      dt_from: from,
      dt_to: to,
      calendar_id: req.params.calendarId,
      type: models.sequelize.QueryTypes.SELECT
    }
  })
  .then(activities => {
    if(!activities) {
      return res.status(404).send({message: 'Activities no found'})
    }
    return res.status(200).send(activities);
  })
  .catch(error =>
  {
        return res.status(400).send(error)
  });

  // models.Activity
  // .findAll(
  //   {
  //     where: {
  //       '$Calendar.id$': req.params.calendarId,
  //       activity_date: {$between:[from, to]}
  //     },
  //     include: {model: Calendar, required: true }
  //   }
  // )
  // .then(activities => {
  //   if(!activities) {
  //     return res.status(404).send({message: 'Activities no found'})
  //   }
  //   return res.status(200).send(activities);
  // })
  // .catch(
  //   error => {
  //     return res.status(400).send(error)
  //   });

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
          activateOrder(user);
          return res.status(200).send({message: 'Activation success'});
        })
      .catch((error) => {
        return res.status(400).send(error);
      });

    }).catch(error => {
      return res.status(400).send(error);
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
    let confirmUrl = config.frontend.confirmation_email_uri;

    if (err !== null) {
      return res.status(400).send(err);
    } else {

      addOrder(user);

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
  }).catch(error => {
    return res.status(400).send(error)
  });
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
