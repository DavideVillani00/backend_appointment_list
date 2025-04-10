const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const PORT = 3000;

const apiRouter = require("./routes/apiRouter.js");

// const { USERS, APPOINTMENT_LIST } = require("./fakeDb.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", apiRouter);

// users api

// app.get("/api/users", (req, res) => {
//   res.status(200).json(USERS);
// });

// app.get("/api/users/:id", (req, res) => {
//   const { id } = req.params;
//   const result = USERS.filter((user) => {
//     return user.id == id;
//   });
//   if (!result.length > 0) throw res.status(404).json({ msg: "user not found" });
//   res.status(200).json(result);
// });

// app.post("/api/users/search", (req, res) => {
//   const { userName, role } = req.body;

//   const result = USERS.filter((user) => {
//     return user.;
//   });
//   if (!result.length > 0) throw res.status(404).json({ msg: "user not found" });
//   res.status(200).json(result);
// });

// appontment api

// app.get("/api/appointments", (req, res) => {
//   res.status(200).json(APPOINTMENT_LIST);
// });

// app.post("/api/appointments/search", (req, res) => {
//   const { searchTitle, date, userName, check } = req.body;
//   let result = APPOINTMENT_LIST;
//   if (searchTitle) {
//     result = result.filter((user) =>
//       user.title.toLowerCase().includes(searchTitle.toLowerCase())
//     );
//   }
//   if (date) {
//     result = result.filter((user) => user.date.includes(date));
//   }
//   if (userName) {
//     result = result.filter((user) => user.userName === userName);
//   }
//   if (typeof check === "boolean") {
//     result = result.filter((user) => user.check == check);
//   }

//   if (!result.length > 0)
//     throw res.status(404).json({ msg: "appointment not found" });

//   res.status(200).json(result);
// });

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
