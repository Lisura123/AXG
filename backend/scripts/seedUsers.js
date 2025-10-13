const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding...");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@axgbolt.com" });

    if (existingAdmin) {
      console.log("Admin user already exists");
      // Update role to admin if not already
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        existingAdmin.isEmailVerified = true;
        await existingAdmin.save();
        console.log("Updated existing user to admin role");
      }
      return existingAdmin;
    }

    // Create new admin user
    const adminUser = new User({
      firstName: "Admin",
      lastName: "AXG",
      email: "admin@axgbolt.com",
      password: "AdminPass123!",
      phone: "+1234567890",
      role: "admin",
      isEmailVerified: true,
      isActive: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

// Create regular user
const createRegularUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: "user@axgbolt.com" });

    if (existingUser) {
      console.log("Regular user already exists");
      return existingUser;
    }

    // Create new regular user
    const regularUser = new User({
      firstName: "John",
      lastName: "Doe",
      email: "user@axgbolt.com",
      password: "UserPass123!",
      phone: "+9876543210",
      role: "user",
      isEmailVerified: true,
      isActive: true,
    });

    await regularUser.save();
    console.log("Regular user created successfully");
    return regularUser;
  } catch (error) {
    console.error("Error creating regular user:", error);
    throw error;
  }
};

// Main seeder function
const seedUsers = async () => {
  try {
    await connectDB();

    console.log("Starting user seeding...");

    const adminUser = await createAdminUser();
    const regularUser = await createRegularUser();

    console.log("\n=== SEEDING COMPLETED ===");
    console.log("\nAdmin User Credentials:");
    console.log("Email: admin@axgbolt.com");
    console.log("Password: AdminPass123!");
    console.log("Role: admin");

    console.log("\nRegular User Credentials:");
    console.log("Email: user@axgbolt.com");
    console.log("Password: UserPass123!");
    console.log("Role: user");

    console.log("\nBoth users are verified and active.");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, createAdminUser, createRegularUser };
