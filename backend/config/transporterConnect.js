const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("Email configuration error", error);
  } else {
    console.log("Email configuration successful");
  }
});

module.exports = transporter;