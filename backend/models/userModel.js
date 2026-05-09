const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: "student" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const mapPublicUser = (user) =>
  user
    ? {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }
    : null;

const createUser = async ({ name, email, passwordHash, role }) => {
  const user = await User.create({
    name,
    email,
    password_hash: passwordHash,
    role,
  });
  return user._id.toString();
};

const findByEmail = async (email) => User.findOne({ email }).lean();

const findById = async (id) => {
  const user = await User.findById(id).lean();
  return mapPublicUser(user ? { ...user, _id: user._id } : null);
};

module.exports = {
  createUser,
  findByEmail,
  findById,
};
