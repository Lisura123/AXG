const express = require("express");
const { body } = require("express-validator");
const { sendContactMessage } = require("../controllers/contactController");
const { handleValidationErrors } = require("../middleware/validation");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Contact form validation rules
const contactValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("subject")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Subject must be between 5 and 100 characters"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),
];

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post(
  "/",
  rateLimiter.contactLimiter, // Rate limiting for contact form
  contactValidation,
  handleValidationErrors,
  sendContactMessage
);

module.exports = router;
