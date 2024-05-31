const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getRegistros,
  crearRegistro,
  actualizarRegistros,
  updateRonda,
  regPremio,
  regCedula,
  getCedula,
  getPremios,
  getParticipando,
  getRegistrosList,
  getRonda,
  crearTemporal,
} = require("../controllers/registros");

const router = Router();

// Validaciones comunes
const validarCedula = check(
  "cedula",
  "La cedula es necesaria y debe tener un formato válido"
)
  .isString()
  .not()
  .isEmpty();
const validarPremio = check("premio", "El premio es necesario").not().isEmpty();
const validarCantidadMayorCero = (campo) =>
  check(
    campo,
    `La cantidad de ${campo.replace("_", " ")} debe ser un número y mayor que 0`
  ).isInt({ min: 1 });

// Obtener registros
router.get("/", getRegistros);
router.get("/getGanadores", getRegistrosList);
router.get("/cedula", getCedula);
router.get("/getPremios", getPremios);
router.get("/getParticipando", getParticipando);
router.get("/getRonda", getRonda);

// Crear un nuevo registro
router.post(
  "/",
  [
    check("municipio", "El municipio es necesario").not().isEmpty(),
    check("nombre", "El nombre es necesario").not().isEmpty(),
    validarCedula,
    check("status", "El status es necesario y debe ser un número").isNumeric(),
    validarPremio,
    validarCampos,
  ],
  crearRegistro
);

// Crear un nuevo registro Temporal
router.post(
  "/temporal",
  [
    check("municipio", "El municipio es necesario").not().isEmpty(),
    check("nombre", "El nombre es necesario").not().isEmpty(),
    validarCedula,
    check("status", "El status es necesario y debe ser un número").isNumeric(),
    validarPremio,
    validarCampos,
  ],
  crearTemporal
);

// Registrar un premio
router.post(
  "/regPremio",
  [
    validarPremio,
    validarCantidadMayorCero("la_romana"),
    validarCantidadMayorCero("villa_hermosa"),
    // validarCantidadMayorCero("caleta"),
    // validarCantidadMayorCero("cumayasa"),
    validarCantidadMayorCero("guaymate"),
    validarCampos,
  ],
  regPremio
);

// Registrar una cédula
router.post("/regCedula", [validarCedula, validarCampos], regCedula);

// Actualizar un registro
router.put(
  "/:cedula",
  [
    check("cedula", "El ID debe ser un número válido").not().isEmpty(),
    check(
      "status",
      "El status es necesario111y debe ser un número"
    ).isNumeric(),
    validarPremio,
    validarCampos,
  ],
  actualizarRegistros
);

router.put(
  "/updateRonda/:id",
  [
    check("estado", "El status es obligatorio").not().isEmpty(),
    check("municipio", "El municipio es obligatorio").not().isEmpty(),
    check("ronda", "La ronda es obligatoria").not().isEmpty(),
    check("premio", "El premio es obligatoria").not().isEmpty(),
  ],
  updateRonda
);

module.exports = router;

// const { Router } = require("express");
// const { validarCampos } = require("../middlewares/validar-campos");
// const { check } = require("express-validator");

// const {
//   getRegistros,
//   crearRegistro,
//   actualizarRegistros,
//   regPremio,
//   regCedula,
// } = require("../controllers/registros");

// const router = Router();

// //Obtener
// router.get("/", getRegistros);

// //Crear eventos
// router.post(
//   "/",
//   [check("cedula", "La cedula es necesaria").not().isEmpty(), validarCampos],
//   crearRegistro
// );

// router.post(
//   "/regPremio",
//   [check("premio", "El premio es necesario").not().isEmpty(), validarCampos],
//   regPremio
// );

// router.post(
//   "/regCedula",
//   [check("cedula", "La cedula es necesaria").not().isEmpty(), validarCampos],
//   regCedula
// );

// //actualizar
// router.put("/:id", actualizarRegistros);

// module.exports = router;
