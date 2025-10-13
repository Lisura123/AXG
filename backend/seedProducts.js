const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const sampleProducts = [
  // Batteries Category
  {
    name: "LP-E6NH Rechargeable Battery for Canon",
    description:
      "High-capacity lithium-ion battery compatible with Canon EOS R5, R6, 5D Mark IV, 6D Mark II, 7D Mark II, 80D, and 90D cameras. Features advanced battery management system for optimal performance and safety.",
    features: [
      "2130mAh high capacity",
      "Advanced battery management system",
      "Compatible with Canon cameras",
      "Overcharge and overdischarge protection",
      "Temperature monitoring",
      "Long-lasting performance",
    ],
    imageURL: "https://example.com/images/lp-e6nh-battery.jpg",
    category: "Batteries",
    subcategory: "Camera Batteries",
    isActive: true,
    isFeatured: true,
    price: 79.99,
    stock: 25,
    tags: ["canon", "battery", "lp-e6nh", "rechargeable"],
    specifications: {
      "Battery Type": "Lithium-ion",
      Capacity: "2130mAh",
      Voltage: "7.2V",
      Compatibility: "Canon EOS R5, R6, 5D IV, 6D II, 7D II, 80D, 90D",
      Warranty: "1 Year",
    },
    metaDescription:
      "High-capacity LP-E6NH battery for Canon cameras. Advanced safety features and long-lasting performance.",
  },
  {
    name: "NP-FZ100 Battery for Sony Alpha Cameras",
    description:
      "Premium replacement battery for Sony Alpha series cameras including A7 III, A7R III, A7R IV, A9, and A6600. Delivers exceptional shooting time and reliability for professional photographers.",
    features: [
      "2280mAh ultra-high capacity",
      "Premium lithium-ion cells",
      "Sony Alpha compatibility",
      "Extended shooting time",
      "Built-in safety circuits",
      "No memory effect",
    ],
    imageURL: "https://example.com/images/np-fz100-battery.jpg",
    category: "Batteries",
    subcategory: "Camera Batteries",
    isActive: true,
    isFeatured: true,
    price: 89.99,
    stock: 30,
    tags: ["sony", "battery", "np-fz100", "alpha", "mirrorless"],
    specifications: {
      "Battery Type": "Lithium-ion",
      Capacity: "2280mAh",
      Voltage: "7.2V",
      Compatibility: "Sony A7III, A7RII, A7RIV, A9, A6600",
      Warranty: "1 Year",
    },
    metaDescription:
      "Premium NP-FZ100 battery for Sony Alpha cameras. Ultra-high capacity for extended shooting sessions.",
  },

  // Chargers Category
  {
    name: "Dual USB-C Fast Charger for Canon LP-E6N/LP-E6NH",
    description:
      "Advanced dual-slot USB-C charger for Canon LP-E6N and LP-E6NH batteries. Features intelligent charging with LED indicators, overcharge protection, and fast charging capability.",
    features: [
      "Dual-slot simultaneous charging",
      "USB-C input for modern devices",
      "LED charging indicators",
      "Intelligent charging control",
      "Overcharge protection",
      "Compact portable design",
    ],
    imageURL: "https://example.com/images/dual-usb-c-charger.jpg",
    category: "Chargers",
    subcategory: "USB-C Chargers",
    isActive: true,
    isFeatured: true,
    price: 49.99,
    stock: 40,
    tags: ["charger", "usb-c", "canon", "dual", "fast-charging"],
    specifications: {
      Input: "USB-C 5V/3A",
      Output: "DC 8.4V/1.2A x2",
      Compatibility: "Canon LP-E6N, LP-E6NH batteries",
      "Charging Time": "3-4 hours (dual)",
      Dimensions: "110 x 70 x 25mm",
    },
    metaDescription:
      "Dual USB-C fast charger for Canon batteries. Intelligent charging with safety protection.",
  },

  // Card Readers Category
  {
    name: "Professional USB-C Multi-Card Reader",
    description:
      "High-speed professional card reader supporting SD, microSD, CF, and XQD cards. Perfect for photographers and videographers who need fast and reliable data transfer.",
    features: [
      "USB-C 3.2 Gen 2 interface",
      "Supports multiple card formats",
      "SuperSpeed data transfer",
      "Plug-and-play operation",
      "Durable aluminum construction",
      "LED activity indicator",
    ],
    imageURL: "https://example.com/images/professional-card-reader.jpg",
    category: "Card Readers",
    subcategory: "USB-C Card Readers",
    isActive: true,
    isFeatured: true,
    price: 59.99,
    stock: 35,
    tags: ["card-reader", "usb-c", "professional", "multi-format"],
    specifications: {
      Interface: "USB-C 3.2 Gen 2",
      "Card Support": "SD, SDHC, SDXC, microSD, CF, XQD",
      "Transfer Speed": "Up to 10Gbps",
      Material: "Aluminum alloy",
      Compatibility: "Windows, Mac, Linux",
    },
    metaDescription:
      "Professional USB-C multi-card reader. High-speed data transfer for multiple card formats.",
  },

  // Lens Filters Category
  {
    name: "Premium UV Protection Filter 77mm",
    description:
      "Professional-grade UV filter with multi-coating technology. Protects your lens from UV rays, dust, and scratches while maintaining optical clarity and color accuracy.",
    features: [
      "16-layer multi-coating",
      "Premium optical glass",
      "UV ray protection",
      "Scratch and dust protection",
      "Color-neutral performance",
      "Ultra-slim frame design",
    ],
    imageURL: "https://example.com/images/uv-filter-77mm.jpg",
    category: "Lens Filters",
    subcategory: "UV Filters",
    isActive: true,
    isFeatured: false,
    price: 39.99,
    stock: 50,
    tags: ["filter", "uv", "77mm", "lens-protection", "multi-coating"],
    specifications: {
      "Filter Size": "77mm",
      "Filter Type": "UV Protection",
      Coating: "16-layer multi-coating",
      Material: "Premium optical glass",
      Frame: "Ultra-slim aluminum",
    },
    metaDescription:
      "77mm UV protection filter with 16-layer multi-coating. Premium lens protection and optical clarity.",
  },

  {
    name: "Circular Polarizing Filter 67mm",
    description:
      "High-quality circular polarizing filter that reduces reflections, increases contrast, and enhances color saturation. Essential for landscape and outdoor photography.",
    features: [
      "Reduces reflections and glare",
      "Enhances color saturation",
      "Increases contrast",
      "Rotatable polarizing element",
      "Multi-coated optical glass",
      "Slim profile design",
    ],
    imageURL: "https://example.com/images/cpl-filter-67mm.jpg",
    category: "Lens Filters",
    subcategory: "Polarizing Filters",
    isActive: true,
    isFeatured: false,
    price: 54.99,
    stock: 25,
    tags: ["filter", "polarizing", "67mm", "cpl", "landscape"],
    specifications: {
      "Filter Size": "67mm",
      "Filter Type": "Circular Polarizing",
      Polarization: "Circular",
      Material: "Multi-coated optical glass",
      Frame: "Aluminum with rotation ring",
    },
    metaDescription:
      "67mm circular polarizing filter. Reduces reflections and enhances colors for stunning photography.",
  },
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");

    // Clear existing products
    console.log("Clearing existing products...");
    await Product.deleteMany({});

    // Insert new products
    console.log("Inserting sample products...");
    const insertedProducts = await Product.insertMany(sampleProducts);

    console.log(`Successfully seeded ${insertedProducts.length} products:`);
    insertedProducts.forEach((product) => {
      console.log(
        `- ${product.name} (${product.category}/${product.subcategory})`
      );
    });

    // Verify products were created
    const productCount = await Product.countDocuments();
    console.log(`\nTotal products in database: ${productCount}`);

    // Show featured products
    const featuredCount = await Product.countDocuments({ isFeatured: true });
    console.log(`Featured products: ${featuredCount}`);

    console.log("\nProduct seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seeder
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
