const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  complaintID: {
    type: Number,
    required: true,
    ref: "Complaint",
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  previousStatus: {
    type: String,
    trim: true,
    default: null, // Status change may not always be present
  },
  currentStatus: {
    type: String,
    trim: true,
    default: null,
  },
  previousDepartment: {
    type: String,
    trim: true,
    default: null, // Department change may not always be present
  },
  currentDepartment: {
    type: String,
    trim: true,
    default: null,
  },
  message: {
    type: String,
    required: true, // Stores either status change or department change message
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
