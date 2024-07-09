// models/Tb_premios.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database"); // Adjust the path

const userMysql = sequelize.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.STRING,
    },

    password: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = userMysql;
