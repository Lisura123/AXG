import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const AuthTestComponent: React.FC = () => {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setLoginError(result.error);
      } else {
        setEmail("");
        setPassword("");
        console.log("Login successful!");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const useTestCredentials = (type: "admin" | "user") => {
    if (type === "admin") {
      setEmail("admin@axgbolt.com");
      setPassword("AdminPass123!");
    } else {
      setEmail("user@axgbolt.com");
      setPassword("UserPass123!");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome!</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Name:</span>
            <span className="text-gray-800">{user.fullName}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Role:</span>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                isAdmin
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.role.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Status:</span>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                user.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email Verified:</span>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                user.isEmailVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {user.isEmailVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700 font-medium">🔑 Admin Access Granted</p>
            <p className="text-red-600 text-sm">
              You have administrative privileges
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        AXG Bolt Login Test
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        {loginError && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700 text-sm">{loginError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 border-t pt-6">
        <p className="text-sm text-gray-600 mb-3">
          Test with sample credentials:
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => useTestCredentials("admin")}
            className="w-full bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition duration-200"
          >
            🔑 Use Admin Credentials
          </button>

          <button
            type="button"
            onClick={() => useTestCredentials("user")}
            className="w-full bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 transition duration-200"
          >
            👤 Use User Credentials
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            <strong>Admin:</strong> admin@axgbolt.com / AdminPass123!
          </p>
          <p>
            <strong>User:</strong> user@axgbolt.com / UserPass123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthTestComponent;
