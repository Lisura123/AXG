const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    hasSubmenu: {
      type: Boolean,
      default: false,
    },
    submenu: [
      {
        name: {
          type: String,
          required: function () {
            return this.parent().hasSubmenu;
          },
          trim: true,
          maxlength: [100, "Submenu name cannot exceed 100 characters"],
        },
        category: {
          type: String,
          required: function () {
            return this.parent().hasSubmenu;
          },
          trim: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better performance
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });

module.exports = mongoose.model("Category", categorySchema);
