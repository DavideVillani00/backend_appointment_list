const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const PORT = 3000;

const apiRouter = require("./routes/apiRouter.js");
const authMiddlewere = require("./middlewere/authMiddlewere.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", apiRouter);

app.post("/auth", authMiddlewere, (req, res) => {
  res.status(200).json({
    userName: req.user.userName,
    role: req.user.role,
    userId: req.user.userId,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
