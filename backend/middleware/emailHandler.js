const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require("../models/userModel");
require("dotenv").config();

const emailMiddleware = (schema) => {
  schema.pre("save", function (next) {
    if (this.isNew || this.isModified("status")) {
      this._statusChanged = true;
      this._newStatus = this.status;
    }
    next();
  });

  schema.post("save", async function (doc) {
    if (doc._statusChanged) {
      console.log("✅ Status change detected:", doc._newStatus);
      try {
        await sendStatusChangeEmail(doc._id, doc._newStatus);
      } catch (error) {
        console.error("❌ Middleware email trigger failed:", error.message);
      }
    }
  });
};

// Correct SMTP config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendStatusChangeEmail = async (complaintId, newStatus) => {
  try {
    const Complaint = mongoose.model("Complaint");
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    const targetDesignations = ["PRINCIPAL", "ESTATE_OFFICER", "ASSISTANT_TO_ESTATE_OFFICER","COMPLAINANT"];
    const recipients = await User.find(
      { designation: { $in: targetDesignations } },
      "email"
    );
    const emailAddresses = recipients.map((u) => u.email);
    if (emailAddresses.length === 0) {
      console.log("⚠️ No recipients found for status:", newStatus);
      return;
    }

    const formatDate = (date) =>
      date ? date.toLocaleDateString() : "Not available";

    const emailBody = `
      Complaint Status Update - ID: ${complaint.complaintID}
      ================================================

      Subject: ${complaint.subject}
      Raised By: ${complaint.complainantName}
      Incident Date: ${formatDate(complaint.createdAt)}
      Location: ${complaint.location} (${complaint.premises})
      Department: ${complaint.department}
      Emergency: ${complaint.emergency ? "Yes" : "No"}

      Status Changed To: ${newStatus}
      Last Updated: ${formatDate(new Date())}

      Details:
      ${complaint.details}

      ${
        newStatus === "RESOLVED"
          ? `
      Resolution Information:
      -----------------------
      Resolved Date: ${formatDate(complaint.resolvedAt)}
      Resolution Remarks: ${complaint.remark_CR || "No remarks provided"}
      `
          : ""
      }

      ${
        newStatus === "TERMINATED"
          ? `
      Termination Information:
      ------------------------
      Termination Date: ${formatDate(complaint.terminatedAt)}
      Termination Reason: ${complaint.remark_EE || "No reason provided"}
      `
          : ""
      }

      Regards,
      CASFOS Automation System
    `;

    const mailOptions = {
      from: `"CASFOS System" <${process.env.GMAIL_USER}>`,
      to: emailAddresses.join(","),
      subject: `Complaint ${newStatus} - ID: ${complaint.complaintID} - ${complaint.subject}`,
      text: emailBody.replace(/\n/g, "\r\n"),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification sent for complaint ${complaintId}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

module.exports = emailMiddleware;