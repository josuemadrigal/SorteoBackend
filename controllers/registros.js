const { response } = require("express");

var { connection, sequelize, query } = require("../database/database");
//const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const TbMadres = require("../models/Tb_madres");
const TbPadres = require("../models/Tb_padres");
const TbPremios = require("../models/Tb_premios"); // Corrected the import
const TbCedulas = require("../models/Tb_cedulas");
const TbTemporal = require("../models/Tb_temporal");
const TbRondas = require("../models/Tb_rondas");

const crearRegistro = async (req, res) => {
  const { municipio, nombre, cedula, status, premio, boleto, telefono } =
    req.body;

  try {
    const registroExistente = await TbPadres.findOne({
      where: { cedula },
    });

    // const boletoExistente = await TbPadres.findOne({
    //   where: { boleto },
    // });

    if (registroExistente) {
      return res.status(203).json({
        ok: false,
        msg: "ERROR: Esta cedula ha sido registrada",
        registroExistente,
      });
    }

    // if (boletoExistente) {
    //   return res.status(206).json({
    //     ok: false,
    //     msg: "ERROR: Esta boleta ha sido registrada",
    //     registroExistente,
    //   });
    // }

    // const nuevaCedula = await TbCedulas.create({
    //   nombre,
    //   cedula,
    // });

    const nuevoRegistro = await TbPadres.create({
      municipio,
      nombre,
      cedula,
      status,
      premio,
      boleto: "N/A",
      telefono,
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
      `SELECT * FROM tb_padres WHERE status=:status AND municipio=:municipio ORDER BY RAND() LIMIT 0,:cantidad`,
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

const getRegistrosAll = async (req, res = response) => {
  try {
    const registros = await sequelize.query(`SELECT * FROM tb_padres`, {
      type: sequelize.QueryTypes.SELECT,
    });

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

const getRegistrosCountByMunicipio = async (req, res = response) => {
  try {
    const registros = await sequelize.query(
      `SELECT municipio, COUNT(*) as count FROM tb_padres GROUP BY municipio`,
      {
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
      msg: "Error al obtener el conteo de registros por municipio",
      error: error.message,
    });
  }
};

const getRegistrosCountByMunicipioActivo = async (req, res = response) => {
  try {
    const registros = await sequelize.query(
      `SELECT municipio, COUNT(*) as count FROM tb_padres WHERE status="2"  GROUP BY municipio`,
      {
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
      msg: "Error al obtener el conteo de registros por municipio",
      error: error.message,
    });
  }
};

const actualizarRegistros = async (req, res = response) => {
  const { status, premio, ronda } = req.body;
  const { cedula } = req.params;

  try {
    const [updated] = await TbPadres.update(
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
    const [participacion] = await sequelize.query(
      `SELECT * FROM tb_padres WHERE cedula = :cedula`,
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

const activarParticipante = async (req, res = response) => {
  const { cedula } = req.query;

  if (!cedula) {
    return res.status(400).json({
      ok: false,
      msg: "La cédula es requerida",
    });
  }

  try {
    const [participante] = await sequelize.query(
      `SELECT * FROM tb_padres WHERE cedula = :cedula`,
      {
        replacements: { cedula },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Si no existe el participante
    if (!participante) {
      return res.json({
        ok: false,
        msg: "Cédula no está participando",
      });
    }

    // Si existe pero ya tiene status 2
    if (participante.status == "2") {
      return res.json({
        ok: true,
        msg: "Cédula ya ha sido activada",
        participante,
      });
    }

    // Si existe y tiene status 1, actualizamos a status 2
    if (participante.status == "1") {
      await sequelize.query(
        `UPDATE tb_padres SET status = "2" WHERE cedula = :cedula`,
        {
          replacements: { cedula },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      // Obtenemos los datos actualizados
      // const [participanteActualizado] = await sequelize.query(
      //   `SELECT * FROM tb_padres WHERE cedula = :cedula`,
      //   {
      //     replacements: { cedula },
      //     type: sequelize.QueryTypes.SELECT,
      //   }
      // );

      return res.json({
        ok: true,
        msg: "Cédula activada",
        participante: participante.nombre,
      });
    }

    // Para cualquier otro status
    return res.json({
      ok: false,
      msg: `Cédula con status inválido: ${participante.status}`,
      participante,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al procesar la solicitud",
      error: error.message,
    });
  }
};

const activarParticipanteByMunicipio = async (req, res = response) => {
  const { cedula, municipio } = req.query;

  if (!cedula) {
    return res.status(400).json({
      ok: false,
      msg: "La cédula es requerida",
    });
  }

  if (!municipio) {
    return res.status(400).json({
      ok: false,
      msg: "El municipio es requerido",
    });
  }

  try {
    const [participante] = await sequelize.query(
      `SELECT * FROM tb_padres WHERE cedula = :cedula`,
      {
        replacements: { cedula },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Si no existe el participante
    if (!participante) {
      return res.json({
        ok: false,
        msg: "Cédula no está participando",
      });
    }

    if (participante.municipio != municipio) {
      return res.json({
        ok: false,
        msg: `Participante registrado en ${participante.municipio}`,
      });
    }

    // Si existe pero ya tiene status 2
    if (participante.status == "2") {
      return res.json({
        ok: true,
        msg: "Cédula ya ha sido activada",
        participante,
      });
    }

    // Si existe y tiene status 1, actualizamos a status 2
    if (participante.status == "1") {
      await sequelize.query(
        `UPDATE tb_padres SET status = "2" WHERE cedula = :cedula`,
        {
          replacements: { cedula },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      // Obtenemos los datos actualizados
      // const [participanteActualizado] = await sequelize.query(
      //   `SELECT * FROM tb_padres WHERE cedula = :cedula`,
      //   {
      //     replacements: { cedula },
      //     type: sequelize.QueryTypes.SELECT,
      //   }
      // );

      return res.json({
        ok: true,
        msg: "Cédula activada",
        participante: participante.nombre,
      });
    }

    // Para cualquier otro status
    return res.json({
      ok: false,
      msg: `Cédula con status inválido: ${participante.status}`,
      participante,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al procesar la solicitud",
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

const getRegistrosList = async (req, res = response) => {
  const { municipio, ronda, premio } = req.query;

  try {
    const registros = await sequelize.query(
      `SELECT * FROM tb_padres WHERE status='3' AND municipio=:municipio AND ronda=:ronda AND premio=:premio `,
      {
        replacements: { municipio, ronda: parseInt(ronda), premio },
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
      msg: "Error al obtener registros ganadores",
      error: error.message,
    });
  }
};

const regRonda = async (req, res) => {
  const { municipio, premio, ronda, cantidad, status } = req.body;

  try {
    const nuevoRegistro = await TbRondas.create({
      municipio,
      premio,
      ronda,
      cantidad,
      status,
    });

    res.status(201).json({
      ok: true,
      premio: nuevoRegistro,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Esta ronda ha sido registrada",
      error: error.message,
    });
  }
};

const getRonda = async (req, res = response) => {
  const { municipio, premio } = req.query;

  try {
    const ronda = await sequelize.query(
      `SELECT * FROM tb_rondas WHERE status='activa' AND municipio=:municipio AND premio=:premio ORDER BY ronda LIMIT 1`,
      {
        replacements: { municipio, premio },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      ok: true,
      ronda: ronda,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las rondas",
      error: error.message,
    });
  }
};

const getRondaNum = async (req, res = response) => {
  const { municipio, premio } = req.query;

  try {
    const ronda = await sequelize.query(
      `SELECT ronda FROM tb_rondas WHERE status='activa' AND municipio=:municipio AND premio=:premio ORDER BY ronda desc LIMIT 1`,
      {
        replacements: { municipio, premio },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log(ronda);
    res.json({
      ok: true,
      ronda: ronda,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las rondas",
      error: error.message,
    });
  }
};

const updateRonda = async (req, res = response) => {
  const { estado, municipio, ronda, premio } = req.body;
  const { id } = req.params;
  try {
    const [updated] = await TbRondas.update(
      { status: estado },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No existe la ronda",
      });
    }
    res.json({
      ok: true,
      msg: "Ronda desactivada correctamente",
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

const getRegistroByCedula = async (req, res = response) => {
  const { status, cedula } = req.query;

  try {
    const registros = await sequelize.query(
      `SELECT * FROM tb_padres WHERE (status=:status OR status=4) AND cedula=:cedula`,
      {
        replacements: { status, cedula },
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
      msg: "Error al obtener registros por cedula",
      error: error.message,
    });
  }
};

const actualizarRegistroByCedula = async (req, res = response) => {
  const { coment, status } = req.body;
  const { cedula } = req.params;
  try {
    const [updated] = await TbPadres.update(
      { coment: coment, status: status },
      { where: { cedula } }
    );

    if (updated === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Registro no existe con esta cedula",
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

module.exports = {
  getRegistros,
  getRegistroByCedula,
  getCedula,
  getPremios,
  getParticipando,
  getRegistrosList,
  getRonda,
  getRondaNum,
  crearRegistro,
  crearTemporal,
  regRonda,
  actualizarRegistros,
  actualizarRegistroByCedula,
  updateRonda,
  regPremio,
  regCedula,
  getRegistrosAll,
  getRegistrosCountByMunicipio,
  getRegistrosCountByMunicipioActivo,
  activarParticipante,
  activarParticipanteByMunicipio,
};
