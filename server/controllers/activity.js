/**
 * Created by hazarin on 23.05.17.
 */
const express = require('express');
const router = express.Router();
const models = require('../models');
const passport = require('passport');

/* Activity api */
router
.get('/:calendarId', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
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
    from = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0);
    to = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 0, 0, 0);

    let query = `
      SELECT dt.dt, ac.* FROM Dates as dt
      LEFT JOIN (
        SELECT * FROM Activities WHERE ((activity_date <= :dt_to AND \`repeat\` != 'not')
                                       OR (activity_date >= :dt_from AND :dt_to >= activity_date)) 
                                       AND (calendar_id = :calendar_id)
              ) as ac ON (
            CASE ac.repeat
              WHEN 'not' THEN ac.activity_date
              WHEN 'day'
              THEN
                DATE_ADD(ac.activity_date, INTERVAL IF(DATEDIFF(dt.dt, ac.activity_date) >= 0, DATEDIFF(dt.dt, ac.activity_date), 0) DAY)
              WHEN 'week'
              THEN
                DATE_ADD(ac.activity_date, INTERVAL IF(DATEDIFF(dt.dt, ac.activity_date) >= 0 AND DATEDIFF(dt.dt, ac.activity_date) MOD 7 = 0, DATEDIFF(dt.dt, ac.activity_date), 0) DAY)
              WHEN 'month'
              THEN
                DATE_ADD(ac.activity_date, INTERVAL IF(DATEDIFF(dt.dt, ac.activity_date)>=0 AND DAY(dt.dt)=DAY(ac.activity_date), DATEDIFF(dt.dt, ac.activity_date), 0) DAY)
            END
          )=dt.dt
     WHERE
      dt.dt >= :dt_from AND :dt_to >= dt.dt
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
    .catch(err =>
    {
      return res.status(400).send(err)
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
    // .catch(err => {
    //   return res.status(400).send(err);
    // });
  })
  .catch(err => {
    return res.status(400).send(err);
  });
})
.get('/:calendarId/:activityId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
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
.post('/:calendarId', passport.authenticate('jwt', { session: false }), (req, res, next) => {

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
.patch('/:activityId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
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
