/**
 * Created by hazarin on 21.05.17.
 */
const express = require('express')
const router = express.Router()
const models = require('../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET User. */
router
.get('/:userId', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  return models.User.find({where: {id: req.params.userId}}).then(user => {
    if (!user) {
      return res.status(404).send({message: 'User no found'})
    }
    return res.status(200).send({
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
  })
  .catch(err => {
    return res.status(400).send(err)
  })

})
.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let User = res.locals.User

    return User.find({where: {id: req.user.id}}).then(user => {
      if (!user) {
        return res.status(404).send({message: 'User no found'})
      }
      res.status(200).send({
        id: user.id,
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
    })
    .catch(err => res.status(400).send(err))
})
.post('/login', (req, res, next) => {
  let passport = res.locals.passport;
  let jwtOptions = res.locals.app.get('jwtOptions');

  return passport.authenticate('local', { session: false },
    (err, user, info) => {
      return err
        ? res.status(400).send(err)
        : user
          ? req.logIn(user, (err) => {
            if (err) {
              return res.status(400).send(err)
            }
            let payload = {id: user.id};
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            return res.status(200).send({message: "ok", token: token});
          })
          : res.status(400).send(info);
    })(req, res, next);
});

module.exports = router;
