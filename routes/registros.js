const {Router} = require('express'); 
const {validarCampos} = require('../middlewares/validar-campos'); 
const {check} = require('express-validator'); 

const {getRegistros, crearRegistro, actuzalizarRegistros, getResponsables } = require('../controllers/registros');

const router = Router();

//Obtener
router.get('/', getRegistros );

//Crear eventos
router.post(
    '/', 
    [
        check('nombre','El Nombre es obligado').not().isEmpty(),
        check('cedula','La Cedula es necesaria').not().isEmpty(),
        check('telefono','El telefono es necesario').not().isEmpty(),
        check('boleta','La boleta es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearRegistro 
);
//actualizar
router.put('/:id', actuzalizarRegistros );
router.get('/all', getResponsables );

module.exports = router;
