const mongoose = require('mongoose');
const dbConnection = async () => {

    try {
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        });


        console.log('DB Online');

    } catch (error){
        console.log(error);
        throw new Error('Error al iniciar BD');
    }
}

module.exports = {
    dbConnection
}