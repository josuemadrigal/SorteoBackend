// models/Tb_madres.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database"); // Adjust the path

const TbPadres = sequelize.define(
  "tb_padres",
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
    boleto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    coment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    premio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ronda: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

module.exports = TbPadres;
