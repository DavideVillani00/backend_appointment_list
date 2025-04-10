const express = require("express");
const route = express.Router();
const USERS = require("../../fakeDb");

route.post("/", (req, res) => {
  const { userName, password } = req.body;
  const user = USERS.filter((us) => {
    return us.userName === userName;
  });
  if (!user) return res.status(404).json({ msg: "User not find" });

  //   da inserire il bycript della verifica della password
  if (user.password !== password)
    return res.status(404).json({ msg: "Wrong password" });

  //   genera token
  console.log("genero token");
});
