/*
 * authRoute.js
 *
 * Purpose:
 * This script defines authentication-related routes for an Express.js application.
 * It handles user login and token validation for protected routes.
 *
 * Features:
 * - POST /login: Authenticates user credentials and issues an access token.
 * - GET /check: Validates the provided token to ensure authorized access.
 * - Applies middleware to protect secure routes using token-based authentication.
 *
 * Usage:
 * Import and mount this route in the main server file (e.g., `app.use('/api/auth', authRoute);`).
 * Ensure the `authController` and `validateTokenHandler` middleware are properly implemented.
 *
 * Dependencies:
 * - express: Web framework for Node.js used to define routes.
 * - authController: Contains the logic for login and token check operations.
 * - validateTokenHandler: Middleware to verify access tokens and protect routes.
 */
const express = require("express");
const router = express.Router();
const { login, check } = require("../controllers/authController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/login", login);
router.get("/check",validateToken, check);

module.exports = router;
