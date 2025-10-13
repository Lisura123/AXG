const mongoose = require("mongoose");
require("dotenv").config();
const Category = require("./models/Category");

const categories = [
  {
    name: "Batteries",
    hasSubmenu: false,
    submenu: [],
    isActive: true,
  },
  {
    name: "Chargers",
    hasSubmenu: false,
    submenu: [],
    isActive: true,
  },
  {
    name: "Card Readers",
    hasSubmenu: false,
    submenu: [],
    isActive: true,
  },
  {
    name: "Lens Filters",
    hasSubmenu: true,
    submenu: [
      { name: "58mm", category: "58mm" },
      { name: "67mm", category: "67mm" },
      { name: "77mm", category: "77mm" },
    ],
    isActive: true,
  },
  {
    name: "Camera Backpacks",
    hasSubmenu: false,
    submenu: [],
    isActive: true,
  },
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");

    // Clear existing categories
    console.log("Clearing existing categories...");
    await Category.deleteMany({});

    // Insert new categories
    console.log("Inserting categories...");
    const insertedCategories = await Category.insertMany(categories);

    console.log(`Successfully seeded ${insertedCategories.length} categories:`);
    insertedCategories.forEach((category) => {
      console.log(
        `- ${category.name} (${category.submenu.length} subcategories)`
      );
    });

    // Verify categories were created
    const categoryCount = await Category.countDocuments();
    console.log(`\nTotal categories in database: ${categoryCount}`);

    console.log("\nCategory seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seeder
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
