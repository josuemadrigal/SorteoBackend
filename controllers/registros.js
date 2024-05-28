const { response } = require("express");

var { connection, sequelize, query } = require("../database/database");
//const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const TbMadres = require("../models/Tb_madres");
const TbPremios = require("../models/Tb_premios"); // Corrected the import
const TbCedulas = require("../models/Tb_cedulas");
const TbTemporal = require("../models/Tb_temporal");

const crearRegistro = async (req, res) => {
  const { municipio, nombre, cedula, status, premio } = req.body;

  try {
    const registroExistente = await TbMadres.findOne({ where: { cedula } });

    if (registroExistente) {
      return res.status(203).json({
        ok: false,
        msg: "ERROR: Esta boleta ha sido registrada",
        registroExistente,
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
      registro: nuevoRegistro,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al crear el registro",
      error: error.message,
    });
  }
};

const crearTemporal = async (req, res) => {
  const { municipio, nombre, cedula, status, premio } = req.body;

  try {
    const nuevoRegistroTemporal = await TbTemporal.create({
      municipio,
      nombre,
      cedula,
      status,
      premio,
    });

    res.status(201).json({
      ok: true,
      registro: nuevoRegistroTemporal,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al crear el registro temporal",
      error: error.message,
    });
  }
};

const getRegistros = async (req, res = response) => {
  const { status, municipio, cantidad } = req.query;

  try {
    const registros = await sequelize.query(
      `SELECT * FROM tb_madres WHERE status=:status AND municipio=:municipio ORDER BY RAND() LIMIT 0,:cantidad`,
      {
        replacements: { status, municipio, cantidad: parseInt(cantidad) },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      ok: true,
      registros,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener registros",
      error: error.message,
    });
  }
};

const actualizarRegistros = async (req, res = response) => {
  const { status, premio, ronda } = req.body;
  const { cedula } = req.params;

  try {
    const [updated] = await TbMadres.update(
      { status, premio, ronda },
      { where: { cedula } }
    );

    if (updated === 0) {
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
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el registro",
      error: error.message,
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
      premio: nuevoRegistro,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al registrar premio",
      error: error.message,
    });
  }
};

const regCedula = async (req, res) => {
  const { nombre, cedula, status } = req.body;

  try {
    const registroExistente = await TbCedulas.findOne({ where: { cedula } });

    if (registroExistente) {
      return res.status(203).json({
        ok: false,
        msg: "ERROR: Esta cedula exite en la base de datos",
      });
    }

    const nuevoRegistro = await TbCedulas.create({
      nombre,
      cedula,
      status,
    });

    res.status(201).json({
      ok: true,
      cedula: nuevoRegistro,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al registrar cedula",
      error: error.message,
    });
  }
};

const getCedula = async (req, res = response) => {
  const { cedula } = req.query;

  if (!cedula) {
    return res.status(400).json({
      ok: false,
      msg: "La cédula es requerida",
    });
  }

  try {
    const [registro] = await sequelize.query(
      `SELECT * FROM tb_cedulas WHERE cedula = :cedula`,
      {
        replacements: { cedula },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!registro) {
      return res.json({
        ok: false,
        msg: "No se encontró un registro con esa cédula",
      });
    }

    res.json({
      ok: true,
      registro,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener registros",
      error: error.message,
    });
  }
};
const getParticipando = async (req, res = response) => {
  const { cedula } = req.query;

  if (!cedula) {
    return res.status(400).json({
      ok: false,
      msg: "La cédula es requerida",
    });
  }

  try {
    // const [registro] = await sequelize.query(
    //   `SELECT cedula FROM tb_madres WHERE cedula = :cedula`,
    //   {
    //     replacements: { cedula },
    //     type: sequelize.QueryTypes.SELECT,
    //   }
    // );

    // if (!registro) {
    //   return res.status(404).json({
    //     ok: false,
    //     msg: "No se encontró participando esa cédula",
    //   });
    // }

    const [participacion] = await sequelize.query(
      `SELECT * FROM tb_madres WHERE cedula = :cedula`,
      {
        replacements: { cedula },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (participacion) {
      return res.json({
        ok: true,
        participando: true,
        msg: "Esta cédula ya está participando",
        participacion,
      });
    } else {
      return res.json({
        ok: true,
        participando: false,
        msg: "Esta cédula no está participando",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener registros",
      error: error.message,
    });
  }
};

const getPremios = async (req, res = response) => {
  try {
    const [premios] = await sequelize.query(
      "SELECT * FROM tb_premios WHERE status = 1"
    );

    if (premios.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay premios disponibles",
      });
    }

    res.json({
      ok: true,
      premios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener premios",
      error: error.message,
    });
  }
};

// const getCedula = async (req, res = response) => {
//   const { cedula } = req.query;

//   try {
//     const registros = await sequelize.query(
//       `SELECT * FROM tb_cedulas WHERE cedula=:cedula`,
//       {
//         replacements: { cedula },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     res.json({
//       ok: true,
//       registros,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       ok: false,
//       msg: "Error al obtener registros",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  getRegistros,
  getCedula,
  getPremios,
  getParticipando,
  crearRegistro,
  crearTemporal,
  actualizarRegistros,
  regPremio,
  regCedula,
};
