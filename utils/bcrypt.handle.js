const { hash, compare } = require("bcryptjs");

const encrypt = async (pass) => {
  const passwordHash = await hash(pass, 8);
  console.log("hola2: ", passwordHash);
  return passwordHash;
};

const verified = async (pass, passHash) => {
  const isCorrect = await compare(pass, passHash);
  return isCorrect;
};

module.exports = { encrypt, verified };
