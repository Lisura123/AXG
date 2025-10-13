const mongoose = require("mongoose");
require("dotenv").config();

async function testProductAPI() {
  try {
    // Test admin login to get token
    const loginResponse = await fetch("http://localhost:8070/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@axgbolt.com",
        password: "AdminPass123!",
      }),
    });

    if (!loginResponse.ok) {
      throw new Error("Login failed: " + (await loginResponse.text()));
    }

    const loginData = await loginResponse.json();
    console.log("✅ Admin login successful");

    const token = loginData.data.token;

    // Test admin products endpoint
    const productsResponse = await fetch(
      "http://localhost:8070/api/products/admin/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!productsResponse.ok) {
      throw new Error(
        "Products fetch failed: " + (await productsResponse.text())
      );
    }

    const productsData = await productsResponse.json();
    console.log("✅ Products fetch successful");
    console.log(`📊 Total products: ${productsData.data.pagination.total}`);

    // Display first few products
    console.log("\n🔍 Sample products:");
    productsData.data.products.slice(0, 3).forEach((product) => {
      console.log(
        `- ${product.name} (${product.category}/${
          product.subcategory || "N/A"
        }) - $${product.price || "N/A"}`
      );
    });

    // Test categories endpoint
    const categoriesResponse = await fetch(
      "http://localhost:8070/api/products/categories"
    );

    if (!categoriesResponse.ok) {
      throw new Error(
        "Categories fetch failed: " + (await categoriesResponse.text())
      );
    }

    const categoriesData = await categoriesResponse.json();
    console.log("\n✅ Categories fetch successful");
    console.log(
      `📂 Total categories: ${categoriesData.data.categories.length}`
    );

    categoriesData.data.categories.forEach((category) => {
      console.log(
        `- ${category.name} (${category.submenu.length} subcategories)`
      );
    });

    console.log("\n🎉 All product API tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testProductAPI();
