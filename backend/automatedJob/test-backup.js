/*
 * test-backup.js
 * 
 * Purpose:
 * Test script to manually trigger a weekly backup for testing purposes.
 * This bypasses the day-of-week check and forces a weekly backup to run.
 * 
 * Usage:
 * Run: node backend/automatedJob/test-backup.js
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const BACKUP_DIR = path.join(__dirname, "..", "backups");

// Validate required environment variables
if (!MONGO_URI) {
  console.error("Error: MONGO_URI environment variable is not set");
  process.exit(1);
}

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Function to extract database name from MONGO_URI
function getDatabaseName(uri) {
  try {
    // Try to extract database name from URI
    // Format: mongodb://.../database or mongodb+srv://.../database
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    if (match && match[1]) {
      return match[1];
    }
    // If no database in URI, try to get from DB_NAME env var or use default
    return process.env.DB_NAME || "test";
  } catch (error) {
    return process.env.DB_NAME || "test";
  }
}

const DB_NAME = getDatabaseName(MONGO_URI);
console.log(`📊 Using database: ${DB_NAME}\n`);

// Function to back up multiple collections for weekly backup (same as backup.js)
async function backupWeeklyCollections(backupName) {
  const weeklyBackupDir = path.join(BACKUP_DIR, `${backupName}_collections`);
  if (!fs.existsSync(weeklyBackupDir)) {
    fs.mkdirSync(weeklyBackupDir, { recursive: true });
  }

  const collections = ["complaints", "counters", "notifications", "users"];

  console.log(`\n🚀 Starting test weekly backup...`);
  console.log(`📁 Backup directory: ${weeklyBackupDir}\n`);

  // Use Promise.all to wait for all backups to complete
  const backupPromises = collections.map(async (collection) => {
    const backupPath = path.join(weeklyBackupDir, `${collection}.gz`);
    const command = `mongodump --uri="${MONGO_URI}" --db=${DB_NAME} --collection=${collection} --archive="${backupPath}" --gzip`;

    try {
      console.log(`⏳ Backing up collection: ${collection}...`);
      const { stdout, stderr } = await execAsync(command);
      if (stderr && !stderr.includes("writing")) {
        console.warn(`⚠️  Warning for ${collection}: ${stderr}`);
      }
      console.log(`✅ Backup completed for collection: ${collection}`);
      console.log(`   Saved to: ${backupPath}\n`);
    } catch (error) {
      console.error(`❌ Error backing up ${collection}: ${error.message}`);
      throw error;
    }
  });

  await Promise.all(backupPromises);
  console.log(`\n✨ Weekly backup completed successfully: ${backupName}`);
  console.log(`📂 All backups saved in: ${weeklyBackupDir}\n`);
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
    const sizeInMB = backupSize / (1024 * 1024);
    const sizeInGB = backupSize / (1024 * 1024 * 1024);
    
    if (sizeInGB >= 1) {
      console.log(`📊 Total backup directory size: ${sizeInGB.toFixed(2)} GB`);
    } else {
      console.log(`📊 Total backup directory size: ${sizeInMB.toFixed(2)} MB`);
    }
  } catch (error) {
    console.error(`Error checking storage usage: ${error.message}`);
  }
}

// Main test function
async function testWeeklyBackup() {
  const now = new Date();
  const backupName = `test-weekly-backup-${now.toISOString().split("T")[0]}-${Date.now()}`;
  
  try {
    await backupWeeklyCollections(backupName);
    checkStorageUsage();
    console.log("\n✅ Test backup completed successfully!\n");
  } catch (error) {
    console.error(`\n❌ Error in test backup: ${error.message}\n`);
    process.exit(1);
  }
}

// Run the test
console.log("=".repeat(60));
console.log("🧪 WEEKLY BACKUP TEST SCRIPT");
console.log("=".repeat(60));
testWeeklyBackup();
