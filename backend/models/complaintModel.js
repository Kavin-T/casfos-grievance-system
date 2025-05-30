/*
 * complaintModel.js
 *
 * Purpose:
 * This script defines the Mongoose schema and model for complaints in an Express.js application.
 * It structures complaint data stored in a MongoDB database and includes logic for generating unique complaint IDs.
 *
 * Features:
 * - Defines a comprehensive schema for complaints with fields for complainant details, status, media, timestamps, and remarks.
 * - Enforces data validation with required fields, enumerated values, and default settings.
 * - Automatically generates a unique complaintID in the format `COMP_<departmentCode>_<number>` before saving new complaints.
 * - Supports arrays for multiple media files (images and videos) and remarks.
 * - Includes timestamps for creation, acknowledgment, resolution, and termination.
 * - Trims string fields to remove unnecessary whitespace.
 *
 * Usage:
 * Import this module in your application (e.g., `const Complaint = require('./complaintModel');`) to interact with the Complaint
 * collection in MongoDB. Use the model for CRUD operations in controllers or other modules. Ensure Mongoose is connected to the
 * database before using the model.
 *
 * Dependencies:
 * - mongoose: MongoDB object modeling tool for Node.js.
 *
 * Notes:
 * - The complaintID is generated using a department code (e.g., IT, EL, CI) and a sequential number based on existing complaints.
 * - The schema enforces valid department values (CIVIL, ELECTRICAL, IT) and status values (e.g., RAISED, RESOLVED).
 * - The price field uses Decimal128 for precise financial calculations.
 * - The pre-save middleware ensures unique complaint IDs for new documents only.
 */

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaintID: {
    type: String,
    unique: true,
  },
  complainantName: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  details: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    enum: ["CIVIL", "ELECTRICAL", "IT"],
    required: true,
  },
  premises: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  specificLocation: {
    type: String,
    trim: true,
  },
  imgBefore: {
    type: [String],
    default: [],
  },
  imgAfter: {
    type: [String],
    default: [],
  },
  vidBefore: {
    type: [String],
    default: [],
  },
  vidAfter: {
    type: [String],
    default: [],
  },
  emergency: {
    type: Boolean,
    default: false,
  },
  reRaised: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "RAISED",
    enum: [
      "RAISED",
      "JE_ACKNOWLEDGED",
      "JE_WORKDONE",
      "AE_ACKNOWLEDGED",
      "EE_ACKNOWLEDGED",
      "RESOLVED",
      "RESOURCE_REQUIRED",
      "AE_NOT_SATISFIED",
      "EE_NOT_SATISFIED",
      "CR_NOT_SATISFIED",
      "AE_NOT_TERMINATED",
      "CR_NOT_TERMINATED",
      "AE_TERMINATED",
      "EE_TERMINATED",
      "EE_NOT_TERMINATED",
      "TERMINATED",
    ],
  },
  isPriceEntered: {
    type: Boolean,
    default: false,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acknowledgeAt: {
    type: Date,
    default: null,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  terminatedAt: {
    type: Date,
    default: null,
  },
  remark_AE: {
    type: String,
    trim: true,
    default: null,
  },
  remark_EE: {
    type: String,
    trim: true,
    default: null,
  },
  remark_JE: {
    type: String,
    trim: true,
    default: null,
  },
  remark_CR: {
    type: String,
    trim: true,
    default: null,
  },
  multiple_remark_ae: {
    type: [{ type: String, trim: true }],
    default: [],
  },
  multiple_remark_ee: {
    type: [{ type: String, trim: true }],
    default: [],
  },
  resolvedName: {
    type: String,
    trim: true,
    default: null,
  },
});

// Pre-save middleware to generate complaintID
complaintSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const departmentCode = getDepartmentCode(this.department);
  const Complaint = mongoose.model("Complaint");

  // Count existing complaints for the department
  const count = await Complaint.countDocuments({ department: this.department });

  // Generate complaintID in the required format
  this.complaintID = `COMP_${departmentCode}_${String(count + 1)}`;
  next();
});

// Helper function to get department code
const getDepartmentCode = (department) => {
  switch (department.toUpperCase()) {
    case "IT":
      return "IT";
    case "ELECTRICAL":
      return "EL";
    case "CIVIL":
      return "CI";
    default:
      return "OT"; // Default code for other departments
  }
};

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
