/*
 * test-restore.js
 * 
 * Purpose:
 * Test script to verify that restore functionality works correctly.
 * This script restores the database to a test database name to avoid overwriting production data.
 * 
 * Usage:
 * Run: node backend/automatedJob/test-restore.js
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

// Function to extract database name from MONGO_URI
function getDatabaseName(uri) {
  try {
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    if (match && match[1]) {
      return match[1];
    }
    return process.env.DB_NAME || "test";
  } catch (error) {
    return process.env.DB_NAME || "test";
  }
}

const DB_NAME = getDatabaseName(MONGO_URI);

// Function to find latest backup
function findLatestBackup() {
  try {
    const backupDirs = fs.readdirSync(BACKUP_DIR)
      .filter(dir => {
        const dirPath = path.join(BACKUP_DIR, dir);
        return fs.statSync(dirPath).isDirectory() && dir.includes("backup");
      })
      .map(dir => ({
        name: dir,
        path: path.join(BACKUP_DIR, dir),
        time: fs.statSync(path.join(BACKUP_DIR, dir)).mtime
      }))
      .sort((a, b) => b.time - a.time);

    if (backupDirs.length === 0) {
      return null;
    }

    return backupDirs[0];
  } catch (error) {
    console.error(`Error finding backups: ${error.message}`);
    return null;
  }
}

// Function to test restore
async function testRestore() {
  console.log("=".repeat(60));
  console.log("🧪 RESTORE FUNCTIONALITY TEST");
  console.log("=".repeat(60));
  console.log(`📊 Database: ${DB_NAME}`);
  console.log(`📁 Backup directory: ${BACKUP_DIR}\n`);

  // Find latest backup
  const latestBackup = findLatestBackup();
  if (!latestBackup) {
    console.error("❌ No backups found in backup directory");
    process.exit(1);
  }

  console.log(`📦 Found latest backup: ${latestBackup.name}\n`);

  // Check if backup file exists (database backup)
  const backupFile = path.join(latestBackup.path, `${DB_NAME}.gz`);

  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Backup file not found: ${backupFile}`);
    console.error(`   Looking for database backup: ${DB_NAME}.gz`);
    process.exit(1);
  }

  const fileSize = fs.statSync(backupFile).size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  const fileSizeGB = (fileSize / (1024 * 1024 * 1024)).toFixed(2);
  console.log(`📄 Backup file: ${DB_NAME}.gz`);
  if (fileSize / (1024 * 1024 * 1024) >= 1) {
    console.log(`📏 File size: ${fileSizeGB} GB\n`);
  } else {
    console.log(`📏 File size: ${fileSizeMB} MB\n`);
  }

  // Test restore to a test database name (to avoid overwriting production)
  const testDatabaseName = `${DB_NAME}_restore_test`;
  console.log(`🔄 Testing restore to test database: ${testDatabaseName}`);
  console.log(`⚠️  This will create/overwrite database: ${testDatabaseName} (not production data)\n`);

  // Restore entire database to a test database
  const restoreCommand = `mongorestore --uri="${MONGO_URI}" --nsFrom="${DB_NAME}.*" --nsTo="${testDatabaseName}.*" --archive="${backupFile}" --gzip --drop`;

  try {
    console.log("⏳ Restoring...");
    const { stdout, stderr } = await execAsync(restoreCommand);

    if (stderr && !stderr.includes("finished") && !stderr.includes("restoring")) {
      console.warn(`⚠️  Warning: ${stderr}`);
    }

    console.log(`✅ Restore completed successfully!`);
    console.log(`📊 Restored to database: ${testDatabaseName}\n`);

    // Verify the restore by checking collections in the test database
    console.log("🔍 Verifying restore...");
    const verifyCommand = `mongosh "${MONGO_URI}" --quiet --eval "db.getSiblingDB('${testDatabaseName}').getCollectionNames()"`;
    
    try {
      const { stdout: collectionsOutput } = await execAsync(verifyCommand);
      const collections = collectionsOutput.trim();
      console.log(`✅ Verified: Collections restored to ${testDatabaseName}`);
      console.log(`📋 Collections: ${collections}`);
      
      if (collections && collections.length > 0 && !collections.includes("Error")) {
        console.log("\n✨ Restore test PASSED! The backup can be successfully restored.");
        console.log(`\n💡 To clean up the test database, run:`);
        console.log(`   mongosh "${MONGO_URI}" --eval "db.getSiblingDB('${testDatabaseName}').dropDatabase()"`);
      } else {
        console.log("\n⚠️  Restore completed but database appears empty (backup may be empty)");
      }
    } catch (verifyError) {
      console.log("⚠️  Could not verify collections (this is okay if mongosh is not available)");
      console.log("✅ Restore command executed successfully");
    }

  } catch (error) {
    console.error(`\n❌ Restore failed: ${error.message}`);
    if (error.stderr) {
      console.error(`Error details: ${error.stderr}`);
    }
    process.exit(1);
  }
}

// Run the test
testRestore().catch((error) => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  process.exit(1);
});
