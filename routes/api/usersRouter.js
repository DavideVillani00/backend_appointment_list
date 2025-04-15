const express = require("express");
const router = express.Router();
const { USERS } = require("../../fakeDb.js");

router.get("/", (req, res) => {
  res.status(200).json(USERS);
});

router.get("/search/:id", (req, res) => {
  const { id } = req.params;
  const user = USERS.find((u) => u.id == id);
  console.log(user);
  if (!user) res.status(404).json({ msg: "User not found" });
  res.status(200).json(user);
});

router.post("/search", (req, res) => {
  const { userName, role } = req.body;
  let filteredUser = USERS;
  if (userName) {
    filteredUser = filteredUser.filter((u) => u.userName === userName);
  }
  if (role) {
    filteredUser = filteredUser.filter((u) => u.role === role);
  }
  if (filteredUser.length === 0) {
    return res.status(404).json({ msg: "Appointment not found", arr: [] });
  }
  res.status(200).json(filteredUser);
});

router.post("/add", (req, res) => {
  const { role, userName, email, password, name, surname, company, gender } =
    req.body;
  const usernameNotAvaible = USERS.find((u) => u.userName === userName);
  if (usernameNotAvaible) {
    return res
      .status(406)
      .json({ err: "userName", msg: "User-name is not avaible" });
  }

  const emailNotAvaible = USERS.find((u) => u.email === email);
  if (emailNotAvaible) {
    return res.status(406).json({ err: "email", msg: "Email is not avaible" });
  }
  const newUser = {
    id: Math.random() * 1000,
    role,
    userName,
    email,
    password,
    name,
    surname,
    gender,
    company,
  };

  USERS.push(newUser);
  res.status(201).json({ msg: "User created" });
});

router.put("/edit", (req, res) => {
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

  const user = USERS.find((u) => u.id == id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  const usernameNotAvaible = USERS.find((u) => u.userName === userName);
  if (usernameNotAvaible && usernameNotAvaible.id != id) {
    return res
      .status(406)
      .json({ err: "userName", msg: "User-name is not avaible" });
  }

  const emailNotAvaible = USERS.find((u) => u.email === email);
  if (emailNotAvaible && emailNotAvaible.id != id) {
    return res.status(406).json({ err: "email", msg: "Email is not avaible" });
  }

  if (role) user.role = role;
  if (userName) user.userName = userName;
  if (email) user.email = email;
  if (password) user.password = password;
  if (name) user.name = name;
  if (surname) user.surname = surname;
  if (gender) user.gender = gender;
  if (company) user.company = company;

  res.status(200).json({ msg: "User updated" });
});

module.exports = router;
