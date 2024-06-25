const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { dbMySql } = require("./database/database");

const app = express();

const corsOptions = {
  origin: "https://app.eduardespiritusanto.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "Accept",
    "X-Requested-With",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.static("public"));

app.use(express.json());

app.use("/api/registros", require("./routes/registros"));

dbMySql();

app.listen(process.env.PORT, () => {
  console.log(`Servidor activo puerto =>: ${process.env.PORT}`);
});
