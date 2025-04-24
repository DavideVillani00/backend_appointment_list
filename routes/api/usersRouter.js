const express = require("express");
const router = express.Router();
// const { USERS } = require("../../fakeDb.js");
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
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});
// const user = USERS.find((u) => u.id == id);
// if (!user) res.status(404).json({ msg: "User not found" });
// res.status(200).json(user);

router.post("/search", async (req, res) => {
  const { userName, role } = req.body;
  let query = "SELECT * FROM users ";
  let params = [];
  if (userName) {
    role ? params.push(userName, role) : params.push(userName);
    query += role ? "WHERE userName = ? AND role = ?" : "WHERE userName = ?";
  } else if (role) {
    userName ? params.push(role, userName) : params.push(role);
    query += userName ? "WHERE role = ? AND userName = ?" : "WHERE role = ?";
  }
  console.log(query, params);
  try {
    const [rows] = await conn.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Users not found", arr: rows });
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }

  // let filteredUser = USERS;
  // if (userName) {
  //   filteredUser = filteredUser.filter((u) => u.userName === userName);
  // }
  // if (role) {
  //   filteredUser = filteredUser.filter((u) => u.role === role);
  // }
  // if (filteredUser.length === 0) {
  //   return res.status(404).json({ msg: "Appointment not found", arr: [] });
  // }
  // res.status(200).json(filteredUser);
});

router.post("/add", async (req, res) => {
  const { role, userName, email, password, name, surname, company, gender } =
    req.body;

  try {
    const passHash = await bcrypt.hash(password, 10);
    await conn.query(
      "INSERT INTO users (role, userName, email, password, firstName, lastName, gender, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [role, userName, email, passHash, name, surname, gender, company]
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

  // const usernameNotAvaible = USERS.find((u) => u.userName === userName);
  // if (usernameNotAvaible) {
  //   return res
  //     .status(406)
  //     .json({ err: "userName", msg: "User-name is not avaible" });
  // }

  // const emailNotAvaible = USERS.find((u) => u.email === email);
  // if (emailNotAvaible) {
  //   return res.status(406).json({ err: "email", msg: "Email is not avaible" });
  // }
  // const newUser = {
  //   id: Math.random() * 1000,
  //   role,
  //   userName,
  //   email,
  //   password,
  //   name,
  //   surname,
  //   gender,
  //   company,
  // };

  // USERS.push(newUser);
  // res.status(201).json({ msg: "User created" });
});

router.put("/edit", async (req, res) => {
  const {
    id,
    role,
    userName,
    email,
    password,
    name,
    surname,
    company,
    gender,
  } = req.body;
  try {
    const passHash = await bcrypt.hash(password, 10);
    console.log(
      role,
      userName,
      email,
      passHash,
      name,
      surname,
      gender,
      company,
      id
    );
    const [result] = await conn.query(
      "UPDATE users SET role = ?, userName = ?, email = ?, password = ?, firstName = ?, lastName = ?, gender = ?, company = ? WHERE userId = ?",
      [role, userName, email, passHash, name, surname, gender, company, id]
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

  // const user = USERS.find((u) => u.id == id);

  // if (!user) {
  //   return res.status(404).json({ msg: "User not found" });
  // }
  // const usernameNotAvaible = USERS.find((u) => u.userName === userName);
  // if (usernameNotAvaible && usernameNotAvaible.id != id) {
  //   return res
  //     .status(406)
  //     .json({ err: "userName", msg: "User-name is not avaible" });
  // }

  // const emailNotAvaible = USERS.find((u) => u.email === email);
  // if (emailNotAvaible && emailNotAvaible.id != id) {
  //   return res.status(406).json({ err: "email", msg: "Email is not avaible" });
  // }

  // if (role) user.role = role;
  // if (userName) user.userName = userName;
  // if (email) user.email = email;
  // if (password) user.password = password;
  // if (name) user.name = name;
  // if (surname) user.surname = surname;
  // if (gender) user.gender = gender;
  // if (company) user.company = company;

  // res.status(200).json({ msg: "User updated" });
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
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

  // const userIndex = USERS.findIndex((u) => u.id == id);
  // if (userIndex == -1) return res.status(404).json({ msg: "User not found" });

  // USERS.splice(userIndex, 1);

  // res.status(200).json({ msg: "User deleted" });
});

module.exports = router;
