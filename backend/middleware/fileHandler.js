/*
 * fileHandler.js
 *
 * Purpose:
 * This script provides middleware and utilities for handling file uploads in an Express.js application.
 * It configures Multer for file storage and ensures a temporary upload directory exists for storing uploaded files.
 *
 * Features:
 * - ensureTempDirectory: Middleware that checks and creates a temporary upload directory if it does not exist.
 * - upload: Multer configuration for handling file uploads, with custom storage settings and file size limits.
 * - Stores uploaded files in a temporary directory with unique filenames to avoid conflicts.
 * - Limits file uploads to 100MB per file.
 *
 * Usage:
 * Import this module in your Express.js application (e.g., `const { ensureTempDirectory, upload } = require('./fileHandler');`)
 * and use `ensureTempDirectory` as middleware before routes that handle file uploads. Use `upload` (e.g., `upload.fields([...])`)
 * to process file uploads in routes. Ensure the Uploads/temp directory is accessible and writable.
 *
 * Dependencies:
 * - express-async-handler: Simplifies error handling for async Express middleware.
 * - path: Node.js module for handling file paths.
 * - fs: Node.js module for file system operations.
 * - multer: Middleware for handling multipart/form-data file uploads.
 *
 * Notes:
 * - The temporary upload directory is set to `../Uploads/temp` relative to the script's location.
 * - Filenames are generated with a unique suffix (timestamp + random number) to prevent overwrites.
 * - The file size limit is set to 100MB; adjust `limits.fileSize` as needed.
 * - The `ensureTempDirectory` middleware should be used before Multer to ensure the directory exists.
 */

const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const tempUploadDir = path.resolve(__dirname, "../uploads/temp");

// Middleware to ensure temporary upload directory exists
const ensureTempDirectory = asyncHandler(async (req, res, next) => {
  if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
  }
  next();
});

// Configure Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize Multer with storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = {
  ensureTempDirectory,
  upload,
};
