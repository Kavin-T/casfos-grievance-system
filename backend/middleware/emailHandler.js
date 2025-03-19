const Complaint = require("../models/complaintModel");
const User = require("../models/userModel");
const transporter = require("../config/transporterConnect");

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
    await new Promise((res) => setTimeout(res, 5000));

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully on retry");
    } catch (error) {
      console.log("Email sending failed after retry", error);
    }
  }
};

const sendComplaintRaisedMail = async (complaintId) => {
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      console.log("Complaint not found");
      return;
    }

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
        </html>`;

    sendEmail(subject, emailBody, recipients);
  } catch (error) {
    console.log("Internal server error", error);
  }
};

module.exports = { sendEmail, sendComplaintRaisedMail };
