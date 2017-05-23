/**
 * Created by hazarin on 23.05.17.
 */
const userCtrl = require('../controllers/user');
const productCtrl = require('../controllers/product');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the API!',
  }));

  app.use('/api/user', userCtrl);

  app.use('/api/product', productCtrl);

}