const express = require("express");
const route = express.Router();
const { USERS } = require("../../fakeDb.js");
const jwt = require("jsonwebtoken");
const conn = require("../../connectionDb.js");
const bcrypt = require("bcrypt");

route.post("/", async (req, res) => {
  const { userName, password } = req.body;

  const [rows] = await conn.query(
    "SELECT userName, role, userId, password FROM users WHERE userName = ?",
    [userName]
  );
  if (rows.length === 0) {
    return res.status(404).json({ err: "UserName", msg: "User not find" });
  }
  const verifyPass = await bcrypt.compare(password, rows[0].password);
  if (!verifyPass) {
    return res.status(403).json({ err: "Password", msg: "Wrong password" });
  }
  const token = jwt.sign(
    { userName: rows[0].userName, role: rows[0].role, userId: rows[0].userId },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token, msg: "Logged in" });

  // const user = USERS.find((us) => {
  //   return us.userName === userName;
  // });
  // if (!user)
  //   return res.status(404).json({ err: "UserName", msg: "User not find" });

  // //   da inserire il bycript della verifica della password
  // if (user.password !== password)
  //   return res.status(404).json({ err: "Password", msg: "Wrong password" });

  // const token = jwt.sign(
  //   { userName: user.userName, role: user.role, id: user.id },
  //   process.env.SECRET_KEY,
  //   { expiresIn: "1h" }
  // );

  // res.status(200).json({ token, msg: "Logged in" });
});

module.exports = route;
