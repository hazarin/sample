const models = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
     Add altering commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.bulkInsert('Person', [{
     name: 'John Doe',
     isBetaMember: false
     }], {});
     */
    return queryInterface.sequelize.transaction((t) => {
        let migrations = [];
        // let models = Sequelize.db.models;

        migrations.push(models.Catalog
        .findOne({where: {membership: 'time'}})
        .then(item => {
          item.update({
                  title: 'Basic clock',
                  short_description: 'Small description for the feature',
                  description: 'the time, day, period of the day, date,\n' +
                  'season and local weather,\n' +
                  'different clock styles,\n' +
                  'option to use own pictures as background',
                  icon: 'fa-clock-o',
                  price: 10.00,
                  type: 'membership',
                  membership: 'time',
                  createdAt: '2016-03-31T08:00:10.354Z',
                  updatedAt: '2016-03-31T08:00:10.354Z',
          }).then( () => {})
        }));

      migrations.push(models.Catalog
      .findOne({where: {membership: 'calendar'}})
      .then(item => {
        item.update({
          title: 'Online',
          short_description: 'Small description for the feature',
          description: 'the time, day, period of the day, date,\n' +
          'season and local weather,\n' +
          'different clock styles,\n' +
          'option to use own pictures as background,\n' +
          'remotely via the internet from other devices',
          icon: 'fa-calendar-check-o',
          price: 19.95,
          type: 'membership',
          membership: 'calendar',
          createdAt: '2016-03-31T08:00:10.354Z',
          updatedAt: '2016-03-31T08:00:10.354Z',
        }).then( () => {})
      }));

      migrations.push(models.Catalog
      .findOne({where: {membership: 'pro'}})
      .then(item => {
        item.update({
          title: 'Daily Appointment',
          short_description: 'Small description for the feature',
          description: 'the time, day, period of the day, date,\n' +
          'season and local weather,\n' +
          'different clock styles,\n' +
          'option to use own pictures as background,\n' +
          'online calendar control function\n' +
          'Daily Event view option to summarize a day events',
          icon: 'fa-star',
          price: 29.95,
          type: 'membership',
          membership: 'pro',
          createdAt: '2016-03-31T08:00:10.354Z',
          updatedAt: '2016-03-31T08:00:10.354Z',
        }).then( () => {})
      }));

      return Promise.all(migrations);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
     Add reverting commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.bulkDelete('Person', null, {});
     */
  },
}
