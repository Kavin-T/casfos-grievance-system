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
  message: {
    type: String,
    required: true,
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
