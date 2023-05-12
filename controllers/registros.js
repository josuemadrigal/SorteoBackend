const { model } = require('mongoose');
const {router} = require('../routes/registros');
const {response} = require('express');
const Registro = require('../models/Registro');

 
const getRegistros = async (req, res = response) => {
    //console.log({"params":req.query})
    
    const registros = await Registro.find({status: req.query.status, municipio: req.query.municipio}).limit(req.query.cantidad);

    res.json({
        ok: true,
        registros
    })
}

const crearRegistro = async(req, res = response) => {

    const {email, cedula, telefono, boleta} = req.body;

    try {

        let registro = await Registro.findOne({ cedula, email, telefono, boleta })

    

        if (registro) {

            return res.status(400).json({
                ok:false,
                msg: 'existe registro con esa cedula o telefono'
            });
        }

    
       
        registro = new Registro(req.body);

        await registro.save();
    
       return res.status(201).json({
            ok: true,
            cedula: registro.cedula,
            boleta: registro.boleta,
            status: registro.status
        });
        
    } catch (error) {

         res.status(500).json({
            ok: false,
            msg: 'Habla con el Admin :'+ JSON.stringify(error),
        })

      
    }
}

const actuzalizarRegistros = async (req, res = response) => {

    const boletaId = req.params.id;
    const status = req.body.status;
    try {
        const registro = await Registro.find({boleta : boletaId})
        
        console.log(boletaId)
        if (!registro) {
            return res.status(404).json({
                ok: false,
                msg: 'Registro no existe por ID'
            });      
        }
        console.log({"Registro":registro})
        // registro[0].status = status;
        const nuevoRegistro = {
            status: status
        }

        const registroActualizado = await Registro.findOneAndUpdate({boleta: registro[0].boleta}, nuevoRegistro, { new: true} );

        res.json({
            ok: true,
            registro: registroActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con Josué: ' + JSON.stringify(error)
        });
    }
}


module.exports = {
    getRegistros,
    crearRegistro,
    actuzalizarRegistros

}