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
