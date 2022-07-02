const Sequelize = require('sequelize');
const dotenv = require('dotenv');

//to get config vars
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST
});

module.exports = sequelize;
