const express = require("express");
const router = express.Router();
const { APPOINTMENT_LIST } = require("../../fakeDb.js");
const conn = require("../../connectionDb.js");

router.get("/", async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT * FROM appointments");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
  // res.status(200).json(APPOINTMENT_LIST);
});
router.get("/search/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await conn.query(
      "SELECT * FROM appointments WHERE appointmentId = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }

  // const result = APPOINTMENT_LIST.find((app) => app.id == id);
  // if (!result) res.status(404).json({ msg: "Appointment not found" });
  // res.status(200).json(result);
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await conn.query(
      "SELECT done FROM appointments WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    const invertedBool = !rows[0].done;
    const [result] = await conn.query(
      "UPDATE appointments SET done = ? WHERE id = ?",
      invertedBool,
      id
    );
    if (result.affectedRows === 0) {
      return res.status(500).json({ msg: "Update failed" });
    }
    res.status(200).json({ msg: "Appointment updated" });
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }

  // const appointment = APPOINTMENT_LIST.find((app) => app.id == id);
  // if (!appointment) {
  //   return res.status(404).json({ msg: "Appointment not found" });
  // }
  // const boolCheck = !appointment.check;
  // appointment.check = boolCheck;
  // res.status(200).json({ msg: "Appointment updated" });
});

router.post("/add", async (req, res) => {
  const { userName, date, title, time } = req.body;

  try {
    const [rows] = await conn.query(
      "SELECT userId from users WHERE userName = ?",
      [userName]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    await conn.query(
      "INSERT INTO appointments (title, date, time, userId) VALUES (?, ?, ?, ?)",
      [title, date, time, rows[0].userId]
    );
    res.status(201).json({ msg: "Appointment created" });
  } catch (err) {
    res.status(500).json({ msg: "Database error:", err });
  }

  // const appointment = {
  //   id: Math.random() * 1000,
  //   userName,
  //   title,
  //   date,
  //   time,
  //   check: false,
  // };
  // APPOINTMENT_LIST.push(appointment);
  // res.status(201).json({ msg: "Appointment created" });
});

// ! da finire
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
  const { title, date, userName, check } = req.body;

  let result = APPOINTMENT_LIST;
  if (title) {
    result = result.filter((user) =>
      user.title.toLowerCase().includes(title.toLowerCase())
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
