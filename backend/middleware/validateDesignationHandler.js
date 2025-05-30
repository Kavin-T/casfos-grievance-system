/*
 * validateDesignationHandler.js
 *
 * Purpose:
 * This script provides a middleware factory function for validating user designations in an Express.js application.
 * It ensures that only users with specific designations can access protected routes.
 *
 * Features:
 * - validateDesignation: A factory function that generates middleware to check if the user's designation is included
 *   in a provided list of valid designations.
 * - Throws a 403 error with a custom message if the user's designation is not valid.
 * - Integrates with Express.js authentication middleware by accessing `req.user`.
 * - Uses asyncHandler for consistent error handling in async middleware.
 *
 * Usage:
 * Import this module in your Express.js routes (e.g., `const validateDesignation = require('./validateDesignationHandler');`)
 * and use it to create middleware by passing an array of valid designations, e.g.,
 * `router.get('/route', validateDesignation(['ADMIN', 'MANAGER']), handler)`. Ensure `req.user` is populated by prior
 * authentication middleware (e.g., JWT middleware).
 *
 * Dependencies:
 * - express-async-handler: Simplifies error handling for async Express middleware.
 *
 * Notes:
 * - The middleware expects `req.user` to have a `designation` property, typically set by authentication middleware.
 * - The `validDesignations` parameter must be an array of strings representing allowed designations.
 * - Errors are thrown with a 403 status code for unauthorized access.
 */

const asyncHandler = require("express-async-handler");

// Middleware to validate user designation
const validateDesignation = (validDesignations) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!validDesignations.includes(user.designation)) {
      res.status(403);
      throw new Error("Access denied: Insufficient permissions");
    }
    next();
  });
};

module.exports = validateDesignation;
