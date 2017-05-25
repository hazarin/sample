/**
 * Created by hazarin on 21.05.17.
 */
const express = require('express')
const router = express.Router()

/* GET User. */
router
.get('/:id', (req, res, next) => {

  return User.find({where: {id: req.params.id}}).then(user => {
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
.get('/', (req, res, next) => {
    let User = res.locals.User

    if (!req.isAuthenticated()) {
      return res.status(401).send({message: 'Authentication requred'});
    }
    return User.find({where: {id: req.user.id}}).then(user => {
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
              : res.status(200).send(user);
          })
          : res.status(400).send(info);
    })(req, res, next);

})

module.exports = router
