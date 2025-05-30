/*
 * emailHandler.js
 *
 * Purpose:
 * This script provides utility functions for sending email notifications in an Express.js application, specifically
 * for handling complaint-related email notifications. It uses Nodemailer to send emails and integrates with the
 * application's MongoDB database to fetch complaint and user data.
 *
 * Features:
 * - sendEmail: Sends an email with a given subject, HTML body, and recipient list, with automatic retry on failure.
 * - sendComplaintRaisedMail: Sends a notification email to relevant users when a new complaint is raised, based on
 *   the complaint's department. Includes detailed complaint information in the email body.
 * - Dynamically determines email recipients based on department-specific roles.
 * - Formats email content with HTML for better readability.
 * - Includes error handling and logging for email sending and database operations.
 *
 * Usage:
 * Import this module in your application (e.g., `const { sendComplaintRaisedMail } = require('./emailHandler');`)
 * and call `sendComplaintRaisedMail` with a complaint ID to notify relevant users. The `sendEmail` function can be
 * used directly for other email-sending needs. Ensure the transporter is configured in transporterConnect.js and
 * the Complaint and User models are properly set up.
 *
 * Dependencies:
 * - Complaint model: Mongoose model for complaint data (../models/complaintModel).
 * - User model: Mongoose model for user data (../models/userModel).
 * - transporterConnect: Nodemailer transporter configuration (../config/transporterConnect).
 *
 * Notes:
 * - The `sendEmail` function retries once after a 5-second delay if the initial attempt fails.
 * - The `sendComplaintRaisedMail` function maps department-specific roles to recipients and fetches their email addresses.
 * - The email body includes key complaint details like complainant name, subject, department, and status.
 * - Ensure the transporter is configured with valid Gmail credentials or another email service.
 */

const Complaint = require("../models/complaintModel");
const User = require("../models/userModel");
const transporter = require("../config/transporterConnect");

// Function to send an email with retry mechanism
const sendEmail = async (subject, body, recipients) => {
  const mailOptions = {
    from: "Grievance Redressal System <your-email@gmail.com>",
    to: recipients.join(", "),
    subject: subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email sending failed. Retrying in 5 seconds...", error);
    await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retry

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully on retry");
    } catch (error) {
      console.log("Email sending failed after retry", error);
    }
  }
};

// Function to send email notification for a new complaint
const sendComplaintRaisedMail = async (complaintId) => {
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      console.log("Complaint not found");
      return;
    }

    // Define department-specific recipient roles
    const departmentRecipients = {
      IT: [
        "EXECUTIVE_ENGINEER_IT",
        "ASSISTANT_ENGINEER_IT",
        "JUNIOR_ENGINEER_IT",
      ],
      ELECTRICAL: [
        "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
        "ASSISTANT_ENGINEER_ELECTRICAL",
        "JUNIOR_ENGINEER_ELECTRICAL",
      ],
      CIVIL: [
        "JUNIOR_ENGINEER_CIVIL",
        "ASSISTANT_ENGINEER_CIVIL",
        "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
      ],
    };

    const roles = departmentRecipients[complaint.department] || [];
    const users = await User.find({ designation: { $in: roles } });
    if (!users.length) {
      console.log("No recipients found for department");
      return;
    }

    const recipients = users.map((user) => user.email);
    const subject = `New Complaint Raised - ID: ${complaint.complaintID}`;
    const emailBody = `
        <html>
        <body>
            <h3>New Complaint Raised</h3>
            <p><strong>Complainant:</strong> ${complaint.complainantName}</p>
            <p><strong>Subject:</strong> ${complaint.subject}</p>
            <p><strong>Department:</strong> ${complaint.department}</p>
            <p><strong>Premises:</strong> ${complaint.premises}</p>
            <p><strong>Location:</strong> ${complaint.location} - ${
      complaint.specificLocation || "N/A"
    }</p>
            <p><strong>Details:</strong> ${complaint.details}</p>
            <p><strong>Emergency:</strong> ${
              complaint.emergency ? "Yes" : "No"
            }</p>
            <p><strong>Status:</strong> ${complaint.status}</p>
            <p><strong>Complaint Raised Date:</strong> ${new Date(
              complaint.createdAt
            ).toLocaleString()}</p>
            <p>Regards,<br>Grievance Redressal System</p>
        </body>
        </html>`; // HTML email body with complaint details

    sendEmail(subject, emailBody, recipients);
  } catch (error) {
    console.log("Internal server error", error);
  }
};

module.exports = { sendEmail, sendComplaintRaisedMail };
