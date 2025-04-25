const express = require("express");
const router = express.Router();
const conn = require("../../connectionDb.js");

router.get("/", async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT * FROM appointments");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});
router.get("/search/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await conn.query(
      "SELECT a.*, u.userName FROM appointments a JOIN users u ON a.userId = u.userId WHERE appointmentId = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await conn.query(
      "SELECT done FROM appointments WHERE appointmentId = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    const invertedBool = !rows[0].done;
    const [result] = await conn.query(
      "UPDATE appointments SET done = ? WHERE appointmentId = ?",
      [invertedBool, id]
    );
    if (result.affectedRows === 0) {
      return res.status(500).json({ msg: "Update failed" });
    }
    res.status(200).json({ msg: "Appointment updated" });
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});

router.post("/add", async (req, res) => {
  const { userName, date, title, time } = req.body;
  console.log(date);
  try {
    const [rows] = await conn.query(
      "SELECT userId FROM users WHERE userName = ?",
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
});

router.put("/edit", async (req, res) => {
  const { appointmentId, userName, title, date, time } = req.body;
  try {
    const [rows] = await conn.query(
      "SELECT userId FROM users WHERE userName = ?",
      [userName]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    const [result] = await conn.query(
      "UPDATE appointments SET userId = ?, title = ?, date = ?, time = ? WHERE appointmentId = ?",
      [rows[0].userId, title, date, time, appointmentId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    res.status(200).json({ msg: "Appointment updated" });
  } catch (err) {
    res.status(500).json({ msg: "Database error:", err });
  }
});

router.post("/search", async (req, res) => {
  const { title, date, userName, done } = req.body;
  console.log(req.body.date);
  let query =
    "SELECT a.*, u.userName FROM appointments a JOIN users u ON a.userId = u.userId WHERE 1=1 ";
  let params = [];
  if (title) {
    query += "AND LOWER(a.title) LIKE ? ";
    params.push(`%${title.toLowerCase()}%`);
  }
  if (date) {
    query += "AND a.date = ? ";
    params.push(date);
  }
  if (userName) {
    query += "AND u.userName = ? ";
    params.push(userName);
  }
  if (typeof done === "boolean") {
    query += "AND a.done = ? ";
    params.push(done);
  }
  try {
    const [rows] = await conn.query(query, params);
    console.log(rows, query, params);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Appointment not found", arr: [] });
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Database error", err });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await conn.query(
      "DELETE FROM appointments WHERE appointmentId = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    res.status(200).json({ msg: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Database error:", err });
  }
});

module.exports = router;
