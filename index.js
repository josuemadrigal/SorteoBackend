const express = require('express');
require('dotenv').config();
const cors = require('cors');

const {dbConnection} = require('./database/config');

const app = express();

dbConnection();

app.use(cors());

app.use( express.static('public') );

app.use ( express.json() );

app.use('/api/registros', require('./routes/registros'));

app.listen(process.env.PORT, () => {
    console.log(`Servidor activo puerto: ${process.env.PORT}`);
})