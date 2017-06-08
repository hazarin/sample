/**
 * Created by hazarin on 21.05.17.
 */
const express = require('express');
const router = express.Router();
const uuid  = require('uuid/v4');
const models = require('../models');

/* Products api */
router
.get('/:userId',  (req, res, next) => {

  models.User.findById(req.params.userId)
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User not found'})
    }
    models.Product
    .findAll({where: {user_id: req.params.userId}})
    .then(products => {
      return res.status(200).send(products)
    })
    .catch(err => {
      return res.status(400).send(err)
    });
  })
  .catch(err => {
    return res.status(400).send(err)
  });

})
.get('/:userId/:productId', (req, res, next) => {
  models.User.findById(req.params.userId)
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User not found'})
    }
    models.Product
    .find({where: {
      user_id: req.params.userId,
      id: req.params.productId
    }})
    .then(product => {
      if(product === null) {
        return res.status(404).send({message: 'Product no found'})
      }
      return res.status(200).send(product);
    })
    .catch(err => {
      return res.status(400).send(err)
    });
  })
  .catch(err => {
    return res.status(400).send(err)
  });
})
.post('/', (req, res, next) => {
  let serial = uuid();
  models.Product
  .create({
    serial: serial,
    title: req.body.title,
  })
  .then((product) => {
      return res.status(201).send(product)
  })
  .catch(err => {
    return res.status(400).send(err)
  });
})
.patch('/:userId/:productId', (req, res, hext) => {
  models.User.findById(req.params.userId)
  .then(user => {
    if (user === null) {
      return res.status(404).send({message: 'User not found'})
    }
    models.Product.findOne({
      where: {id: req.params.productId, user_id: req.params.userId}
    })
    .then( product => {
      if(product === null) {
        return res.status(404).send({message: 'Product no found'})
      }
      product
      .update({title: req.body.title})
      .then( product => {
        return res.status(200).send(product)
      })
      .catch(err => {
        return res.status(400).send(err)
      });
    })
    .catch(err => {
      return res.status(400).send(err)
    });
  })
  .catch(err => {
    return res.status(400).send(err)
  });
});

module.exports = router;
