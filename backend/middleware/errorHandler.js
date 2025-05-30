/*
 * errorHandler.js
 *
 * Purpose:
 * This script provides a middleware function for handling errors in an Express.js application. It processes errors,
 * customizes error messages for specific cases, and sends a standardized JSON response with the error details.
 *
 * Features:
 * - errorHandler: Catches and processes errors, setting appropriate HTTP status codes and error messages.
 * - Handles Mongoose-specific errors:
 *   - ValidationError: Extracts and joins validation error messages from Mongoose.
 *   - Duplicate key error (code 11000): Formats a user-friendly message for duplicate field values.
 * - Uses the response's existing status code or defaults to 500 (Internal Server Error).
 * - Returns a JSON response with the error message and status code.
 *
 * Usage:
 * Import this module in your Express.js application (e.g., `const errorHandler = require('./errorHandler');`) and
 * use it as middleware with `app.use(errorHandler)` to catch errors thrown in routes or other middleware. Ensure
 * this middleware is added after all routes to handle uncaught errors.
 *
 * Dependencies:
 * - None (uses built-in Express.js error handling and Mongoose error objects).
 *
 * Notes:
 * - The middleware expects errors to be thrown using `throw new Error()` or Mongoose-specific errors.
 * - For ValidationError, it concatenates all validation error messages with newlines.
 * - For duplicate key errors (code 11000), it identifies the conflicting field and value.
 * - The response format is consistent: `{ message: string, status: number }`.
 */

const errorHandler = (err, req, res, next) => {
  let errorMessage = err.message;

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    res.status(400);
    errorMessage = Object.values(err.errors)
      .map((err) => err.message)
      .join("\n");
  }
  // Handle Mongoose duplicate key errors
  else if (err.code === 11000) {
    res.status(400);
    const fieldName = Object.keys(err.keyValue)[0];
    const fieldValue = err.keyValue[fieldName];
    errorMessage = `${fieldName} already exists with the value "${fieldValue}"`;
  }

  const statusCode = res.statusCode ? res.statusCode : 500;
  res.json({ message: errorMessage, status: statusCode });
};

module.exports = errorHandler;
