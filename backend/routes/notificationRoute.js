const express = require("express");
const { fetchNotifications } = require("../controllers/notificationController");

const router = express.Router();

// Fetch notifications with optional date filters
router.get("/", fetchNotifications);

module.exports = router;
