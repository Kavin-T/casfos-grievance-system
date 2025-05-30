/*
 * transporterConnect.js
 *
 * Purpose:
 * This script sets up and verifies a Nodemailer transporter for sending emails using a Gmail account.
 * It is designed to be imported and used in other parts of a Node.js application to send emails.
 *
 * Features:
 * - Configures a Nodemailer transporter using Gmail service with credentials from environment variables.
 * - Verifies the email configuration upon initialization to ensure connectivity to the Gmail SMTP server.
 * - Logs success or failure of the email configuration for debugging purposes.
 * - Exports the configured transporter for use in other modules.
 *
 * Usage:
 * Import this module in your application (e.g., `const transporter = require('./transporterConnect');`)
 * and use the exported `transporter` object to send emails. Ensure the GMAIL_USER and GMAIL_PASSWORD
 * environment variables are set in a .env file before running the application.
 *
 * Dependencies:
 * - Nodemailer: A module for sending emails in Node.js.
 * - dotenv: Loads environment variables from a .env file.
 * - Environment variables: GMAIL_USER (Gmail address), GMAIL_PASSWORD (Gmail app-specific password or account password).
 *
 * Note:
 * For Gmail, an App Password is required if 2-Step Verification is enabled. Generate it from the Google Account settings.
 */

const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a Nodemailer transporter using Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Verify the transporter configuration
transporter.verify((error) => {
  if (error) {
    console.log("Email configuration error", error);
  } else {
    console.log("Email configuration successful");
  }
});

module.exports = transporter;
