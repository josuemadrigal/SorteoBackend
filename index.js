const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { dbMySql } = require("./database/database");

const app = express();

const corsOptions = {
  origin: "https://app.eduardespiritusanto.com",
  optionsSuccessStatus: 200, // Algunas versiones antiguas de navegadores (IE11, varios SmartTVs) requieren el estatus 204 en lugar de 200
};

app.use(cors(corsOptions));

app.use(express.static("public"));

app.use(express.json());

app.use("/api/registros", require("./routes/registros"));

dbMySql();

app.listen(process.env.PORT, () => {
  console.log(`Servidor activo puerto =>: ${process.env.PORT}`);
});
