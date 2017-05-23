/**
 * Created by hazarin on 21.05.17.
 */
const express = require('express');
const router = express.Router();
const Calendar = require('../models').Calendar;
const Product = require('../models').Product;

/* Calendars api */
router
.get('/:userId',  (req, res, next) => {
  let User = res.locals.User;

  return Calendar
    .findAll(
      {
        where: {'$Product.user_id$': req.params.userId},
        include: {model: Product, required: true }
      }
      )
    .then(calendars => {
      if(!calendars) {
        return res.status(404).send({message: 'Calendars no found'})
      }
      res.status(200).send(calendars);
    })
    .catch(
      error => res.status(400).send(error)
  );

})
.get('/:userId/:calendarId', (req, res, next) => {
  return Calendar
  .find(
    {
      where: {
        '$Product.user_id$': req.params.userId,
        id: req.params.calendarId
      },
      include: {model: Product, required: true }
    }
  )
  .then(calendar => {
    if(!calendar) {
      return res.status(404).send({message: 'Calendar no found'})
    }
    res.status(200).send(calendar);
  })
  .catch(error => res.status(400).send(error));
})
.post('/:productId', (req, res, next) => {
  return Calendar
  .create({
    title: req.body.title,
    product_id: req.params.productId
  })
  .then((calendar) =>
    res.status(201).send(calendar)
  )
  .catch((error) => res.status(400).send(error));
})
.patch('/:calendarId', (req, res, hext) => {
  return Calendar
    .findById(req.params.calendarId)
    .then( calendar => {
      return calendar
      .update({title: req.body.title})
      .then(
        () => res.status(200).send(calendar)
      )
      .catch(
        (error) => res.status(400).send(error)
      );
  })
});

module.exports = router;
