/*
 * notificationController.js
 *
 * Purpose:
 * This script provides controller functions for managing notifications in an Express.js application.
 * It handles fetching notifications and updating or creating notification entries related to complaints
 * stored in a MongoDB database.
 *
 * Features:
 * - fetchNotifications: Retrieves all notifications, sorted by the most recent update time.
 * - updateNotification: Creates or updates a notification for a specific complaint, or removes it if
 *   the complaint status is "RESOLVED" or "TERMINATED".
 * - Uses asyncHandler for consistent error handling in Express routes.
 *
 * Usage:
 * Import this module in your Express.js routes (e.g., `const notificationController = require('./notificationController');`)
 * and use the exported `fetchNotifications` function as a route handler for retrieving notifications.
 * The `updateNotification` function can be called internally in other parts of the application to manage
 * notification entries for complaints. Ensure the Notification model is properly configured.
 *
 * Dependencies:
 * - express-async-handler: Simplifies error handling for async Express route handlers.
 * - Notification model: Mongoose model for notification data (../models/notificationModel).
 *
 * Notes:
 * - The Notification model should include fields like complaintID, subject, message, and updatedAt.
 * - The updateNotification function is designed to be called programmatically (not as an Express route handler).
 */

const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

/**
 * Fetch all notifications, optionally filtering by date range.
 */
const fetchNotifications = asyncHandler(async (req, res) => {
  // Fetch all notifications, sorted by the most recent
  const notifications = await Notification.find().sort({ updatedAt: -1 });
  res.status(200).json(notifications);
});

/**
 * Updates or creates a notification entry for a complaint.
 * If the complaint is moved to "Resolved" or "Terminated", the notification will be removed.
 */
const updateNotification = async (complaintID, subject, sts, message) => {
  try {
    // If the complaint status is "Resolved" or "Terminated", remove the notification
    if (
      sts.toUpperCase() === "RESOLVED" ||
      sts.toUpperCase() === "TERMINATED"
    ) {
      await Notification.deleteOne({ complaintID });
      console.log(`Notification for complaint ID ${complaintID} removed.`);
      return;
    }

    // Check if a notification entry already exists for this complaint
    let notification = await Notification.findOne({ complaintID });

    if (!notification) {
      // Create a new notification if none exists
      notification = new Notification({
        complaintID,
        subject,
        message,
      });
    } else {
      // Update the existing notification message
      notification.message = message;
    }

    await notification.save();
  } catch (error) {
    console.error("Error updating notification:", error);
  }
};

module.exports = {
  fetchNotifications,
  updateNotification,
};
