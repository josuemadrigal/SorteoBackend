const { Sequelize, DataTypes } = require("sequelize");

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

// const defineModels = () => {
//   const tb_madres = sequelize.define(
//     "tb_madres",
//     {
//       nombre: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       municipio: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       cedula: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       status: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       premio: {
//         type: DataTypes.STRING,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// const tb_premios = sequelize.define("tb_premios", {
//   premio: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   la_romana: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   villa_hermosa: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   caleta: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   cumayasa: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   guaymate: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   slug_premio: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

//   return {
//     tb_madres,
//     // tb_premios,
//   };
// };

module.exports = { sequelize, dbMySql };
