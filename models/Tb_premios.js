// models/Tb_premios.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database"); // Adjust the path

const TbPremios = sequelize.define(
  "tb_premios",
  {
    premio: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    la_romana: {
      type: DataTypes.STRING,
    },
    villa_hermosa: {
      type: DataTypes.STRING,
    },
    caleta: {
      type: DataTypes.STRING,
    },
    cumayasa: {
      type: DataTypes.STRING,
    },
    guaymate: {
      type: DataTypes.STRING,
    },
    slug_premio: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

module.exports = TbPremios;
