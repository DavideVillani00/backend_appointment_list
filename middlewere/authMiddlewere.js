const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddlewere = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Token missing" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });

    req.user = user;
    next();
  });
};

module.exports = authMiddlewere;
