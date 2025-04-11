const express = require("express");
const route = express.Router();
const { USERS } = require("../../fakeDb");
const jwt = require("jsonwebtoken");

route.post("/", (req, res) => {
  const { userName, password } = req.body;
  const user = USERS.find((us) => {
    return us.userName === userName;
  });
  if (!user)
    return res.status(404).json({ err: "UserName", msg: "User not find" });

  //   da inserire il bycript della verifica della password
  if (user.password !== password)
    return res.status(404).json({ err: "Password", msg: "Wrong password" });

  const token = jwt.sign(
    { userName: user.userName, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token, msg: "Logged in" });
});

module.exports = route;
