const  Sequelize  = require('sequelize');

const sequelize = require('../util/database');

const Customcheckout = sequelize.define('customcheckout',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = Customcheckout;