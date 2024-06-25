const express = require("express");
const appHttp = express();
require("dotenv").config();
const cors = require("cors");

const { dbMySql } = require("./database/database");

const app = express();

app.use(cors());

app.use(express.static("public"));

app.use(express.json());

app.use("/api/registros", require("./routes/registros"));

dbMySql();

const sslOptions = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/app.eduardespiritusanto.com/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/app.eduardespiritusanto.com/fullchain.pem"
  ),
};

https.createServer(sslOptions, app).listen(process.env.PORT, () => {
  console.log(`Servidor activo puerto =>: ${process.env.PORT}`);
});

appHttp.get("*", (req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});

http.createServer(appHttp).listen(process.env.PORT, () => {
  console.log(`HTTP Server active on port: ${process.env.PORT}`);
});
