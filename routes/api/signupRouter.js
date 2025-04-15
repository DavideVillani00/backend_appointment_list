const express = require("express");
const router = express.Router();
const { USERS } = require("../../fakeDb.js");

router.post("/", (req, res) => {
  const user = req.body;
  const usernameNotAvaible = USERS.find((us) => {
    return us.userName === user.userName;
  });
  if (usernameNotAvaible) {
    return res
      .status(406)
      .json({ err: "userName", msg: "UserName is not avaible" });
  }
  const emailNotAvaible = USERS.find((us) => {
    return us.email === user.email;
  });
  if (emailNotAvaible) {
    return res.status(406).json({ err: "email", msg: "Email is not avaible" });
  }

  USERS.push(user);
  return res.status(201).json({ msg: "Signup completed" });
});

module.exports = router;
