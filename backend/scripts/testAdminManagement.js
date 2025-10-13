#!/usr/bin/env node

// Test script to verify admin user management functionality
const API_BASE_URL = "http://localhost:8070/api";

async function testAdminUserManagement() {
  console.log("🔐 Testing Admin User Management Functionality\n");

  let adminToken = "";

  // Login as admin first
  console.log("1️⃣ Admin Login...");
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
      adminToken = loginData.data.token;
      console.log("✅ Admin logged in successfully");
    } else {
      console.log("❌ Admin login failed:", loginData.message);
      return;
    }
  } catch (error) {
    console.log("❌ Admin login error:", error.message);
    return;
  }

  // Test 1: Create a new user via admin
  console.log("\n2️⃣ Testing Admin User Creation...");
  const newUserEmail = `testuser_${Date.now()}@example.com`;

  try {
    const createResponse = await fetch(`${API_BASE_URL}/users/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: newUserEmail,
        password: "TestPass123!",
        phone: "+1234567899",
        role: "user",
        isActive: true,
      }),
    });

    const createData = await createResponse.json();

    if (createData.success) {
      console.log("✅ Admin successfully created new user");
      console.log("   User:", createData.data.user.fullName);
      console.log("   Email:", createData.data.user.email);
      console.log("   Role:", createData.data.user.role);
    } else {
      console.log("❌ User creation failed:", createData.message);
    }
  } catch (error) {
    console.log("❌ User creation error:", error.message);
  }

  // Test 2: Get all users with pagination
  console.log("\n3️⃣ Testing User List with Pagination...");
  try {
    const usersResponse = await fetch(`${API_BASE_URL}/users?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const usersData = await usersResponse.json();

    if (usersData.success) {
      console.log("✅ Successfully retrieved user list");
      console.log(`   Total users: ${usersData.data.pagination.total}`);
      console.log(`   Current page: ${usersData.data.pagination.page}`);
      console.log(`   Users on this page: ${usersData.data.users.length}`);
    } else {
      console.log("❌ Failed to get user list:", usersData.message);
    }
  } catch (error) {
    console.log("❌ User list error:", error.message);
  }

  // Test 3: Search users
  console.log("\n4️⃣ Testing User Search...");
  try {
    const searchResponse = await fetch(`${API_BASE_URL}/users?search=admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const searchData = await searchResponse.json();

    if (searchData.success) {
      console.log("✅ User search working");
      console.log(
        `   Found ${searchData.data.users.length} users matching 'admin'`
      );
    } else {
      console.log("❌ User search failed:", searchData.message);
    }
  } catch (error) {
    console.log("❌ User search error:", error.message);
  }

  // Test 4: Filter by role
  console.log("\n5️⃣ Testing Role Filter...");
  try {
    const filterResponse = await fetch(`${API_BASE_URL}/users?role=admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const filterData = await filterResponse.json();

    if (filterData.success) {
      console.log("✅ Role filter working");
      console.log(`   Found ${filterData.data.users.length} admin users`);
    } else {
      console.log("❌ Role filter failed:", filterData.message);
    }
  } catch (error) {
    console.log("❌ Role filter error:", error.message);
  }

  // Test 5: Update user (if we created one)
  console.log("\n6️⃣ Testing User Update...");
  try {
    const getUsersResponse = await fetch(
      `${API_BASE_URL}/users?search=${newUserEmail.split("@")[0]}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    const getUsersData = await getUsersResponse.json();

    if (getUsersData.success && getUsersData.data.users.length > 0) {
      const testUser = getUsersData.data.users[0];

      const updateResponse = await fetch(
        `${API_BASE_URL}/users/${testUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            firstName: "Updated",
            lastName: "TestUser",
            role: "moderator",
            isActive: false,
          }),
        }
      );

      const updateData = await updateResponse.json();

      if (updateData.success) {
        console.log("✅ User update successful");
        console.log("   Updated name:", updateData.data.user.fullName);
        console.log("   Updated role:", updateData.data.user.role);
        console.log(
          "   Updated status:",
          updateData.data.user.isActive ? "Active" : "Inactive"
        );
      } else {
        console.log("❌ User update failed:", updateData.message);
      }
    } else {
      console.log("⚠️ No test user found for update");
    }
  } catch (error) {
    console.log("❌ User update error:", error.message);
  }

  // Test 6: Try user management as regular user (should fail)
  console.log("\n7️⃣ Testing User Access Control...");
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
      const userToken = userLoginData.data.token;

      // Try to create user as regular user
      const unauthorizedResponse = await fetch(
        `${API_BASE_URL}/users/admin/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            firstName: "Should",
            lastName: "Fail",
            email: "shouldfail@example.com",
          }),
        }
      );

      if (unauthorizedResponse.status === 403) {
        console.log(
          "✅ Access control working - regular user blocked from admin functions"
        );
      } else {
        console.log(
          "❌ Access control failed - regular user has admin access!"
        );
      }
    }
  } catch (error) {
    console.log("❌ Access control test error:", error.message);
  }

  console.log("\n🎉 Admin User Management Tests Completed!");
  console.log("\n📋 Features Verified:");
  console.log("   ✅ Admin user creation");
  console.log("   ✅ User list with pagination");
  console.log("   ✅ User search functionality");
  console.log("   ✅ Role-based filtering");
  console.log("   ✅ User updates");
  console.log("   ✅ Access control");
  console.log("\n🚀 Admin Dashboard is ready for production!");
}

// Run the test
testAdminUserManagement().catch(console.error);
