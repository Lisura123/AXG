const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 JWT decoded:", {
      userId: decoded.userId,
      role: decoded.role,
    });

    const user = await User.findById(decoded.userId).select("-password");
    console.log("👤 User from DB:", {
      id: user?._id,
      role: user?.role,
      isActive: user?.isActive,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: "Account is temporarily locked due to failed login attempts.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    // Flatten the roles array in case it's nested
    const flatRoles = roles.flat();

    console.log("🔍 Authorization check:");
    console.log("  - Raw roles:", roles);
    console.log("  - Flattened roles:", flatRoles);
    console.log("  - User exists:", !!req.user);
    console.log("  - User role:", req.user?.role);
    console.log("  - User ID:", req.user?._id);

    if (!req.user) {
      console.log("❌ No user found in request");
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!flatRoles.includes(req.user.role)) {
      console.log("❌ Role check failed:", req.user.role, "not in", flatRoles);
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${flatRoles.join(" or ")}`,
      });
    }

    console.log("✅ Authorization successful");
    next();
  };
};

// Check if user owns resource or has admin privileges
const authorizeOwnerOrAdmin = (resourceUserField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Admin can access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId =
      req.params[resourceUserField] || req.body[resourceUserField];

    if (req.user._id.toString() !== resourceUserId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own resources.",
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (user && user.isActive && !user.isLocked) {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwnerOrAdmin,
  optionalAuth,
};
