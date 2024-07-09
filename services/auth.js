const { sequelize } = require("../database/database");
const userMysql = require("../models/users");
const { encrypt, verified } = require("../utils/bcrypt.handle");
const { generateToken } = require("../utils/jwt.handle");
const { QueryTypes } = require("sequelize");

const newUser = async ({ name, email, password }) => {
  let response = {
    data: {},
    success: false,
    message: "",
  };
  try {
    const checkIs = await userMysql.findOne({ where: { email } });

    if (checkIs) {
      return (response = {
        success: false,
        message: "Este correo ya está en uso.",
        data: {},
      });
    }

    const passHash = await encrypt(password);

    const user = await userMysql.create({
      name,
      email,
      password: passHash,
      status: 1,
    });

    return (response = {
      success: true,
      data: user,
      message: "Usuario Creado Correctamente.",
    });
  } catch (error) {
    return (response = {
      success: false,
      data: error,
      message: "Error al crear el usuario",
    });
  }
};

const loginUser = async ({ email, password }) => {
  let response = {
    data: {},
    success: false,
    message: "",
  };
  try {
    const checkIs = await sequelize.query(
      `Select * from users where email ='${email}'`,
      { type: QueryTypes.SELECT }
    );

    if (checkIs.length <= 0) {
      return (response = {
        data: {},
        success: false,
        message: "El usuario no existe.",
      });
    }
    console.log("aqui: ", checkIs);
    const dataUser = checkIs[0];
    const passwordHash = dataUser.password;
    const isCorrect = await verified(password, passwordHash);
    console.log(isCorrect);
    if (!isCorrect) {
      return (response = {
        data: {},
        success: false,
        message: "Contraseña incorrecta.",
      });
    }

    const token = generateToken(dataUser.email);
    console.log(token);
    const data = {
      token,
      user: dataUser,
    };

    console.log(data);
    return (response = {
      data: data,
      success: true,
      message: `Bienvenido ${data.user.name}`,
    });
  } catch (error) {
    return (response = {
      data: error,
      success: false,
      message: "Error al validar el usuario.",
    });
  }
};

const getUser = async (id) => {
  try {
    const user = await userMysql.findByPk(id);

    if (!user) return "NOT_FOUND_USER";
    else {
      return user;
    }
  } catch (error) {
    console.log("POR AQUI: " + error);
  }
};

const getUsers = async () => {
  try {
    const user = await userMysql.findAll();

    if (!user) return "NOT_FOUND_USER";
    else {
      return user;
    }
  } catch (error) {
    console.log("POR AQUI: " + error);
  }
};

module.exports = { loginUser, getUser, getUsers, newUser };
