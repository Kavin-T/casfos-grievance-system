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
const { promisify } = require("util");
const nodemailer = require("nodemailer");

const execAsync = promisify(exec);

// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const BACKUP_DIR = path.join(__dirname, "..", "backups");
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const STORAGE_THRESHOLD = 80; // 80%

// Validate required environment variables
if (!MONGO_URI) {
  console.error("Error: MONGO_URI environment variable is not set");
  process.exit(1);
}

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Function to back up multiple collections for weekly backup
async function backupWeeklyCollections(backupName) {
  const weeklyBackupDir = path.join(BACKUP_DIR, `${backupName}_collections`);
  if (!fs.existsSync(weeklyBackupDir)) {
    fs.mkdirSync(weeklyBackupDir, { recursive: true });
  }

  const collections = ["complaints", "counters", "notifications", "users"];

  // Use Promise.all to wait for all backups to complete
  const backupPromises = collections.map(async (collection) => {
    const backupPath = path.join(weeklyBackupDir, `${collection}.gz`);
    const command = `mongodump --uri="${MONGO_URI}" --collection=${collection} --archive="${backupPath}" --gzip`;

    try {
      const { stdout, stderr } = await execAsync(command);
      if (stderr && !stderr.includes("writing")) {
        console.warn(`Warning for ${collection}: ${stderr}`);
      }
      console.log(
        `Backup completed for collection: ${collection}, saved to: ${backupPath}`
      );
    } catch (error) {
      console.error(`Error backing up ${collection}: ${error.message}`);
      throw error;
    }
  });

  await Promise.all(backupPromises);
  console.log(`Weekly backup completed: ${backupName}`);
}

// Function to back up resolved complaints and related media files for quarterly backup
async function backupResolvedComplaintsWithMedia(backupName) {
  const quarterlyBackupDir = path.join(BACKUP_DIR, `${backupName}_collections`);
  if (!fs.existsSync(quarterlyBackupDir)) {
    fs.mkdirSync(quarterlyBackupDir, { recursive: true });
  }

  const resolvedBackupPath = path.join(quarterlyBackupDir, `resolved.gz`);
  const mediaBackupPath = path.join(quarterlyBackupDir, `uploads.tar.gz`);

  try {
    // Step 1: Back up only resolved complaints
    const query = `{"status":"RESOLVED"}`; // MongoDB query to filter resolved complaints
    const command = `mongodump --uri="${MONGO_URI}" --collection=complaints --query="${query.replace(
      /"/g,
      '\\"'
    )}" --archive="${resolvedBackupPath}" --gzip`;

    try {
      const { stdout, stderr } = await execAsync(command);
      if (stderr && !stderr.includes("writing")) {
        console.warn(`Warning for resolved complaints: ${stderr}`);
      }
      console.log(`Resolved complaints backup completed: ${resolvedBackupPath}`);
    } catch (error) {
      console.error(`Error backing up resolved complaints: ${error.message}`);
      throw error;
    }

    // Step 2: Back up media files (if uploads directory exists)
    if (fs.existsSync(UPLOADS_DIR)) {
      const mediaCommand = `tar -czf "${mediaBackupPath}" -C "${UPLOADS_DIR}" .`;

      try {
        const { stdout, stderr } = await execAsync(mediaCommand);
        if (stderr && !stderr.includes("Removing leading")) {
          console.warn(`Warning for media backup: ${stderr}`);
        }
        console.log(`Media files backup completed: ${mediaBackupPath}`);
      } catch (error) {
        console.error(`Error backing up media files: ${error.message}`);
        // Don't throw - continue with collection backups even if media backup fails
      }
    } else {
      console.warn(`Uploads directory not found: ${UPLOADS_DIR}`);
    }

    // Step 3: Back up all collections
    const collections = ["complaints", "counters", "notifications", "users"];
    const collectionBackupPromises = collections.map(async (collection) => {
      const backupPath = path.join(quarterlyBackupDir, `${collection}.gz`);
      const command = `mongodump --uri="${MONGO_URI}" --collection=${collection} --archive="${backupPath}" --gzip`;

      try {
        const { stdout, stderr } = await execAsync(command);
        if (stderr && !stderr.includes("writing")) {
          console.warn(`Warning for ${collection}: ${stderr}`);
        }
        console.log(
          `Backup completed for collection: ${collection}, saved to: ${backupPath}`
        );
      } catch (error) {
        console.error(`Error backing up ${collection}: ${error.message}`);
        throw error;
      }
    });

    await Promise.all(collectionBackupPromises);
    console.log(`Quarterly backup completed: ${backupName}`);
  } catch (error) {
    console.error(`Error in quarterly backup process: ${error.message}`);
    throw error;
  }
}

// Function to calculate directory size recursively
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    console.error(`Error calculating directory size: ${error.message}`);
  }
  
  return totalSize;
}

// Function to check storage usage
function checkStorageUsage() {
  try {
    const backupSize = getDirectorySize(BACKUP_DIR);
    
    // Use a fixed threshold in bytes (e.g., 10GB = 10 * 1024 * 1024 * 1024)
    const MAX_BACKUP_SIZE = 10 * 1024 * 1024 * 1024; // 10GB threshold
    
    if (backupSize > MAX_BACKUP_SIZE) {
      const usedPercentage = (backupSize / MAX_BACKUP_SIZE) * 100;
      console.warn(`Backup directory size (${(backupSize / (1024 * 1024 * 1024)).toFixed(2)} GB) exceeds threshold`);
      notifyStorageUsage(usedPercentage);
    } else {
      const sizeInMB = backupSize / (1024 * 1024);
      const sizeInGB = backupSize / (1024 * 1024 * 1024);
      if (sizeInGB >= 1) {
        console.log(`Backup directory size: ${sizeInGB.toFixed(2)} GB`);
      } else {
        console.log(`Backup directory size: ${sizeInMB.toFixed(2)} MB`);
      }
    }
  } catch (error) {
    console.error(`Error checking storage usage: ${error.message}`);
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
async function scheduleBackups() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 5 = Friday
  const month = now.getMonth(); // 0 = January
  const isQuarterlyDate = [3, 7, 11].includes(month) && now.getDate() === 1;
  const isFriday = dayOfWeek === 5;

  try {
    // If it's both Friday and a quarterly date, prioritize quarterly backup
    if (isQuarterlyDate) {
      // Quarterly backup on the first day of April, August, December
      const backupName = `quarterly-backup-${now.toISOString().split("T")[0]}`;
      console.log(`Starting quarterly backup: ${backupName}`);
      await backupResolvedComplaintsWithMedia(backupName);
    } else if (isFriday) {
      // Weekly backup on Friday (only if not a quarterly date)
      const backupName = `weekly-backup-${now.toISOString().split("T")[0]}`;
      console.log(`Starting weekly backup: ${backupName}`);
      await backupWeeklyCollections(backupName);
    } else {
      console.log("No backup scheduled for today");
    }

    // Check storage usage
    checkStorageUsage();
  } catch (error) {
    console.error(`Error in backup scheduler: ${error.message}`);
    process.exit(1);
  }
}

// Run the backup scheduler
scheduleBackups().catch((error) => {
  console.error(`Fatal error in backup process: ${error.message}`);
  process.exit(1);
});
