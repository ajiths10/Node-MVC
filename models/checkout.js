const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Checkout = sequelize.define("checkout", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Checkout;
