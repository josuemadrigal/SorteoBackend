const {Schema, model} = require('mongoose');

const RegistroSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    cedula: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    telefono: {
        type: Number,
        required: true,
        unique: true
    },
    municipio: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    boleta: {
        type: String,
        requiered: true,
        unique: true
    },
    responsable: {
        type: String,
        requiered: false,
        unique: true
    },
    status: {
        type: Number,
        requiered: true
    }

} );


module.exports = model('Registro', RegistroSchema);