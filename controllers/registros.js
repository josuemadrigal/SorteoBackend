const { response } = require("express");
require("dotenv").config();

var { connection, sequelize, query } = require("../database/database");
//const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const TbMadres = require("../models/Tb_madres");
const TbPadres = require("../models/Tb_padres");
const TbPremios = require("../models/Tb_premios"); // Corrected the import
const TbCedulas = require("../models/Tb_cedulas");
const TbTemporal = require("../models/Tb_temporal");
const TbRondas = require("../models/Tb_rondas");

const botWp = (name, phone, cedula, municipio) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "tu_api_key_secreta_aqui");
  myHeaders.append("Content-Type", "application/json");

  urlImagen = process.env.BOT_IMG_SORTEO;

  const raw = JSON.stringify({
    name: name,
    phone: phone,
    cedula: cedula,
    municipio: municipio,
    imageUrl: "https://app.eduardespiritusanto.com/registrate-aqui-app.jpeg",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  console.log(raw);
  fetch(`${process.env.BOT_URL}/send-message`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
};

const botWinWp = (name, phone, cedula, municipio, slug_premio, premio) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "tu_api_key_secreta_aqui");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: name,
    phone: phone,
    cedula: cedula,
    municipio: municipio,
    slug_premio: slug_premio,
    premio: premio,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${process.env.BOT_URL}/ganador`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
};

const botWpRecordatorio = (name, phone, cedula, municipio) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "tu_api_key_secreta_aqui");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: name,
    phone: phone,
    cedula: cedula,
    municipio: municipio,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  console.log(raw);
  fetch(`${process.env.BOT_URL}/recordatorio`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
};

const crearRegistro = async (req, res) => {
  const { municipio, nombre, cedula, status, premio, boleto, telefono } =
    req.body;

  try {
    const registroExistente = await TbPadres.findOne({
      where: { cedula },
    });

    if (registroExistente) {
      return res.status(203).json({
        ok: false,
        msg: "ERROR: Esta cedula ha sido registrada",
        registroExistente,
      });
    }

    const nuevoRegistro = await TbPadres.create({
      municipio,
      nombre,
      cedula,
      status,
      premio,
      boleto: "N/A",
      telefono: telefono,
    });

    // if (nuevoRegistro.telefono) {
    //   const numeroOriginal = nuevoRegistro.telefono;
    //   const numeroLimpio = numeroOriginal.replace(/\D/g, "");
    //   const numeroConvertido = "1" + numeroLimpio;

    //   await botWp(
    //     nuevoRegistro.nombre,
    //     numeroConvertido,
    //     nuevoRegistro.cedula,
    //     nuevoRegistro.municipio
    //   );
    // }

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

// const postRecordatorio = async (req, res = response) => {
//   const { municipio } = req.body;
//   console.log(municipio);
//   try {
//     const registros = await sequelize.query(
//       `SELECT * FROM tb_padres WHERE municipio='${municipio}'`,
//       {
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );
//     if (registros.length === 0) {
//       return res.status(404).json({
//         ok: false,
//         msg: "No hay registros para este municipio",
//       });
//     }

//     for (let i = 0; i < registros.length; i++) {
//       let numeroConvertido;

//       if (registros[i].telefono) {
//         const numeroOriginal = registros[i].telefono;
//         const numeroLimpio = numeroOriginal.replace(/\D/g, "");
//         numeroConvertido = "1" + numeroLimpio;
//       }
//       botWpRecordatorio(
//         registros[i].nombre,
//         numeroConvertido,
//         registros[i].cedula,
//         municipio
//       );
//     }

//     res.json({
//       ok: true,
//       registros,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       ok: false,
//       msg: "Error al obtener el conteo de registros por municipio",
//       error: error.message,
//     });
//   }
// };

const postRecordatorio = async (req, res = response) => {
  const { municipio } = req.body;
  console.log(`Iniciando recordatorios para municipio: ${municipio}`);

  try {
    // 1. Obtener registros (con parámetros seguros)
    const registros = await sequelize.query(
      `SELECT * FROM tb_padres WHERE municipio ='${municipio}'`,
      {
        replacements: { municipio },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (registros.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay registros para este municipio",
      });
    }

    console.log(`Registros a procesar: ${registros.length}`);

    // 2. Configuración de envío
    const config = {
      delayEntreEnvios: 1500, // 1.5 seg entre lotes
      lotesParalelos: 3, // 3 mensajes simultáneos
      reintentosMaximos: 2, // Máximo 2 reintentos
    };

    // 3. Procesamiento optimizado
    const resultados = {
      total: registros.length,
      exitosos: 0,
      fallidos: 0,
      errores: [],
    };

    async function enviarRegistro(registro) {
      let intentos = 0;

      while (intentos <= config.reintentosMaximos) {
        try {
          let numeroConvertido = null;

          if (registro.telefono) {
            const numeroLimpio = registro.telefono.replace(/\D/g, "");
            numeroConvertido = "1" + numeroLimpio;
          }

          await botWpRecordatorio(
            registro.nombre,
            numeroConvertido,
            registro.cedula,
            municipio
          );

          resultados.exitosos++;
          return;
        } catch (error) {
          intentos++;
          if (intentos > config.reintentosMaximos) {
            resultados.fallidos++;
            resultados.errores.push({
              idRegistro: registro.id || registro.cedula,
              error: error.message,
            });
            console.error(
              `Error en registro ${registro.cedula}:`,
              error.message
            );
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000 * intentos));
        }
      }
    }

    // 4. Procesar en lotes controlados
    for (let i = 0; i < registros.length; i += config.lotesParalelos) {
      const loteActual = registros.slice(i, i + config.lotesParalelos);

      await Promise.all(loteActual.map(enviarRegistro));

      // Delay entre lotes
      if (i + config.lotesParalelos < registros.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, config.delayEntreEnvios)
        );
      }

      // Log de progreso
      console.log(
        `Progreso: ${Math.min(i + config.lotesParalelos, registros.length)}/${
          registros.length
        }`
      );
    }

    // 5. Respuesta final
    res.json({
      ok: true,
      resultados: {
        total: resultados.total,
        exitosos: resultados.exitosos,
        fallidos: resultados.fallidos,
        primerosErrores: resultados.errores.slice(0, 5), // Muestra solo 5 errores
      },
      detalles:
        resultados.errores.length > 0
          ? {
              advertencia: "Algunos registros fallaron",
              totalErrores: resultados.errores.length,
            }
          : null,
    });
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el proceso de recordatorios",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Contacte al administrador",
    });
  }
};

const postGanadores = async (req, res = response) => {
  try {
    // 1. Obtener registros
    const registros = await sequelize.query(
      `SELECT * FROM tb_padres WHERE status ='3'`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (registros.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay registros para procesar",
      });
    }

    console.log(`📊 Total de registros a procesar: ${registros.length}`);

    // 2. Configuración optimizada para evitar bloqueos
    const config = {
      // Configuración conservadora para evitar límites de WhatsApp
      mensajesPorLote: 5, // Solo 5 mensajes por lote
      delayEntreLotes: 10000, // 10 segundos entre lotes (más tiempo)
      delayEntreEnvios: 3000, // 3 segundos entre cada mensaje individual
      reintentosMaximos: 3, // Más reintentos
      pausaLargaCada: 50, // Pausa larga cada 50 mensajes
      tiempoPausaLarga: 60000, // 1 minuto de pausa larga

      // Configuración de límites por hora
      maxMensajesPorHora: 200, // Límite conservador por hora
      intervaloMonitoreo: 3600000, // 1 hora en milisegundos
    };

    // 3. Sistema de tracking y control
    const estado = {
      total: registros.length,
      procesados: 0,
      exitosos: 0,
      fallidos: 0,
      errores: [],
      inicioTiempo: Date.now(),
      mensajesEnviadosUltimaHora: 0,
      ultimaHoraReset: Date.now(),
    };

    // 4. Función para verificar límites por hora
    const verificarLimitesHora = () => {
      const ahora = Date.now();
      if (ahora - estado.ultimaHoraReset >= config.intervaloMonitoreo) {
        estado.mensajesEnviadosUltimaHora = 0;
        estado.ultimaHoraReset = ahora;
      }

      return estado.mensajesEnviadosUltimaHora < config.maxMensajesPorHora;
    };

    // 5. Función mejorada para enviar un registro
    async function enviarRegistroConReintentos(registro, indice) {
      let intentos = 0;

      while (intentos <= config.reintentosMaximos) {
        try {
          // Verificar si podemos enviar (límite por hora)
          if (!verificarLimitesHora()) {
            console.log("⏰ Límite por hora alcanzado. Esperando...");
            await new Promise((resolve) => setTimeout(resolve, 60000)); // Esperar 1 minuto
            continue;
          }

          if (registro.telefono) {
            const numeroOriginal = registro.telefono;
            const numeroLimpio = numeroOriginal.replace(/\D/g, "");
            const numeroConvertido = "1" + numeroLimpio;

            console.log(
              `📱 Enviando mensaje ${indice + 1}/${estado.total} a ${
                registro.name
              }`
            );

            await botWinWp(
              registro.name,
              numeroConvertido,
              registro.cedula,
              registro.municipio,
              registro.slug_premio,
              registro.premio
            );

            estado.exitosos++;
            estado.mensajesEnviadosUltimaHora++;

            // Log de progreso cada 10 mensajes
            if ((indice + 1) % 10 === 0) {
              const progreso = (((indice + 1) / estado.total) * 100).toFixed(1);
              const tiempoTranscurrido =
                (Date.now() - estado.inicioTiempo) / 1000;
              const velocidad = ((indice + 1) / tiempoTranscurrido) * 60; // mensajes por minuto

              console.log(
                `📈 Progreso: ${progreso}% (${indice + 1}/${
                  estado.total
                }) - Velocidad: ${velocidad.toFixed(1)} msg/min`
              );
            }

            return true;
          } else {
            console.log(`⚠️ Registro ${registro.cedula} no tiene teléfono`);
            return false;
          }
        } catch (error) {
          intentos++;
          console.error(
            `❌ Error en intento ${intentos} para ${registro.cedula}:`,
            error.message
          );

          if (intentos > config.reintentosMaximos) {
            estado.fallidos++;
            estado.errores.push({
              idRegistro: registro.id || registro.cedula,
              nombre: registro.name,
              telefono: registro.telefono,
              error: error.message,
              intentos: intentos - 1,
            });
            return false;
          }

          // Espera progresiva entre reintentos
          const tiempoEspera = 2000 * intentos * Math.random() + 1000; // 1-6 segundos aleatorio
          await new Promise((resolve) => setTimeout(resolve, tiempoEspera));
        }
      }
    }

    // 6. Procesar registros en lotes controlados
    console.log("🚀 Iniciando envío masivo de mensajes...");

    for (let i = 0; i < registros.length; i += config.mensajesPorLote) {
      const loteActual = registros.slice(i, i + config.mensajesPorLote);

      console.log(
        `📦 Procesando lote ${
          Math.floor(i / config.mensajesPorLote) + 1
        }/${Math.ceil(registros.length / config.mensajesPorLote)}`
      );

      // Enviar mensajes del lote uno por uno (no en paralelo para mayor control)
      for (let j = 0; j < loteActual.length; j++) {
        const registro = loteActual[j];
        const indiceGlobal = i + j;

        await enviarRegistroConReintentos(registro, indiceGlobal);
        estado.procesados++;

        // Pausa entre cada mensaje individual
        if (j < loteActual.length - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, config.delayEntreEnvios)
          );
        }

        // Pausa larga cada cierto número de mensajes
        if (
          (indiceGlobal + 1) % config.pausaLargaCada === 0 &&
          indiceGlobal + 1 < registros.length
        ) {
          console.log(
            `⏸️ Pausa larga (${config.tiempoPausaLarga / 1000}s) después de ${
              indiceGlobal + 1
            } mensajes`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, config.tiempoPausaLarga)
          );
        }
      }

      // Pausa entre lotes
      if (i + config.mensajesPorLote < registros.length) {
        console.log(
          `⏳ Esperando ${
            config.delayEntreLotes / 1000
          }s antes del siguiente lote...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, config.delayEntreLotes)
        );
      }
    }

    // 7. Estadísticas finales
    const tiempoTotalSegundos = (Date.now() - estado.inicioTiempo) / 1000;
    const tiempoTotalMinutos = tiempoTotalSegundos / 60;

    console.log("✅ Proceso completado!");
    console.log(`📊 Estadísticas finales:`);
    console.log(`   - Total procesados: ${estado.procesados}`);
    console.log(`   - Exitosos: ${estado.exitosos}`);
    console.log(`   - Fallidos: ${estado.fallidos}`);
    console.log(`   - Tiempo total: ${tiempoTotalMinutos.toFixed(1)} minutos`);
    console.log(
      `   - Velocidad promedio: ${(
        estado.exitosos / tiempoTotalMinutos
      ).toFixed(1)} mensajes/minuto`
    );

    // 8. Respuesta detallada
    res.json({
      ok: true,
      resultados: {
        total: estado.total,
        procesados: estado.procesados,
        exitosos: estado.exitosos,
        fallidos: estado.fallidos,
        tiempoTotalMinutos: Math.round(tiempoTotalMinutos * 10) / 10,
        velocidadPromedio:
          Math.round((estado.exitosos / tiempoTotalMinutos) * 10) / 10,
        configuracionUsada: {
          mensajesPorLote: config.mensajesPorLote,
          delayEntreLotes: config.delayEntreLotes,
          maxMensajesPorHora: config.maxMensajesPorHora,
        },
      },
      errores:
        estado.errores.length > 0
          ? {
              total: estado.errores.length,
              primeros5: estado.errores.slice(0, 5),
              advertencia: "Revisa los errores para identificar patrones",
            }
          : null,
      recomendaciones: [
        "Monitorea tu cuenta de WhatsApp durante el proceso",
        "Si recibes advertencias, detén el proceso inmediatamente",
        "Considera usar múltiples números de WhatsApp para distribuir la carga",
        "Guarda los registros fallidos para reintentarlo más tarde",
      ],
    });
  } catch (error) {
    console.error("💥 Error general en el proceso:", error);
    res.status(500).json({
      ok: false,
      msg: "Error crítico en el proceso de envío masivo",
      error:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Contacte al administrador del sistema",
      momento: new Date().toISOString(),
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
  const { status, premio, ronda, name, municipio, slug_premio, telefono } =
    req.body;
  const phone = telefono;

  console.log(req.body);
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
    // if (phone) {
    //   const numeroOriginal = phone;
    //   const numeroLimpio = numeroOriginal.replace(/\D/g, "");
    //   const numeroConvertido = "1" + numeroLimpio;
    //   botWinWp(name, numeroConvertido, cedula, municipio, slug_premio, premio);
    // }

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

const getGanadoresMunicipio = async (req, res = response) => {
  const { municipio } = req.query;

  try {
    const registros = await sequelize.query(
      `SELECT * FROM tb_padres WHERE status='3' AND municipio='${municipio}' ORDER BY premio, nombre;`,
      {
        replacements: { municipio },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      ok: true,
      registros: registros,
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
  console.log(municipio);

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
  postRecordatorio,
  getRegistrosCountByMunicipio,
  getRegistrosCountByMunicipioActivo,
  activarParticipante,
  activarParticipanteByMunicipio,
  getGanadoresMunicipio,
  postGanadores,
};
