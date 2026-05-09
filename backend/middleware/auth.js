const { findByToken } = require("../models/sessionModel");
const { findById } = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");

    if (!token) {
      res.status(401).json({ message: "Missing auth token" });
      return;
    }

    const session = await findByToken(token);

    if (!session) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const now = new Date();
    if (new Date(session.expires_at) < now) {
      res.status(401).json({ message: "Token expired" });
      return;
    }

    const user = await findById(session.user_id);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ message: "Auth check failed" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};

module.exports = {
  requireAuth,
  requireRole,
};
