// const mongoose = require('mongoose');
// const { connection } = require('mongoose');
const mysql = require('mysql2/promise')

let connection = mysql.createConnection(process.env.DB_CNN);
connection.catch(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
});

  async function query(sql) {
      const cnn = await mysql.createConnection(process.env.DB_CNN);
      const [results, ] = await cnn.query(sql);
      return results;
  }
module.exports = {
    connection,
    query
}