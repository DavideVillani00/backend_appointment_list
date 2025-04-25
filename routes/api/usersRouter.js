const express = require("express");
const router = express.Router();
const conn = require("../../connectionDb.js");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});

router.get("/search/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await conn.query("SELECT * FROM users WHERE userId = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    console.log(rows[0]);
    rows[0].password = "";
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});

router.post("/search", async (req, res) => {
  const { userName, role } = req.body;
  let query = "SELECT * FROM users WHERE 1=1 ";
  let params = [];
  if (userName) {
    query += "AND userName = ? ";
    params.push(userName);
  }
  if (role) {
    query += "AND role = ? ";
    params.push(role);
  }
  try {
    const [rows] = await conn.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Users not found", arr: rows });
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});

router.post("/add", async (req, res) => {
  const {
    role,
    userName,
    email,
    password,
    firstName,
    lastName,
    company,
    gender,
  } = req.body;

  try {
    const passHash = await bcrypt.hash(password, 10);
    await conn.query(
      "INSERT INTO users (role, userName, email, password, firstName, lastName, gender, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [role, userName, email, passHash, firstName, lastName, gender, company]
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

router.put("/edit", async (req, res) => {
  const {
    userId,
    role,
    userName,
    email,
    password,
    firstName,
    lastName,
    company,
    gender,
  } = req.body;
  try {
    const passHash = password && (await bcrypt.hash(password, 10));
    const passwordQuery = password ? " password = ?," : "";
    const params = password
      ? [
          role,
          userName,
          email,
          passHash,
          firstName,
          lastName,
          gender,
          company,
          userId,
        ]
      : [role, userName, email, firstName, lastName, gender, company, userId];
    const [result] = await conn.query(
      `UPDATE users SET role = ?, userName = ?, email = ?, ${passwordQuery} firstName = ?, lastName = ?, gender = ?, company = ? WHERE userId = ?`,
      params
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(201).json({ msg: "User updated" });
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

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const [result] = await conn.query("DELETE FROM users WHERE userId = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Database error:", err });
  }
});

module.exports = router;
