const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { createUser, findByEmail, findById } = require("../models/userModel");
const { createSession, deleteSession } = require("../models/sessionModel");

const TOKEN_TTL_DAYS = Number(process.env.TOKEN_TTL_DAYS || "7");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const existing = await findByEmail(email);
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role || "student";
    const userId = await createUser({
      name,
      email,
      passwordHash,
      role: userRole,
    });

    const user = await findById(userId);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Missing credentials" });
      return;
    }

    const userRecord = await findByEmail(email);
    if (!userRecord) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, userRecord.password_hash);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + TOKEN_TTL_DAYS);

    await createSession({
      token,
      userId: userRecord._id,
      expiresAt,
    });

    const user = await findById(userRecord._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");
    if (token) {
      await deleteSession(token);
    }
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  signup,
  login,
  logout,
  me,
};
