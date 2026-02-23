const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : null;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { auth, adminOnly };
