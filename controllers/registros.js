const { response } = require("express");

var { connection, sequelize, query } = require("../database/database");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const TbMadres = require("../models/Tb_madres");
const TbPremios = require("../models/Tb_premios"); // Corrected the import

const getRegistros = async (req, res = response) => {
  try {
    const registros = await sequelize.query(`
      SELECT * FROM tb_madres 
      WHERE status=${req.query.status} AND municipio='${req.query.municipio}' 
      ORDER BY RAND() LIMIT 0,${req.query.cantidad}
    `);

    res.json({
      ok: true,
      registros: registros[0], // Los resultados se encuentran en el índice 0 del array
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener registros",
    });
  }
};

const crearRegistro = async (req, res) => {
  const { municipio, nombre, cedula, status, premio } = req.body;

  try {
    const registroExistente = await TbMadres.findOne({ where: { cedula } });

    if (registroExistente) {
      return res.status(203).json({
        ok: false,
        msg: "ERROR: Esta boleta ha sido registrada",
      });
    }

    const nuevoRegistro = await TbMadres.create({
      municipio,
      nombre,
      cedula,
      status,
      premio,
    });

    res.status(201).json({
      ok: true,
      municipio: nuevoRegistro.municipio,
      nombre: nuevoRegistro.nombre,
      cedula: nuevoRegistro.cedula,
      status: nuevoRegistro.status,
      premio: nuevoRegistro.premio,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al crear el registro",
      error: error.message,
    });
  }
};

const actualizarRegistros = async (req, res = response) => {
  const { status, premio } = req.body;

  try {
    const registroActualizado = await TbMadres.update(
      { status, premio },
      { where: { id: req.params.id } }
    );

    if (registroActualizado[0] === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Registro no existe por ID",
      });
    }

    res.json({
      ok: true,
      msg: "Registro actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: JSON.stringify(error),
    });
  }
};
const regPremio = async (req, res) => {
  const {
    premio,
    la_romana,
    villa_hermosa,
    caleta,
    cumayasa,
    guaymate,
    slug_premio,
    status,
  } = req.body;

  try {
    const registroExistente = await TbPremios.findOne({ where: { premio } });

    if (registroExistente) {
      return res.status(203).json({
        ok: false,
        msg: "ERROR: Este premio ha sido registrado",
      });
    }

    const nuevoRegistro = await TbPremios.create({
      premio,
      la_romana,
      villa_hermosa,
      caleta,
      cumayasa,
      guaymate,
      slug_premio,
      status,
    });

    res.status(201).json({
      ok: true,
      premio: nuevoRegistro.premio,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al crear el registro",
      error: error.message,
    });
  }
};

module.exports = {
  getRegistros,
  crearRegistro,
  actualizarRegistros,
  regPremio,
};
