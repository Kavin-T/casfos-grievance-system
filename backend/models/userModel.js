/*
 * userModel.js
 *
 * Purpose:
 * This script defines the Mongoose schema and model for users in an Express.js application.
 * It structures user data stored in a MongoDB database, with validation rules for usernames,
 * designations, emails, phone numbers, and password hashes.
 *
 * Features:
 * - Defines a schema for users with fields: username, designation, email, phoneNumber, and passwordHash.
 * - Enforces data validation:
 *   - Username: Required, unique, trimmed, max 100 characters.
 *   - Designation: Required, trimmed, restricted to specific roles (e.g., PRINCIPAL, JUNIOR_ENGINEER_IT).
 *   - Email: Required, unique, trimmed, lowercase, validated against a basic email regex.
 *   - PhoneNumber: Required, unique, trimmed, validated as a 10-digit number.
 *   - PasswordHash: Required, stores hashed passwords (not plain text).
 * - Automatically adds `createdAt` and `updatedAt` timestamps via Mongoose `timestamps` option.
 * - Creates a User model for interacting with the users collection in MongoDB.
 *
 * Usage:
 * Import this module in your application (e.g., `const User = require('./userModel');`) to interact
 * with the User collection in MongoDB. Use the model for CRUD operations in controllers or other modules.
 * Ensure Mongoose is connected to the database before using the model.
 *
 * Dependencies:
 * - mongoose: MongoDB object modeling tool for Node.js.
 *
 * Notes:
 * - The schema enforces uniqueness for username, email, and phoneNumber to prevent duplicates.
 * - The email field is converted to lowercase to ensure consistency.
 * - The passwordHash field should store hashed passwords (e.g., using bcrypt) for security.
 * - The designation field is restricted to a predefined list of roles relevant to the application.
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter an username"],
      unique: [true, "Username already exists"],
      trim: true,
      maxlength: 100,
    },
    designation: {
      type: String,
      required: [true, "Please enter designation"],
      trim: true,
      enum: [
        "PRINCIPAL",
        "ESTATE_OFFICER",
        "ASSISTANT_TO_ESTATE_OFFICER",
        "COMPLAINANT",
        "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
        "EXECUTIVE_ENGINEER_IT",
        "ASSISTANT_ENGINEER_CIVIL",
        "ASSISTANT_ENGINEER_ELECTRICAL",
        "ASSISTANT_ENGINEER_IT",
        "JUNIOR_ENGINEER_CIVIL",
        "JUNIOR_ENGINEER_ELECTRICAL",
        "JUNIOR_ENGINEER_IT",
      ],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: [true, "Email already exists"],
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter phone number"],
      unique: [true, "Phone Number already exists"],
      trim: true,
      match: [/^\d{10}$/, "Please enter a 10 digit phone number"],
    },
    passwordHash: {
      type: String,
      required: [true, "Please enter password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
