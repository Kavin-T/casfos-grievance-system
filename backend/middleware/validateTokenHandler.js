/*
 * validateTokenHandler.js
 *
 * Purpose:
 * This script provides a middleware function for validating JSON Web Tokens (JWT) in an Express.js application.
 * It ensures that incoming requests contain a valid JWT, authenticating the user before allowing access to protected routes.
 *
 * Features:
 * - validateToken: Middleware that checks for a JWT in the request's cookies and verifies its validity.
 * - Extracts the token from `req.cookies.token`.
 * - Verifies the token using the JWT_SECRET environment variable.
 * - Attaches the decoded token payload to `req.user` for use in subsequent middleware or route handlers.
 * - Throws a 401 error if no token is provided and a 403 error if the token is invalid or expired.
 * - Uses asyncHandler for consistent error handling in async middleware.
 *
 * Usage:
 * Import this module in your Express.js routes (e.g., `const validateToken = require('./validateTokenHandler');`)
 * and use it as middleware for protected routes, e.g., `router.get('/protected', validateToken, handler)`.
 * Ensure the JWT_SECRET environment variable is set in a .env file and that cookies are properly sent with requests.
 *
 * Dependencies:
 * - express-async-handler: Simplifies error handling for async Express middleware.
 * - jsonwebtoken: Library for verifying JSON Web Tokens.
 * - dotenv: Requires environment variables (e.g., JWT_SECRET) to be configured.
 *
 * Notes:
 * - The middleware expects the JWT to be stored in a cookie named `token`.
 * - The decoded token payload (e.g., containing user ID, username, designation) is attached to `req.user`.
 * - Ensure prior middleware (e.g., cookie-parser) is used to parse cookies.
 */

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Middleware to validate JWT token
const validateToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error("Token Missing. Login Again.");
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403);
    throw new Error("Invalid or expired token");
  }
});

module.exports = validateToken;
