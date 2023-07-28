// const { model } = require('mongoose');
//const router = require('../routes/registros');
const { response } = require("express");
// const Registro = require('../models/Registro');
var { connection, query } = require("../database/config");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const getRegistros = async (req, res = response) => {
  // let registros = await query(`
  // SELECT *
  //     FROM registro AS r1 JOIN(SELECT CEIL(RAND() *
  //         (SELECT MAX(id) FROM registro)) AS id)
  // AS r2
  // WHERE r1.id >= r2.id
  // and r1.status = ${req.query.status}
  // and r1.municipio = '${req.query.municipio}'
  // ORDER BY r1.id ASC
  // LIMIT ${req.query.cantidad}
  // `);

  let registros = await query(`
    SELECT * FROM registro WHERE status=${req.query.status}  and municipio='${req.query.municipio}' ORDER BY RAND() LIMIT 0,${req.query.cantidad}
    `);

  res.json({
    ok: true,
    registros,
  });
};

const getResponsables = async (req, res = response) => {
  let responsables = await query(`
    SELECT * FROM responsables ORDER BY name ASC LIMIT 0,500
    `);

  res.json(responsables);
};

const crearRegistro = async (req, res = response) => {
  const {
    email,
    cedula,
    telefono,
    boleta,
    nombre,
    municipio,
    direccion,
    status,
    responsable,
    premio,
    codigo,
  } = req.body;

  try {
    let registro = await query(
      `SELECT * from registro where cedula='${cedula}' OR boleta='${boleta}'`
    ); //await Registro.findOne({ cedula, boleta })
    let uid = uuidv1();
    //console.log("aqui: ++"+registro.length)
    if (registro.length > 0) {
      // return res.status(203).send();
      return res
        .status(203)
        .json({
          ok: false,
          msg: "existe registro con esa cedula o telefono",
        })
        .send();
    }

    let guardar = await query(`INSERT INTO registro (
	 guid
	, nombre
	, cedula
	, email
	, telefono
	, municipio
	, direccion
	, boleta
	, responsable
	, status
	, premio
	, codigo
	)
    VALUES
     ('${uid}','${nombre}',' ${cedula}','${email}','${telefono}','${municipio}','${direccion}','${boleta}','${responsable}',${status},'${premio}','${codigo}')`);

    return res.status(201).json({
      ok: true,
      cedula: registro.cedula,
      boleta: registro.boleta,
      status: registro.status,
    });
  } catch (error) {
    return res
      .status(203)
      .json({
        ok: false,
        msg: "Habla con el Admin :" + JSON.stringify(error),
      })
      .send();
  }
};

const actuzalizarRegistros = async (req, res = response) => {
  // const boletaId = req.params.id;
  // const status = req.body.status;
  // const premio = req.body.premio;
  const {
    email,
    cedula,
    telefono,
    boleta,
    nombre,
    municipio,
    direccion,
    status,
    responsable,
    premio,
    codigo,
  } = req.body;
  try {
    let registro = await query(
      `SELECT * from registro where boleta = ${req.params.id}`
    ); //await Registro.findOne({ cedula, boleta })
    if (registro.length <= 0) {
      return res.status(404).json({
        ok: false,
        msg: "Registro no existe por ID",
      });
    }
    let guardar = await query(`
        UPDATE registro
        SET 
        status = ${status}
        , premio = '${premio}'

        WHERE boleta = ${req.params.id}
        `);

    registro = await query(
      `SELECT * from registro where boleta = ${req.params.id}`
    ); //await Registro.findOne({ cedula, boleta })

    res.json({
      ok: true,
      registro: registro,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con Josué: " + JSON.stringify(error),
    });
  }
};

module.exports = {
  getRegistros,
  crearRegistro,
  actuzalizarRegistros,
  getResponsables,
};
