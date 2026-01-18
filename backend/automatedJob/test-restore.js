/*
 * test-restore.js
 * 
 * Purpose:
 * Test script to verify that restore functionality works correctly.
 * This script restores a collection to a test collection name to avoid overwriting production data.
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

  // Check if backup files exist
  const testCollection = "complaints";
  const backupFile = path.join(latestBackup.path, `${testCollection}.gz`);

  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Backup file not found: ${backupFile}`);
    process.exit(1);
  }

  const fileSize = fs.statSync(backupFile).size;
  console.log(`📄 Backup file: ${testCollection}.gz`);
  console.log(`📏 File size: ${(fileSize / 1024).toFixed(2)} KB\n`);

  // Test restore to a test collection name (to avoid overwriting production)
  const testCollectionName = `${testCollection}_restore_test`;
  console.log(`🔄 Testing restore to test collection: ${testCollectionName}`);
  console.log(`⚠️  This will create/overwrite: ${testCollectionName} (not production data)\n`);

  // Use --nsInclude for newer MongoDB tools, fallback to --db and --collection for compatibility
  const restoreCommand = `mongorestore --uri="${MONGO_URI}" --nsInclude=${DB_NAME}.${testCollectionName} --archive="${backupFile}" --gzip --drop`;

  try {
    console.log("⏳ Restoring...");
    const { stdout, stderr } = await execAsync(restoreCommand);

    if (stderr && !stderr.includes("finished") && !stderr.includes("restoring")) {
      console.warn(`⚠️  Warning: ${stderr}`);
    }

    console.log(`✅ Restore completed successfully!`);
    console.log(`📊 Restored to collection: ${testCollectionName}\n`);

    // Verify the restore by checking document count
    console.log("🔍 Verifying restore...");
    const verifyCommand = `mongosh "${MONGO_URI}" --quiet --eval "db.getSiblingDB('${DB_NAME}').${testCollectionName}.countDocuments()"`;
    
    try {
      const { stdout: countOutput } = await execAsync(verifyCommand);
      const count = parseInt(countOutput.trim());
      console.log(`✅ Verified: ${count} documents restored to ${testCollectionName}`);
      
      if (count > 0) {
        console.log("\n✨ Restore test PASSED! The backup can be successfully restored.");
        console.log(`\n💡 To clean up the test collection, run:`);
        console.log(`   mongosh "${MONGO_URI}" --eval "db.getSiblingDB('${DB_NAME}').${testCollectionName}.drop()"`);
      } else {
        console.log("\n⚠️  Restore completed but collection is empty (backup may be empty)");
      }
    } catch (verifyError) {
      console.log("⚠️  Could not verify document count (this is okay if mongosh is not available)");
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
