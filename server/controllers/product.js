/**
 * Created by hazarin on 21.05.17.
 */
const express = require('express');
const router = express.Router();
const uuid  = require('uuid/v4');
const Product = require('../models').Product;

/* Products api */
router
.get('/:userId',  (req, res, next) => {
  let User = res.locals.User;

  return Product
    .findAll({where: {user_id: req.params.userId}})
    .then(products => {
      if(!products) {
        return res.status(404).send({message: 'User no found'})
      }
      res.status(200).send();
    })
    .catch(error => res.status(400).send(error));

})
.get('/:userId/:productId', (req, res, next) => {
  return Product
  .find({where: {user_id: req.params.userId}})
  .then(product => {
    if(!product) {
      return res.status(404).send({message: 'Product no found'})
    }
    res.status(200).send(product);
  })
  .catch(error => res.status(400).send(error));
})
.post('/', (req, res, next) => {
  let serial = uuid();
  return Product
  .create({
    serial: serial,
    title: req.body.title,
  })
  .then((product) =>
    res.status(201).send(product)
  )
  .catch((error) => res.status(400).send(error));
})
.patch('/:userId/:productId', (req, res, hext) => {
  return Product
    .findById(req.params.productId)
    .then( product => {
      return product
      .update({title: req.body.title})
      .then(
        () => res.status(200).send(product)
      )
      .catch(
        (error) => res.status(400).send(error)
      );
  })
});

module.exports = router;
