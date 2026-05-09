const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expires_at: { type: Date, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

const createSession = async ({ token, userId, expiresAt }) =>
  Session.create({ token, user_id: userId, expires_at: expiresAt });

const findByToken = async (token) =>
  Session.findOne({ token }).lean();

const deleteSession = async (token) => Session.deleteOne({ token });

module.exports = {
  createSession,
  findByToken,
  deleteSession,
};
