/*
 * notificationRoute.js
 *
 * Purpose:
 * This script defines the API route for handling user notifications in an Express.js application.
 * It enables fetching notifications, optionally filtered by date range or other query parameters.
 *
 * Features:
 * - GET /: Retrieves a list of notifications, with optional filtering.
 *
 * Usage:
 * Mount this route in your main application (e.g., `app.use('/api/notifications', notificationRoute);`).
 * Ensure the `notificationController` implements logic to handle query filters properly.
 *
 * Dependencies:
 * - express: Web framework for defining API routes.
 * - notificationController: Contains logic to fetch and filter notification data.
 */
const express = require("express");
const { fetchNotifications } = require("../controllers/notificationController");

const router = express.Router();

// Fetch notifications with optional date filters
router.get("/", fetchNotifications);

module.exports = router;
