// const asyncHandler = require("express-async-handler");
// const Notification = require("../models/notificationModel");

// /**
//  * Fetch all notifications, optionally filtering by date range.
//  */
// const fetchNotifications = asyncHandler(async (req, res) => {
//     // Fetch all notifications, sorted by the most recent
//     const notifications = await Notification.find().sort({ updatedAt: -1 });
//     res.status(200).json(notifications);
// });

// /**
//  * Updates or creates a notification entry for a complaint status or department change.
//  * If the complaint is moved to "Resolved" or "Terminated", the notification will be removed.
//  */
// const updateNotification = async (
//   complaintID,
//   subject,
//   previousStatus = null,
//   newStatus = null,
//   previousDepartment = null,
//   newDepartment = null
// ) => {
//   try {
//     // If the complaint status is "Resolved" or "Terminated", remove the notification
//     if (newStatus && (newStatus === "RESOLVED" || newStatus === "TERMINATED")) {
//       await Notification.deleteOne({ complaintID });
//       console.log(`Notification for complaint ID ${complaintID} removed.`);
//       return;
//     }

//     let notificationMessage = "";

//     if (newStatus) {
//       notificationMessage = `Status changed from ${previousStatus} to ${newStatus}`;
//     } else if (newDepartment) {
//       notificationMessage = `Department changed from ${previousDepartment} to ${newDepartment}`;
//     }

//     // Check if a notification entry already exists for this complaint
//     let notification = await Notification.findOne({ complaintID });

//     if (!notification) {
//       // Create a new notification if none exists
//       notification = new Notification({
//         complaintID,
//         subject,
//         previousStatus,
//         currentStatus: newStatus,
//         previousDepartment,
//         currentDepartment: newDepartment,
//         message: notificationMessage,
//       });
//     } else {
//       // Update the existing notification
//       if (newStatus) {
//         notification.previousStatus = previousStatus;
//         notification.currentStatus = newStatus;
//       }
//       if (newDepartment) {
//         notification.previousDepartment = previousDepartment;
//         notification.currentDepartment = newDepartment;
//       }
//       notification.message = notificationMessage;
//       notification.updatedAt = new Date();
//     }

//     await notification.save();
//   } catch (error) {
//     console.error("Error updating notification:", error);
//   }
// };

// module.exports = {
//   fetchNotifications,
//   updateNotification,
// };






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
    if (sts.toUpperCase()==="RESOLVED" || sts.toUpperCase()==="TERMINATED") {
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

