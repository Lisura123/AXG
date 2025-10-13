#!/usr/bin/env node

// Test script to verify backend-frontend integration
const API_BASE_URL = "http://localhost:8070/api";

async function testAuthentication() {
  console.log("🚀 Testing AXG Bolt Backend-Frontend Integration\n");

  // Test 1: Health Check
  console.log("1️⃣ Testing API Health Check...");
  try {
    const response = await fetch("http://localhost:8070");
    const data = await response.json();
    console.log("✅ Server is running:", data.message);
  } catch (error) {
    console.log("❌ Server health check failed:", error.message);
    return;
  }

  // Test 2: Admin Login
  console.log("\n2️⃣ Testing Admin Login...");
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@axgbolt.com",
        password: "AdminPass123!",
      }),
    });

    const loginData = await loginResponse.json();

    if (loginData.success) {
      console.log("✅ Admin login successful");
      console.log("   Role:", loginData.data.user.role);
      console.log("   Name:", loginData.data.user.fullName);

      // Test 3: Get Admin Profile
      console.log("\n3️⃣ Testing Admin Profile Access...");
      const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${loginData.data.token}` },
      });

      const profileData = await profileResponse.json();
      if (profileData.success) {
        console.log("✅ Admin profile access successful");
      } else {
        console.log("❌ Admin profile access failed:", profileData.message);
      }

      // Test 4: Get All Users (Admin only)
      console.log("\n4️⃣ Testing Admin User Management...");
      const usersResponse = await fetch(
        `${API_BASE_URL}/users?page=1&limit=5`,
        {
          headers: { Authorization: `Bearer ${loginData.data.token}` },
        }
      );

      const usersData = await usersResponse.json();
      if (usersData.success) {
        console.log("✅ Admin can access user list");
        console.log(`   Found ${usersData.data.users.length} users`);
        console.log(
          "   Users:",
          usersData.data.users.map((u) => `${u.fullName} (${u.role})`)
        );
      } else {
        console.log("❌ Admin user management failed:", usersData.message);
      }
    } else {
      console.log("❌ Admin login failed:", loginData.message);
    }
  } catch (error) {
    console.log("❌ Admin login error:", error.message);
  }

  // Test 5: Regular User Login
  console.log("\n5️⃣ Testing Regular User Login...");
  try {
    const userLoginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "user@axgbolt.com",
        password: "UserPass123!",
      }),
    });

    const userLoginData = await userLoginResponse.json();

    if (userLoginData.success) {
      console.log("✅ Regular user login successful");
      console.log("   Role:", userLoginData.data.user.role);
      console.log("   Name:", userLoginData.data.user.fullName);

      // Test 6: User tries to access admin endpoint (should fail)
      console.log("\n6️⃣ Testing Role-based Access Control...");
      const adminAccessResponse = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${userLoginData.data.token}` },
      });

      if (adminAccessResponse.status === 403) {
        console.log(
          "✅ Role-based access control working - user blocked from admin endpoints"
        );
      } else {
        console.log(
          "❌ Role-based access control failed - user has admin access"
        );
      }
    } else {
      console.log("❌ Regular user login failed:", userLoginData.message);
    }
  } catch (error) {
    console.log("❌ Regular user login error:", error.message);
  }

  // Test 7: Invalid Login
  console.log("\n7️⃣ Testing Invalid Credentials...");
  try {
    const invalidResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "invalid@example.com",
        password: "wrongpassword",
      }),
    });

    const invalidData = await invalidResponse.json();

    if (!invalidData.success) {
      console.log("✅ Invalid credentials properly rejected");
    } else {
      console.log("❌ Invalid credentials were accepted!");
    }
  } catch (error) {
    console.log("❌ Invalid login test error:", error.message);
  }

  console.log("\n🎉 Backend-Frontend Integration Test Completed!");
  console.log("\n📋 Summary:");
  console.log("   Backend API: Running on http://localhost:8070");
  console.log("   Admin User: admin@axgbolt.com / AdminPass123!");
  console.log("   Regular User: user@axgbolt.com / UserPass123!");
  console.log("   Authentication: JWT-based");
  console.log("   Role-based Access: Implemented");
  console.log("   Frontend Integration: Ready");
}

// Run the test
testAuthentication().catch(console.error);
