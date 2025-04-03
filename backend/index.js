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

// Global Error Handler
app.use(errorHandler);

// Uncomment If Automated Report Mail is Needed
// require("./automatedJob/reportMail");

// Schedule Weekly Backup (Every Friday at 12:00 AM)
cron.schedule("0 0 * * 5", () => {
  console.log("Running weekly backup...");
  exec("node ./automatedJob/backup.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing weekly backup: ${error.message}`);
      return;
    }
    console.log(`Weekly backup output: ${stdout}`);
    if (stderr) {
      console.error(`Weekly backup error: ${stderr}`);
    }
  });
});

// Schedule Quarterly Backup (1st day of April, August, December at 12:00 AM)
cron.schedule("0 0 1 4,8,12 *", () => {
  console.log("Running quarterly backup...");
  exec("node ./automatedJob/backup.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing quarterly backup: ${error.message}`);
      return;
    }
    console.log(`Quarterly backup output: ${stdout}`);
    if (stderr) {
      console.error(`Quarterly backup error: ${stderr}`);
    }
  });
});

// Start Server
const start = async () => {
  try {
    await dbConnect();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
};

start();
