/**
 * Created by hazarin on 23.05.17.
 */
const express = require('express');
const router = express.Router();
const Calendar = require('../models').Calendar;
const Activity = require('../models').Activity;

/* Activity api */
router
.get('/:calendarId',  (req, res, next) => {
  let User = res.locals.User;

  return Activity
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
      res.status(200).send(activities);
    })
    .catch(
      error => res.status(400).send(error)
  );

})
.get('/:calendarId/:activityId', (req, res, next) => {
  return Activity
  .find(
    {
      where: {
        'Calendar.id$': req.params.calendarId,
        id: req.params.activityId
      },
      include: {model: Calendar, required: true }
    }
  )
  .then(activity => {
    if(!activity) {
      return res.status(404).send({message: 'Activity no found'})
    }
    res.status(200).send(activity);
  })
  .catch(error => res.status(400).send(error));
})
.post('/:calendarId', (req, res, next) => {
  return Activity
  .create({
    repeat: req.body.repeat,
    activity_date: req.body.activity_date,
    activity_day: req.body.activity_day,
    activity_time: req.body.activity_time,
    activity_type: req.body.activity_type,
    isActive: true,
    description: req.body.description,
    calendar_id: req.params.calendarId
  })
  .then((activity) =>
    res.status(201).send(activity)
  )
  .catch((error) => res.status(400).send(error));
})
.patch('/:activityId', (req, res, hext) => {
  return Activity
    .findById(req.params.activityId)
    .then( activity => {
      return activity
      .update(
        {
          repeat: req.body.repeat,
          activity_date: req.body.activity_date,
          activity_day: req.body.activity_day,
          activity_time: req.body.activity_time,
          activity_type: req.body.activity_type,
          isActive: true,
          description: req.body.description,
        })
      .then(
        () => res.status(200).send(activity)
      )
      .catch(
        (error) => res.status(400).send(error)
      );
  })
});

module.exports = router;
