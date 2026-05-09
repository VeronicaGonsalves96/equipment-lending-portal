const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { connectDb } = require("./config/database");

dotenv.config();

require("./models/userModel");
require("./models/equipmentModel");
require("./models/borrowModel");
require("./models/sessionModel");

const User = mongoose.model("User");
const Equipment = mongoose.model("Equipment");
const BorrowRequest = mongoose.model("BorrowRequest");
const Session = mongoose.model("Session");

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seed = async () => {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Equipment.deleteMany({}),
    BorrowRequest.deleteMany({}),
    Session.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [admin, staff, student] = await User.create([
    {
      name: "Admin User",
      email: "admin@school.edu",
      password_hash: passwordHash,
      role: "admin",
    },
    {
      name: "Lab Staff",
      email: "staff@school.edu",
      password_hash: passwordHash,
      role: "staff",
    },
    {
      name: "Student User",
      email: "student@school.edu",
      password_hash: passwordHash,
      role: "student",
    },
  ]);

  const equipmentItems = await Equipment.create([
    {
      name: "DSLR Camera Kit",
      category: "Media",
      condition: "Good",
      quantity: 5,
      available_quantity: 4,
    },
    {
      name: "Microscope Set",
      category: "Lab",
      condition: "Excellent",
      quantity: 3,
      available_quantity: 3,
    },
    {
      name: "Basketball Set",
      category: "Sports",
      condition: "Fair",
      quantity: 4,
      available_quantity: 4,
    },
  ]);

  await BorrowRequest.create([
    {
      user_id: student._id,
      equipment_id: equipmentItems[0]._id,
      start_date: daysFromNow(1),
      end_date: daysFromNow(3),
      status: "approved",
      approved_by: staff._id,
    },
    {
      user_id: student._id,
      equipment_id: equipmentItems[1]._id,
      start_date: daysFromNow(5),
      end_date: daysFromNow(7),
      status: "pending",
    },
  ]);

  console.log("Seed complete.");
  console.log("Login credentials (password for all: Password123!)");
  console.log("Admin:", admin.email);
  console.log("Staff:", staff.email);
  console.log("Student:", student.email);
};

seed()
  .then(() => mongoose.connection.close())
  .catch((error) => {
    console.error("Seed failed", error);
    mongoose.connection.close();
  });