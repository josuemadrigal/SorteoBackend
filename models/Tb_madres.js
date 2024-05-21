// models/Tb_madres.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database"); // Adjust the path

const TbMadres = sequelize.define(
  "tb_madres",
  {
    municipio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    premio: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

module.exports = TbMadres;
