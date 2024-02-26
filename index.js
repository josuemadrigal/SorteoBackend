const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { dbMySql } = require("./database/database");

const app = express();

app.use(cors());

app.use(express.static("public"));

app.use(express.json());

app.use("/api/registros", require("./routes/registros"));

dbMySql();

app.listen(process.env.PORT, () => {
  console.log(`Servidor activo puerto: ${process.env.PORT}`);
});
