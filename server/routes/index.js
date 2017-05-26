/**
 * Created by hazarin on 21.05.17.
 */
const userCtrl = require('../controllers/user');
const productCtrl = require('../controllers/product');
const calendarCtrl = require('../controllers/calendar');
const activityCtrl = require('../controllers/activity');
const frontCtrl = require('../controllers/front');

module.exports = (app) => {

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the A Daily Clock API!',
  }));

  app.use('/api/user', userCtrl);
  app.use('/api/product', productCtrl);
  app.use('/api/calendar', calendarCtrl);
  app.use('/api/activity', activityCtrl);
  app.use('/api/front', frontCtrl);
}