const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getRegistros,
  crearRegistro,
  actualizarRegistros,
  regPremio,
  regCedula,
  getCedula,
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
router.get("/cedula", getCedula);

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

// Registrar un premio
router.post(
  "/regPremio",
  [
    validarPremio,
    validarCantidadMayorCero("la_romana"),
    validarCantidadMayorCero("villa_hermosa"),
    validarCantidadMayorCero("caleta"),
    validarCantidadMayorCero("cumayasa"),
    validarCantidadMayorCero("guaymate"),
    validarCampos,
  ],
  regPremio
);

// Registrar una cédula
router.post("/regCedula", [validarCedula, validarCampos], regCedula);

// Actualizar un registro
router.put(
  "/:nombre",
  [
    check("nombre", "El ID debe ser un número válido").not().isEmpty(),
    check("status", "El status es necesario y debe ser un número").isNumeric(),
    validarPremio,
    validarCampos,
  ],
  actualizarRegistros
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
