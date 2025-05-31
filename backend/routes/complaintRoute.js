/*
 * complaintRoute.js
 *
 * Purpose:
 * This script defines complaint-related API routes for an Express.js application.
 * It manages the creation, retrieval, statistics, and access-controlled views of complaints.
 *
 * Features:
 * - GET /your-activity: Retrieves complaints associated with the currently authenticated user.
 * - POST /add: Adds a new complaint with support for multiple file uploads (images/videos).
 * - GET /statistics: Fetches aggregated statistics related to complaints.
 * - GET /: Retrieves all complaints.
 * - GET /complaints-with-price-later: Retrieves complaints pending price assignment (role-restricted).
 *
 * Usage:
 * Mount this router in the main server file (e.g., `app.use('/api/complaints', complaintRoute);`).
 * Ensure required middlewares and controllers are properly implemented.
 *
 * Dependencies:
 * - express: Web framework used for routing.
 * - complaintController: Contains all business logic for handling complaint operations.
 * - fileHandler middleware: Handles file uploads and ensures temporary directory setup.
 * - validateDesignationHandler: Middleware to authorize users based on their designation/role.
 */
const express = require("express");
const {
  addComplaint,
  fetchComplaints,
  yourActivity,
  getComplaintStatistics,
  fetchComplaintsWithPriceLater,
} = require("../controllers/complaintController");
const { ensureTempDirectory, upload } = require("../middleware/fileHandler");
const validateDesignation = require("../middleware/validateDesignationHandler");
const router = express.Router();

router.get("/your-activity", yourActivity);
// Route to add a new complaint
// - Requires user to have an authorized designation
// - Handles image and video uploads using multer
router.post(
  "/add",
  validateDesignation([
    "ESTATE_OFFICER",
    "COMPLAINANT",
    "PRINCIPAL",
    "ASSISTANT_TO_ESTATE_OFFICER",
  ]),
  ensureTempDirectory,
  upload.fields([
    { name: "imgBefore_1", maxCount: 1 },
    { name: "imgBefore_2", maxCount: 1 },
    { name: "imgBefore_3", maxCount: 1 },
    { name: "vidBefore", maxCount: 1 },
  ]),
  addComplaint
);
router.get("/statistics", getComplaintStatistics);
router.get("/", fetchComplaints);
router.get(
  "/complaints-with-price-later",
  validateDesignation([
    "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
    "EXECUTIVE_ENGINEER_IT",
  ]),
  fetchComplaintsWithPriceLater
);

module.exports = router;
