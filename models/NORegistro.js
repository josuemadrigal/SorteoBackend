const { Schema, model } = require("mongoose");

const RegistroSchema = Schema({
  municipio: {
    type: String,
    required: true,
  },
  boleta: {
    type: String,
    requiered: true,
    unique: true,
  },

  status: {
    type: Number,
    requiered: true,
  },
  premio: {
    type: String,
    requiered: false,
  },
});

module.exports = model("Registro", RegistroSchema);
