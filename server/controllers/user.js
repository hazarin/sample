/**
 * Created by hazarin on 21.05.17.
 */
const express = require('express');
const router = express.Router();

/* GET User. */
router.get('/:id',  function(req, res, next) {
  let User = res.locals.User;

  return User
    .find({where: {id: req.params.id}})
    .then(user => {
      if(!user) {
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
        membership: user.membership
      });
    })
    .catch(error => res.status(400).send(error));

});

module.exports = router;
