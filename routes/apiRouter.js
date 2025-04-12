const express = require("express");
const router = express.Router();

// const usersRouter = require("./api/usersRouter.js");
const appointmentsRouter = require("./api/appointmentsRouter.js");
const singnupRouter = require("./api/signupRouter.js");
const loginRouter = require("./api/loginRouter.js");

router.use("/signup", singnupRouter);
router.use("/login", loginRouter);
router.use("/appointments", appointmentsRouter);
// router.use("/users", usersRouter);

module.exports = router;
