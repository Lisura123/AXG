const express = require("express");
const router = express.Router();

// Import controllers
const {
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
} = require("../controllers/userController");

// Import middleware
const { authenticate, authorize } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateAdminUserUpdate,
  validateUserQuery,
  validateObjectId,
} = require("../middleware/validation");
const {
  authLimiter,
  passwordResetLimiter,
  registrationLimiter,
} = require("../middleware/rateLimiter");

// Public routes
// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  registrationLimiter,
  validateUserRegistration,
  registerUser
);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post("/login", authLimiter, validateUserLogin, loginUser);

// @route   POST /api/users/forgot-password
// @desc    Request password reset
// @access  Public
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validatePasswordResetRequest,
  forgotPassword
);

// @route   POST /api/users/reset-password
// @desc    Reset password with token
// @access  Public
router.post("/reset-password", validatePasswordReset, resetPassword);

// @route   GET /api/users/verify-email/:token
// @desc    Verify email address
// @access  Public
router.get("/verify-email/:token", verifyEmail);

// Protected routes (require authentication)
// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", authenticate, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put("/profile", authenticate, validateUserUpdate, updateUserProfile);

// @route   PUT /api/users/change-password
// @desc    Change current user password
// @access  Private
router.put(
  "/change-password",
  authenticate,
  validatePasswordChange,
  changePassword
);

// @route   POST /api/users/promote-admin
// @desc    Promote current user to admin (Development only)
// @access  Private
router.post("/promote-admin", authenticate, promoteToAdmin);

// Admin only routes
// @route   POST /api/users/admin/create
// @desc    Create user by admin
// @access  Private/Admin
router.post(
  "/admin/create",
  authenticate,
  authorize("admin"),
  validateUserRegistration,
  createUserByAdmin
);

// @route   GET /api/users
// @desc    Get all users with pagination and filtering
// @access  Private/Admin
router.get(
  "/",
  authenticate,
  authorize("admin"),
  validateUserQuery,
  getAllUsers
);

// @route   GET /api/users/:userId
// @desc    Get user by ID
// @access  Private/Admin
router.get(
  "/:userId",
  authenticate,
  authorize("admin"),
  validateObjectId("userId"),
  getUserById
);

// @route   PUT /api/users/:userId
// @desc    Update user by ID
// @access  Private/Admin
router.put(
  "/:userId",
  authenticate,
  authorize("admin"),
  validateObjectId("userId"),
  validateAdminUserUpdate,
  updateUserById
);

// @route   DELETE /api/users/:userId
// @desc    Delete user by ID
// @access  Private/Admin
router.delete(
  "/:userId",
  authenticate,
  authorize("admin"),
  validateObjectId("userId"),
  deleteUserById
);

module.exports = router;
