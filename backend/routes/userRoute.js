/*
 * userRoute.js
 *
 * Purpose:
 * This script defines routes for managing user operations in an Express.js application.
 * It allows authorized users to add, update, delete, and retrieve user records.
 *
 * Features:
 * - POST /add: Adds a new user to the system.
 * - PUT /update: Updates an existing user's information.
 * - DELETE /delete/:id: Deletes a user based on their unique ID.
 * - GET /all: Retrieves a list of all users.
 * - All routes are protected by role-based access control.
 *
 * Usage:
 * Mount this route in your main application file (e.g., `app.use('/api/users', userRoute);`).
 * Ensure that `validateDesignationHandler` correctly authorizes the roles.
 *
 * Dependencies:
 * - express: Web framework for routing.
 * - userController: Contains the logic for user CRUD operations.
 * - validateDesignationHandler: Middleware that ensures only authorized designations can access these routes.
 */
const express = require("express");
const {
  addUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");
const validateDesignation = require("../middleware/validateDesignationHandler");
const router = express.Router();

// Apply designation validation middleware for all routes under this router
// Only users with "ESTATE_OFFICER" or "PRINCIPAL" roles are allowed
router.use(validateDesignation(["ESTATE_OFFICER", "PRINCIPAL"]));

router.post("/add", addUser);
router.put("/update", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/all", getAllUsers);

module.exports = router;
