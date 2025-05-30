/*
 * backup.js
 *
 * Purpose:
 * This script automates the backup process for a MongoDB database and associated media files.
 * It performs scheduled weekly and quarterly backups, monitors storage usage, and sends email
 * notifications if storage exceeds a defined threshold.
 *
 * Features:
 * - Weekly backups of specified MongoDB collections ('complaints', 'counters', 'notifications', 'users') every Friday.
 * - Quarterly backups of resolved complaints and related media files on the first day of April, August, and December.
 * - Creates compressed (.gz) backups of MongoDB collections using mongodump.
 * - Archives media files from the uploads directory into a .zip file for quarterly backups.
 * - Monitors storage usage of the backup directory and sends an email alert if usage exceeds 80%.
 * - Uses environment variables (MONGO_URI, GMAIL_USER, GMAIL_PASSWORD) for configuration.
 * - Ensures the backup directory exists before performing operations.
 *
 * Dependencies:
 * - Node.js modules: path, fs, child_process, nodemailer
 * - External tool: mongodump (MongoDB tools)
 * - Environment variables loaded from a .env file located one directory level up
 *
 * Usage:
 * Run this script using Node.js (e.g., `node backup.js`) to execute the backup scheduler.
 * Ensure the .env file is properly configured with MONGO_URI, GMAIL_USER, and GMAIL_PASSWORD.
 * The script checks the current date to determine if a weekly or quarterly backup is needed and
 * performs storage usage checks automatically.
 */

const path = require("path"); // Import path module first
require("dotenv").config({ path: path.join(__dirname, "..", ".env") }); // Explicitly load environment variables from .env
const fs = require("fs");
const { exec } = require("child_process");
const nodemailer = require("nodemailer");

// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const BACKUP_DIR = path.join(__dirname, "..", "backups");
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const STORAGE_THRESHOLD = 80; // 80%

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Function to back up multiple collections for weekly backup
async function backupWeeklyCollections(backupName) {
  const weeklyBackupDir = path.join(BACKUP_DIR, `${backupName}_collections`);
  if (!fs.existsSync(weeklyBackupDir)) {
    fs.mkdirSync(weeklyBackupDir);
  }

  const collections = ["complaints", "counters", "notifications", "users"];

  collections.forEach((collection) => {
    const backupPath = path.join(weeklyBackupDir, `${collection}.gz`);
    const command = `mongodump --uri="${MONGO_URI}" --collection=${collection} --archive="${backupPath}" --gzip`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error backing up ${collection}: ${error.message}`);
        return;
      }
      console.log(
        `Backup completed for collection: ${collection}, saved to: ${backupPath}`
      );
    });
  });
}

// Function to back up resolved complaints and related media files for quarterly backup
async function backupResolvedComplaintsWithMedia(backupName) {
  const quarterlyBackupDir = path.join(BACKUP_DIR, `${backupName}_collections`);
  if (!fs.existsSync(quarterlyBackupDir)) {
    fs.mkdirSync(quarterlyBackupDir);
  }

  const resolvedBackupPath = path.join(quarterlyBackupDir, `resolved.gz`);
  const mediaBackupPath = path.join(quarterlyBackupDir, `uploads.zip`);

  // Step 1: Back up only resolved complaints
  const query = `{"status":"RESOLVED"}`; // MongoDB query to filter resolved complaints
  const command = `mongodump --uri="${MONGO_URI}" --collection=complaints --query="${query.replace(
    /"/g,
    '\\"'
  )}" --archive="${resolvedBackupPath}" --gzip`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error backing up resolved complaints: ${error.message}`);
      return;
    }
    console.log(`Resolved complaints backup completed: ${resolvedBackupPath}`);

    // Step 2: Back up media files
    const mediaCommand = `tar -czf "${mediaBackupPath}" -C "${UPLOADS_DIR}" .`;

    exec(mediaCommand, (mediaError, mediaStdout, mediaStderr) => {
      if (mediaError) {
        console.error(`Error backing up media files: ${mediaError.message}`);
        return;
      }
      console.log(`Media files backup completed: ${mediaBackupPath}`);
    });
  });

  // Step 3: Back up all collections
  const collections = ["complaints", "counters", "notifications", "users"];
  collections.forEach((collection) => {
    const backupPath = path.join(quarterlyBackupDir, `${collection}.gz`);
    const command = `mongodump --uri="${MONGO_URI}" --collection=${collection} --archive="${backupPath}" --gzip`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error backing up ${collection}: ${error.message}`);
        return;
      }
      console.log(
        `Backup completed for collection: ${collection}, saved to: ${backupPath}`
      );
    });
  });
}

// Function to check storage usage
function checkStorageUsage() {
  const { size: totalSize } = fs.statSync(BACKUP_DIR);
  const usedPercentage = (totalSize / fs.statSync("/").size) * 100;

  if (usedPercentage > STORAGE_THRESHOLD) {
    notifyStorageUsage(usedPercentage);
  }
}

// Function to send notification
function notifyStorageUsage(usedPercentage) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "admin_email@gmail.com", // Replace with the admin email
    subject: "Backup Storage Alert",
    text: `Warning: Backup storage usage has exceeded ${STORAGE_THRESHOLD}%. Current usage: ${usedPercentage.toFixed(
      2
    )}%.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email: ${error.message}`);
      return;
    }
    console.log(`Storage alert email sent: ${info.response}`);
  });
}

// Schedule weekly and quarterly backups
function scheduleBackups() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 5 = Friday
  const month = now.getMonth(); // 0 = January

  if (dayOfWeek === 5) {
    // Weekly backup on Friday
    const backupName = `weekly-backup-${now.toISOString().split("T")[0]}`;
    backupWeeklyCollections(backupName);
  }

  if ([3, 7, 11].includes(month) && now.getDate() === 1) {
    // Quarterly backup on the first day of April, August, December
    const backupName = `quarterly-backup-${now.toISOString().split("T")[0]}`;
    backupResolvedComplaintsWithMedia(backupName);
  }

  // Check storage usage
  checkStorageUsage();
}

// Run the backup scheduler
scheduleBackups();
