/**
 * Created by hazarin on 21.05.17.
 */
const express = require('express');
const router = express.Router();
const Calendar = require('../models').Calendar;
const models = require('../models');
const passport = require('passport');

/* Calendars api */
router
.get('/:userId', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
  models.User.findById(req.params.userId)
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User not found'})
    }

    let Product = models.Product;

    models.Calendar
    .findAll(
      {
        where: {'$Product.user_id$': req.params.userId},
        include: {model: Product, required: true }
      })
    .then(calendars => {
      return res.status(200).send(calendars);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
  })
  .catch(err => {
    return res.status(400).send(err)
  });
})
.get('/:userId/:calendarId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  models.User.findById(req.params.userId)
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User not found'})
    }
    let Product = models.Product;

    models.Calendar
    .findOne(
      {
        where: {
          '$Product.user_id$': req.params.userId,
          id: req.params.calendarId
        },
        include: {model: Product, required: true }
      }
    )
    .then(calendar => {
      if(calendar === null) {
        return res.status(404).send({message: 'Calendar no found'})
      }
      return res.status(200).send(calendar);
    })
    .catch(err => {
      return res.status(400).send(error)
    });
  })
  .catch(err => {
    return res.status(400).send(err)
  });

})
.post('/:productId', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  models.Product.findById(req.params.productId)
  .then(product => {
    if(product === null) {
      return res.status(404).send({message: 'Product no found'})
    }
    models.Calendar
    .create({
      title: req.body.title,
      product_id: req.params.productId
    })
    .then((calendar) => {
      return res.status(201).send(calendar);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
  })
  .catch(err => {
    return res.status(400).send(err);
  });
})
.patch('/:userId/:calendarId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  models.User.findById(req.params.userId)
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User not found'})
    }

    let Product = models.Product;

    models.Calendar
    .findOne({
        where: {
          '$Product.user_id$': req.params.userId,
          id: req.params.calendarId
        },
        include: {model: Product, required: true }
      }
    )
    .then( calendar => {
      if(calendar === null) {
        return res.status(404).send({message: 'Calendar no found'})
      }
      calendar.update({title: req.body.title})
      .then(calendar => {
        return res.status(200).send(calendar)
      })
      .catch(err => {
        return res.status(400).send(err);
      });
    })
    .catch(err => {
      return res.status(400).send(err);
    })
  })
  .catch(err => {
    return res.status(400).send(err)
  });

});

module.exports = router;
