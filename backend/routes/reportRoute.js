const express = require("express");
const {
  generateComplaintReport
} = require("../controllers/reportController");
const router = express.Router();

router.get("/", generateComplaintReport);

module.exports = router;