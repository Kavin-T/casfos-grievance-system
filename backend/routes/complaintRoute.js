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
