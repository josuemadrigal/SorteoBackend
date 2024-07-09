const { Router } = require("express");
const {
  registerCtrl,
  loginCtrl,
  getUserCtrl,
  getUsersCtrl,
  putUserCtrl,
} = require("../controllers/auth");

const auth = Router();
auth.post("/register", registerCtrl);
auth.post("/login", loginCtrl);

auth.get("/user/:id", getUserCtrl);
auth.get("/user", getUsersCtrl);

auth.put("/user/:id", putUserCtrl);

module.exports = auth;
