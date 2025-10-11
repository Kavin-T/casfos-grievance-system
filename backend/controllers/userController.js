/*
 * userController.js
 *
 * Purpose:
 * This script provides controller functions for managing user accounts in an Express.js application.
 * It handles creating, updating, deleting, and retrieving user data stored in a MongoDB database.
 *
 * Features:
 * - addUser: Creates a new user with hashed password and required fields.
 * - updateUser: Updates user details, including optional password updates with hashing.
 * - deleteUser: Deletes a user by ID.
 * - getAllUsers: Retrieves all users, excluding sensitive passwordHash field.
 * - Uses bcrypt for secure password hashing.
 * - Implements error handling for missing fields, non-existent users, and database operations.
 *
 * Usage:
 * Import this module in your Express.js routes (e.g., `const userController = require('./userController');`)
 * and use the exported functions as route handlers for user management endpoints. Ensure the User model
 * is properly configured and environment variables are set if needed.
 *
 * Dependencies:
 * - express-async-handler: Simplifies error handling for async Express route handlers.
 * - User model: Mongoose model for user data (../models/userModel).
 * - bcryptjs: Handles password hashing.
 *
 * Notes:
 * - The User model should include fields like username, designation, email, phoneNumber, and passwordHash.
 * - Passwords are hashed with bcrypt before storage for security.
 * - The getAllUsers function excludes the passwordHash field from responses for security.
 */

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Handler to add a new user
const addUser = asyncHandler(async (req, res) => {
  let { username, designation, email, phoneNumber, password } = req.body;

  username = username.toUpperCase();

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  const passwordHash = await bcrypt.hash(password, 10); // Hash password with bcrypt (10 salt rounds)

  const user = await User.create({
    username,
    designation,
    email,
    phoneNumber,
    passwordHash,
  }); // Create new user in database

  res.status(200).json({ message: "User added successfully", user });
});

// Handler to update an existing user
const updateUser = asyncHandler(async (req, res) => {
  const { id, password, ...updates } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (password) {
    const passwordHash = await bcrypt.hash(password, 10); // Hash new password if provided
    user.passwordHash = passwordHash;
  }

  Object.assign(user, updates);
  await user.save(); // Save updated user to database

  res.status(200).json({ message: "User updated successfully", user });
});

// Handler to delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id); // Find and delete user by ID
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User deleted successfully" });
});

// Handler to fetch all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-passwordHash"); // Fetch all users, excluding passwordHash
  res.status(200).json({ users });
});

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
