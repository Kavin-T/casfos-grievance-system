/*
 * reportRoute.js
 *
 * Purpose:
 * This script defines the route for generating complaint reports in an Express.js application.
 * It allows clients to request reports in different formats (PDF or CSV) based on query parameters.
 *
 * Features:
 * - GET /: Generates a complaint report using filters and returns the report in the requested format.
 *
 * Usage:
 * Mount this route in your main server file (e.g., `app.use('/api/report', reportRoute);`).
 * Query parameters can be passed to filter complaints and specify the report type (`type=pdf` or `type=csv`).
 *
 * Dependencies:
 * - express: Web framework used to define and handle routes.
 * - reportController: Contains the `generateComplaintReport` logic for processing data and generating reports.
 */
const express = require("express");
const {
  generateComplaintReport
} = require("../controllers/reportController");
const router = express.Router();
// Route to generate complaint reports
// Supports query filters and report type selection (PDF/CSV)
router.get("/", generateComplaintReport);

module.exports = router;
