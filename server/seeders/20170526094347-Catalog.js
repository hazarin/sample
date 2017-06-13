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
    return queryInterface.bulkInsert('Catalogs', [
      {
        title: 'A day clock time',
        short_description: 'Small description for the feature',
        description: 'Very detailed description, Very detailed description, Very detailed description, Very detailed description,',
        icon: 'fa-clock-o',
        price: 33.99,
        type: 'membership',
        membership: 'time',
        createdAt: '2016-03-31T08:00:10.354Z',
        updatedAt: '2016-03-31T08:00:10.354Z',
      },
      {
        title: 'A day clock calendar',
        short_description: 'Small description for the feature',
        description: 'Very detailed description, Very detailed description, Very detailed description, Very detailed description,',
        icon: 'fa-calendar-check-o',
        price: 33.99,
        type: 'membership',
        membership: 'calendar',
        createdAt: '2016-03-31T08:00:10.354Z',
        updatedAt: '2016-03-31T08:00:10.354Z',
      },
      {
        title: 'A day clock PRO',
        short_description: 'Small description for the feature',
        description: 'Very detailed description, Very detailed description, Very detailed description, Very detailed description,',
        icon: 'fa-star',
        price: 33.99,
        type: 'membership',
        membership: 'pro',
        createdAt: '2016-03-31T08:00:10.354Z',
        updatedAt: '2016-03-31T08:00:10.354Z',
      },], {})
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
