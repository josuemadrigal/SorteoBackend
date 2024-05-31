// models/Tb_premios.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database"); // Adjust the path

const TbRondas = sequelize.define(
  "tb_rondas",
  {
    municipio: {
      type: DataTypes.STRING,
    },
    premio: {
      type: DataTypes.STRING,
    },
    ronda: {
      type: DataTypes.STRING,
    },
    cantidad: {
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

module.exports = TbRondas;
