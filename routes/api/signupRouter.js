const express = require("express");
const router = express.Router();
const conn = require("../../connectionDb.js");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const user = req.body;

  const { userName, email, password, firstName, lastName, company, gender } =
    user;

  try {
    const passHash = await bcrypt.hash(password, 10);
    await conn.query(
      "INSERT INTO users ( userName, email, password, firstName, lastName, gender, company) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
      [userName, email, passHash, firstName, lastName, gender, company]
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
});

module.exports = router;
