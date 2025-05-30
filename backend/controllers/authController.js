/*
 * authController.js
 *
 * Purpose:
 * This script provides controller functions for handling user authentication in an Express.js application.
 * It includes functionality for user login and authentication status checking.
 *
 * Features:
 * - Login functionality: Validates user credentials (username and password), generates a JWT access token upon successful login, and sets it as a cookie.
 * - Authentication check: Verifies if a user is authenticated by responding with an authentication status.
 * - Uses bcrypt for secure password comparison and JWT for token-based authentication.
 * - Handles errors gracefully with appropriate HTTP status codes and error messages.
 * - Loads environment variables for JWT configuration (secret and expiration).
 *
 * Usage:
 * Import this module in your Express.js routes (e.g., `const authController = require('./authController');`) and
 * use the exported `login` and `check` functions as route handlers for authentication-related endpoints.
 * Ensure the following environment variables are set in a .env file: JWT_SECRET, JWT_EXPIRES_IN.
 * The User model must be defined in `../models/userModel` and include a `passwordHash` field.
 *
 * Dependencies:
 * - express-async-handler: Simplifies error handling for async Express route handlers.
 * - dotenv: Loads environment variables from a .env file.
 * - jsonwebtoken: Generates and verifies JSON Web Tokens for authentication.
 * - bcryptjs: Handles password hashing and comparison.
 * - User model: Mongoose model for user data, including username, passwordHash, and designation.
 */

const asyncHandler = require("express-async-handler");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Login handler for user authentication
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    res.status(404);
    throw new Error("Username not found");
  } else {
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash); // Compare provided password with stored hash

    if (isPasswordMatch) {
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
          designation: user.designation,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      res.cookie("token", accessToken, {
        withCredentials: true, // Allow credentials in cross-origin requests
        httpOnly: false, // Allow client-side access to cookie (use with caution)
        maxAge: 20 * 60 * 1000, // Cookie expiration (20 minutes in milliseconds)
      }); // Set JWT as a cookie
      res.status(200).json({
        username: user.username,
        designation: user.designation,
        message: "Login successful!",
      });
    } else {
      res.status(400);
      throw new Error("Invalid password");
    }
  }
});

// Authentication check handler
const check = asyncHandler(async (req, res) => {
  res.status(200).json({ authenticated: true });
});

module.exports = { login, check };
