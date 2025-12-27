import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.models.js"; // adjust path

dotenv.config();
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mern-cohort-app";

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Super Admin",
      email: "kumarvijayy036@gmail.com",
      password: "Admin@123", // pre-save hook will hash
      role: "admin",
      isEmailVerified: true,
    });

    await admin.save();

    console.log("Admin user created:");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
