const { Sequelize } = require("sequelize");

const database = process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;

const sequelize = new Sequelize(database, username, password, {
  host,
  port: 3306,
  dialect: "mysql",
  query: { raw: true },
});

const dbMySql = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexion correcta MYSQL");
  } catch (e) {
    console.log("MSQL error de conexion ", e);
  }
};

module.exports = { sequelize, dbMySql };
