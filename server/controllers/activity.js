/**
 * Created by hazarin on 23.05.17.
 */
const express = require('express');
const router = express.Router();
const models = require('../models');

/* Activity api */
router
.get('/:calendarId',  (req, res, next) => {
  let Calendar = models.Calendar;

  if (req.query.from === undefined || req.query.to === undefined) {
    return res.status(400).send({message: 'Required parameters missing'});
  }

  models.Calendar.findById(req.params.calendarId)
  .then(calendar => {
    if(calendar === null) {
      return res.status(404).send({message: 'Calendar no found'})
    }

    let from = new Date(req.query.from);
    let to = new Date(req.query.to);
    models.Activity
    .findAll(
      {
        where: {
          '$Calendar.id$': req.params.calendarId,
          activity_date: {$between:[from, to]}
        },
        include: {model: Calendar, required: true }
      }
    )
    .then(activities => {
      if(!activities) {
        return res.status(404).send({message: 'Activities no found'})
      }
      return res.status(200).send(activities);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
  })
  .catch(err => {
    return res.status(400).send(err);
  });
})
.get('/:calendarId/:activityId', (req, res, next) => {
  let Calendar = models.Calendar;

  models.Activity
  .findOne(
    {
      where: {
        '$Calendar.id$': req.params.calendarId,
        id: req.params.activityId
      },
      include: {model: Calendar, required: true }
    }
  )
  .then(activity => {
    if(activity === null) {
      return res.status(404).send({message: 'Activity no found'})
    }
    return res.status(200).send(activity);
  })
  .catch(err => {
    return res.status(400).send(err)
  });
})
.post('/:calendarId', (req, res, next) => {

  models.Calendar.findById(req.params.calendarId)
  .then(calendar => {
    if(calendar === null) {
      return res.status(404).send({message: 'Calendar no found'})
    }
    models.Activity
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
    .then(activity => {
        return res.status(201).send(activity);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
  })
  .catch(err => {
    return res.status(400).send(err)
  });
})
.patch('/:activityId', (req, res, next) => {
  models.Activity.findById(req.params.activityId)
  .then(activity => {
    if(activity === null) {
      return res.status(404).send({message: 'Activity no found'});
    }
    activity.update(
      {
        repeat: req.body.repeat,
        activity_date: req.body.activity_date,
        activity_day: req.body.activity_day,
        activity_time: req.body.activity_time,
        activity_type: req.body.activity_type,
        isActive: true,
        description: req.body.description,
    })
    .then(activity => {
      return res.status(200).send(activity);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
  }).catch(err => {
    return res.status(400).send(err);
  });
});

module.exports = router;
