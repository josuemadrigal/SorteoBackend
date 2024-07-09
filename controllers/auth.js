const { loginUser, getUser, getUsers, newUser } = require("../services/auth");
const { encrypt } = require("../utils/bcrypt.handle");
const userMysql = require("../models/users");

const loginCtrl = async (req, res) => {
  const { email, password } = req.body;
  const response = await loginUser({ email, password });
  return response;
};

const getUserCtrl = async (req, res) => {
  const { id } = req.params;

  const result = await getUser(id);

  if (result === "NOT_FOUND_USER") {
    return res.status(404).json({
      message: `no existe el usuario ${id}`,
    });
  }
  res.send(result);
};

const getUsersCtrl = async (req, res) => {
  try {
    const usuarios = await getUsers();
    res.json(usuarios);
  } catch (error) {
    console.log("POR AQUI: " + error);
  }
};

const registerCtrl = async (req, res) => {
  const { body } = req;
  const userNew = await newUser(body);
  return userNew;
};

const putUserCtrl = async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const usuario = await userMysql.findByPk(id);
    const password = await encrypt(body.password);

    if (usuario) {
      await usuario.update({
        name: body.name,
        email: body.email,
        password,
        status: body.status,
      });

      res.status(200).json({
        message: "Usuario actualizado",
      });
    } else {
      res.status(404).json({
        message: `No se encontro el usuario ${id}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error 500",
    });
  }
};

module.exports = {
  loginCtrl,
  getUserCtrl,
  getUsersCtrl,
  registerCtrl,
  putUserCtrl,
};
