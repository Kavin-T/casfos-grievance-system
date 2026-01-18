/*
 * index.js
 *
 * Purpose:
 * This script serves as the entry point for an Express.js application, setting up the server, middleware, routes,
 * and scheduled tasks for a grievance redressal system. It connects to a MongoDB database, configures email
 * transport, and schedules automated backups.
 *
 * Features:
 * - Initializes an Express server with middleware for CORS, rate limiting, cookie parsing, and JSON parsing.
 * - Serves static files for uploads and assets.
 * - Defines public routes (auth, report) and protected routes (complaint, status, user, notification) with JWT validation.
 * - Includes a global error handler for consistent error responses.
 * - Schedules weekly (every Friday at 12:00 AM) and quarterly (April 1, August 1, December 1 at 12:00 AM) backups
 *   using node-cron and a separate backup script.
 * - Connects to MongoDB and initializes the Nodemailer transporter.
 * - Starts the server on a specified port (default 5000).
 *
 * Usage:
 * Run this script with Node.js (e.g., `node index.js`) to start the server. Ensure environment variables (e.g., PORT,
 * JWT_SECRET) are set in a .env file and dependencies are installed. The server will listen for requests and execute
 * scheduled backups as configured.
 *
 * Dependencies:
 * - express: Web framework for Node.js.
 * - path: Node.js module for handling file paths.
 * - cors: Middleware for enabling Cross-Origin Resource Sharing.
 * - express-rate-limit: Middleware for rate limiting requests.
 * - cookie-parser: Middleware for parsing cookies.
 * - node-cron: Library for scheduling tasks.
 * - child_process: Node.js module for executing external scripts (e.g., backup.js).
 * - dotenv: Loads environment variables from a .env file.
 * - dbConnect: Custom module for MongoDB connection (./config/dbConnect).
 * - errorHandler: Custom middleware for error handling (./middleware/errorHandler).
 * - validateToken: Custom middleware for JWT validation (./middleware/validateTokenHandler).
 * - transporterConnect: Custom module for Nodemailer configuration (./config/transporterConnect).
 * - Routes: Custom route modules for auth, report, complaint, status, user, and notification.
 *
 * Notes:
 * - The server uses CORS with credentials enabled to allow cookie-based authentication.
 * - Rate limiting is set to 4000 requests per 15 minutes per IP.
 * - Static files are served from the `Uploads` and `assets` directories.
 * - The backup script (`./automatedJob/backup.js`) must exist and be executable.
 * - Ensure MongoDB and email transporter configurations are valid before starting the server.
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const validateToken = require("./middleware/validateTokenHandler");
const cron = require("node-cron"); // Import node-cron
const { exec } = require("child_process"); // Import child_process to execute backup.js
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 4000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);

// Static Files
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Routes (Public)
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/report", require("./routes/reportRoute"));

// Token Validation Middleware (for Protected Routes)
app.use(validateToken);

// Routes (Protected)
app.use("/api/v1/complaint", require("./routes/complaintRoute"));
app.use("/api/v1/status", require("./routes/statusRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/notification", require("./routes/notificationRoute"));

// Global Error Handler
app.use(errorHandler);

// Schedule Weekly Backup (Every Friday at 12:00 AM)
cron.schedule("0 0 * * 5", () => {
  console.log("Running weekly backup...");
  const backupScriptPath = path.join(__dirname, "automatedJob", "backup.js");
  exec(`node "${backupScriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing weekly backup: ${error.message}`);
      return;
    }
    if (stdout) {
      console.log(`Weekly backup output: ${stdout}`);
    }
    if (stderr) {
      console.error(`Weekly backup error: ${stderr}`);
    }
  });
});

// Schedule Quarterly Backup (1st day of April, August, December at 12:00 AM)
cron.schedule("0 0 1 4,8,12 *", () => {
  console.log("Running quarterly backup...");
  const backupScriptPath = path.join(__dirname, "automatedJob", "backup.js");
  exec(`node "${backupScriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing quarterly backup: ${error.message}`);
      return;
    }
    if (stdout) {
      console.log(`Quarterly backup output: ${stdout}`);
    }
    if (stderr) {
      console.error(`Quarterly backup error: ${stderr}`);
    }
  });
});

// Start Server
const start = async () => {
  try {
    await dbConnect();
    require("./config/transporterConnect");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
};

start();
