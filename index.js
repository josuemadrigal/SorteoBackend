const express = require("express");
const appHttp = express();
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");

const { dbMySql } = require("./database/database");

const app = express();

app.use(cors());

app.use(express.static("public"));

app.use(express.json());

app.use("/api/registros", require("./routes/registros"));

dbMySql();

const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/app.eduardespiritusanto.com/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/app.eduardespiritusanto.com/fullchain.pem"
  ),
};

https.createServer(options, app).listen(4001, () => {
  console.log(`Servidor HTTPS activo en el puerto 4001`);
});
