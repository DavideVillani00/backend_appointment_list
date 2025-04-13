const express = require("express");
const router = express.Router();
const { APPOINTMENT_LIST } = require("../../fakeDb.js");

router.post("/add", (req, res) => {
  const { userName, date, title, time } = req.body;
  const appointment = {
    id: Math.random() * 1000,
    userName,
    title,
    date,
    time,
    check: false,
  };
  APPOINTMENT_LIST.push(appointment);
  res.status(201).json({ msg: "Appointment created" });
});

router.post("/edit", (req, res) => {
  const { id, username, title, date, time, check } = req.body;
  const appointment = APPOINTMENT_LIST.find((app) => app.id == id);
  if (!appointment) {
    return res.status(404).json({ msg: "Appointment not found" });
  }
  if (username) appointment.userName = username;
  if (title) appointment.title = title;
  if (date) appointment.date = date;
  if (time) appointment.time = time;
  if (check) appointment.check = check;
  res.status(200).json({ msg: "Appointment updated" });
});

router.post("/search", (req, res) => {
  const { searchTitle, date, userName, check } = req.body;

  let result = APPOINTMENT_LIST;
  if (searchTitle) {
    result = result.filter((user) =>
      user.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  }
  if (date) {
    result = result.filter(
      (user) => Date.parse(user.date) === Date.parse(date)
    );
  }
  if (userName && userName !== "All") {
    result = result.filter((user) => user.userName === userName);
  }
  if (typeof check === "boolean") {
    result = result.filter((user) => user.check == check);
  }

  if (result.length === 0)
    return res.status(404).json({ msg: "appointment not found", arr: [] });

  res.status(200).json(result);
});

module.exports = router;
