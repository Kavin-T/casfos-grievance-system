/*
 * notificationModel.js
 *
 * Purpose:
 * This script defines the Mongoose schema and model for notifications in an Express.js application.
 * It structures notification data stored in a MongoDB database, linking notifications to complaints.
 *
 * Features:
 * - Defines a schema for notifications with fields for complaintID, subject, and message.
 * - Enforces data validation with required fields and trims whitespace from the subject.
 * - Establishes a reference to the Complaint model via complaintID for relational queries.
 * - Creates a Notification model for interacting with the notifications collection in MongoDB.
 *
 * Usage:
 * Import this module in your application (e.g., `const Notification = require('./notificationModel');`) to interact
 * with the Notification collection in MongoDB. Use the model for CRUD operations in controllers or other modules.
 * Ensure Mongoose is connected to the database before using the model.
 *
 * Dependencies:
 * - mongoose: MongoDB object modeling tool for Node.js.
 *
 * Notes:
 * - The complaintID field references the Complaint model, enabling population or joins in queries.
 * - The subject field is trimmed to remove unnecessary whitespace.
 * - The schema is minimal but sufficient for storing complaint-related notifications.
 */

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  complaintID: {
    type: String,
    required: true,
    ref: "Complaint",
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
