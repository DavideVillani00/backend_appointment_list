const express = require("express");
const router = express.Router();
// const { USERS } = require("../../fakeDb.js");
const conn = require("../../connectionDb.js");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  // const user = req.body;
  const user = req.body;

  const { userName, email, password, name, surname, company, gender } = user;

  try {
    const passHash = await bcrypt.hash(password, 10);
    await conn.query(
      "INSERT INTO users ( userName, email, password, firstName, lastName, gender, company) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
      [userName, email, passHash, name, surname, gender, company]
    );
    res.status(201).json({ msg: "User created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      const errorTarget = err.sqlMessage.includes("userName")
        ? "userName"
        : "email";
      return res
        .status(406)
        .json({ msg: `${errorTarget} is not avaible`, err: errorTarget });
    }
    res.status(500).json({ msg: "Database error:", err });
  }

  // const usernameNotAvaible = USERS.find((us) => {
  //   return us.userName === user.userName;
  // });
  // if (usernameNotAvaible) {
  //   return res
  //     .status(406)
  //     .json({ err: "userName", msg: "UserName is not avaible" });
  // }
  // const emailNotAvaible = USERS.find((us) => {
  //   return us.email === user.email;
  // });
  // if (emailNotAvaible) {
  //   return res.status(406).json({ err: "email", msg: "Email is not avaible" });
  // }

  // USERS.push(user);
  // return res.status(201).json({ msg: "Signup completed" });
});

module.exports = router;
