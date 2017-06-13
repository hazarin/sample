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
    let from = new Date(2016, 1, 1);
    let to = new Date(2020, 1, 30);


    return queryInterface.sequelize.query("" +
        "SELECT ADDDATE(:from, INTERVAL @i:=@i+1 DAY) AS dt " +
        "FROM (" +
        "       SELECT a.a" +
        "       FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a " +
        "         CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b " +
        "         CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c " +
        "     ) a " +
        "  JOIN (SELECT @i := -1) r1 " +
        "" +
        "WHERE " +
        "@i < DATEDIFF(:to, :from)",
        { replacements: {from: from, to: to}, type: Sequelize.QueryTypes.SELECT})
    .then(dates => {
      return queryInterface.bulkInsert('Dates', dates);
    }).catch(err => {console.log(err)});



  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
