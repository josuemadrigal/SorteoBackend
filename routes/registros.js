const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator");

const {
  getRegistros,
  crearRegistro,
  actuzalizarRegistros,
} = require("../controllers/registros");

const router = Router();

//Obtener
router.get("/", getRegistros);

//Crear eventos
router.post(
  "/",
  [check("boleta", "La boleta es necesaria").not().isEmpty(), validarCampos],
  crearRegistro
);
//actualizar
router.put("/:id", actuzalizarRegistros);

module.exports = router;
