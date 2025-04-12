const express = require("express");
const router = express.Router();
const { APPOINTMENT_LIST } = require("../../fakeDb.js");

router.post("/search", (req, res) => {
  const { searchTitle, date, userName, check } = req.body;

  let result = APPOINTMENT_LIST;
  if (searchTitle) {
    result = result.filter((user) =>
      user.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  }
  if (date) {
    result = result.filter((user) => user.date.includes(date));
  }
  if (userName) {
    result = result.filter((user) => user.userName === userName);
  }
  if (typeof check === "boolean") {
    result = result.filter((user) => user.check == check);
  }

  if (result.length === 0)
    return res.status(404).json({ msg: "appointment not found" });

  res.status(200).json(result);
});

module.exports = router;
