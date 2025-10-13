const User = require("../models/User");
const crypto = require("crypto");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    await user.save();

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Generate auth token
    const token = user.generateAuthToken();

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: {
        user,
        token,
        verificationToken:
          process.env.NODE_ENV === "development"
            ? verificationToken
            : undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration error",
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message:
          "Account is temporarily locked due to failed login attempts. Try again later.",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate auth token
    const token = user.generateAuthToken();

    // Remove password from response
    user.password = undefined;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Login error",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "preferences",
      "avatar",
    ];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Profile update failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Update error",
    });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Password change failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Password change error",
    });
  }
};

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Password reset token generated successfully",
      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password reset request failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the token and find user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Set new password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Reset login attempts if any
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Password reset failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Password reset error",
    });
  }
};

// @desc    Verify email
// @route   GET /api/users/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token and find user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Email verification failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Verification error",
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === "true";
    }

    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { lastName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:userId
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Update user by ID (Admin only)
// @route   PUT /api/users/:userId
// @access  Private/Admin
const updateUserById = async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "role",
      "isActive",
      "address",
      "preferences",
    ];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User update failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Update error",
    });
  }
};

// @desc    Delete user by ID (Admin only)
// @route   DELETE /api/users/:userId
// @access  Private/Admin
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User deletion failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Create user by admin
// @route   POST /api/users/admin/create
// @access  Private/Admin
const createUserByAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, isActive } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user with admin-specified settings
    const user = new User({
      firstName,
      lastName,
      email,
      password: password || "TempPass123!", // Default temporary password
      phone,
      role: role || "user",
      isActive: isActive !== undefined ? isActive : true,
      isEmailVerified: true, // Admin-created users are auto-verified
    });

    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User created successfully by admin.",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User creation failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Creation error",
    });
  }
};

// @desc    Promote user to admin (Development only)
// @route   POST /api/users/promote-admin
// @access  Private
const promoteToAdmin = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({
        success: false,
        message: "This endpoint is only available in development mode",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: "admin" },
      { new: true }
    );

    res.json({
      success: true,
      message: "User promoted to admin successfully",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to promote user",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUserByAdmin,
  promoteToAdmin,
};
