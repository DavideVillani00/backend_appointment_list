const express = require("express");
const router = express.Router();
const { USERS } = require("../../fakeDb.js");

router.get("/", (req, res) => {
  console.log("get users");
  res.status(200).json(USERS);
});

module.exports = router;
