const express = require("express");
const router = express.Router();
const { APPOINTMENT_LIST } = require("../../fakeDb.js");

router.get("/", (req, res) => {
  res.status(200).json(APPOINTMENT_LIST);
});
router.get("/search/:id", (req, res) => {
  const { id } = req.params;
  const result = APPOINTMENT_LIST.find((app) => app.id == id);
  if (!result) res.status(404).json({ msg: "Appointment not found" });
  res.status(200).json(result);
});

router.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const appointment = APPOINTMENT_LIST.find((app) => app.id == id);
  if (!appointment) {
    return res.status(404).json({ msg: "Appointment not found" });
  }
  const boolCheck = !appointment.check;
  appointment.check = boolCheck;
  res.status(200).json({ msg: "Appointment updated" });
});

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

router.put("/edit", (req, res) => {
  const { id, userName, title, date, time, check } = req.body;
  const appointment = APPOINTMENT_LIST.find((app) => app.id == id);
  if (!appointment) {
    return res.status(404).json({ msg: "Appointment not found" });
  }
  if (userName) appointment.userName = userName;
  if (title) appointment.title = title;
  if (date) appointment.date = date;
  if (time) appointment.time = time;
  if (check) appointment.check = check;

  res.status(200).json({ msg: "Appointment updated" });
});

router.post("/search", (req, res) => {
  console.log(req.body);
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
    return res.status(404).json({ msg: "Appointment not found", arr: [] });

  res.status(200).json(result);
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const appointmentIndex = APPOINTMENT_LIST.findIndex((app) => app.id == id);
  if (appointmentIndex == -1)
    return res.status(404).json({ msg: "Appointment not found" });

  APPOINTMENT_LIST.splice(appointmentIndex, 1);

  res.status(200).json({ msg: "Appointment deleted" });
});

module.exports = router;
