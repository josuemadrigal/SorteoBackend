const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator");

const {
  getRegistros,
  crearRegistro,
  actualizarRegistros,
  regPremio,
} = require("../controllers/registros");

const router = Router();

//Obtener
router.get("/", getRegistros);

//Crear eventos
router.post(
  "/",
  [check("cedula", "La cedula es necesaria").not().isEmpty(), validarCampos],
  crearRegistro
);

router.post(
  "/regPremio",
  [check("premio", "El premio es necesario").not().isEmpty(), validarCampos],
  regPremio
);

//actualizar
router.put("/:id", actualizarRegistros);

module.exports = router;
