const { response } = require("express");

var { connection, sequelize, query } = require("../database/database");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const Regmujer = require("../models/Regmujer");

const getRegistros = async (req, res = response) => {
  try {
    const registros = await sequelize.query(`
      SELECT * FROM regmujers 
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
  const { municipio, boleta, status, premio } = req.body;

  try {
    // Verificar si la boleta ya existe en la base de datos
    const registroExistente = await Regmujer.findOne({ where: { boleta } });

    if (registroExistente) {
      return res.status(203).json({
        ok: false,
        msg: "ERROR: Esta boleta ha sido registrada",
      });
    }

    // Crear un nuevo registro si la boleta no existe
    const nuevoRegistro = await Regmujer.create({
      municipio,
      boleta,
      status: 1,
      premio,
    });

    res.status(201).json({
      ok: true,
      boleta: nuevoRegistro.boleta,
      status: nuevoRegistro.status,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al crear el registro",
      error: error.message,
    });
  }
};

const actuzalizarRegistros = async (req, res = response) => {
  // const boletaId = req.params.id;
  // const status = req.body.status;
  // const premio = req.body.premio;
  const { boleta, status, premio } = req.body;

  console.log(req.params.id);
  try {
    const registroActualizado = await Regmujer.update(
      { status: status, premio: premio },
      { where: { boleta: req.params.id } }
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

module.exports = {
  getRegistros,
  crearRegistro,
  actuzalizarRegistros,
};
