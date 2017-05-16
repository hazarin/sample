'use strict';
var passportLocalSequelize = require('passport-local-sequelize');

module.exports = function(sequelize, DataTypes) {
  var User = passportLocalSequelize.defineUser(sequelize, {});
  return User;
};