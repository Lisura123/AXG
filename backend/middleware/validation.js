const { body, param, query, validationResult } = require("express-validator");

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("phone")
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),

  handleValidationErrors,
];

// User login validation
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// User profile update validation
const validateUserUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),

  body("address.street")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Street address cannot exceed 100 characters"),

  body("address.city")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("City cannot exceed 50 characters"),

  body("address.state")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("State cannot exceed 50 characters"),

  body("address.zipCode")
    .optional()
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage("Please provide a valid ZIP code"),

  body("address.country")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Country cannot exceed 50 characters"),

  handleValidationErrors,
];

// Password change validation
const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return value;
  }),

  handleValidationErrors,
];

// Password reset request validation
const validatePasswordResetRequest = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

// Password reset validation
const validatePasswordReset = [
  body("token").notEmpty().withMessage("Reset token is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return value;
  }),

  handleValidationErrors,
];

// Admin user management validation
const validateAdminUserUpdate = [
  param("userId").isMongoId().withMessage("Invalid user ID"),

  body("role")
    .optional()
    .isIn(["user", "admin", "moderator"])
    .withMessage("Role must be user, admin, or moderator"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),

  handleValidationErrors,
];

// Query validation for user list
const validateUserQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("role")
    .optional()
    .isIn(["user", "admin", "moderator"])
    .withMessage("Role must be user, admin, or moderator"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Search term must be at least 2 characters long"),

  handleValidationErrors,
];

// MongoDB ObjectId validation
const validateObjectId = (fieldName) => [
  param(fieldName).isMongoId().withMessage(`Invalid ${fieldName}`),
  handleValidationErrors,
];

// Product creation validation
const validateProductCreation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("imageURL")
    .optional()
    .custom((value) => {
      if (!value) return true; // Optional field
      // Allow URLs (http/https) or file paths (starting with / or containing file extensions)
      const isURL = /^https?:\/\//.test(value);
      const isFilePath =
        /^\//.test(value) || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
      if (!isURL && !isFilePath) {
        throw new Error("Image must be a valid URL or file path");
      }
      return true;
    }),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("sku")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters"),

  handleValidationErrors,
];

// Product update validation
const validateProductUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("imageURL")
    .optional()
    .custom((value) => {
      if (!value) return true; // Optional field
      // Allow URLs (http/https) or file paths (starting with / or containing file extensions)
      const isURL = /^https?:\/\//.test(value);
      const isFilePath =
        /^\//.test(value) || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
      if (!isURL && !isFilePath) {
        throw new Error("Image must be a valid URL or file path");
      }
      return true;
    }),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("sku")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters"),

  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateAdminUserUpdate,
  validateUserQuery,
  validateObjectId,
  validateProductCreation,
  validateProductUpdate,
  handleValidationErrors,
};
