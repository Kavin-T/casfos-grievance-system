const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Complaint = require("../models/complaintModel");
const getQuery = require("../helper/queryHelper");
const { sendComplaintRaisedMail } = require("../middleware/emailHandler");

const addComplaint = asyncHandler(async (req, res) => {
  const {
    complainantName,
    subject,
    date,
    details,
    department,
    premises,
    location,
    specificLocation,
    emergency,
  } = req.body;

  if (
    !complainantName ||
    !subject ||
    !date ||
    !details ||
    !department ||
    !premises ||
    !location
  ) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  const isEmergency = emergency === "true";

  const newComplaint = new Complaint({
    complainantName,
    subject,
    date: new Date(date),
    details,
    department,
    premises,
    location,
    specificLocation,
    emergency: isEmergency,
  });

  const savedComplaint = await newComplaint.save();
  const complaintID = savedComplaint.complaintID;

  const uploadsDir = path.resolve(__dirname, "../uploads");
  const complaintDir = path.join(uploadsDir, `${complaintID}`);
  fs.mkdirSync(complaintDir, { recursive: true });

  let imgBeforePaths = [];
  let vidBeforePaths = [];

  Object.keys(req.files).forEach((key) => {
    if (key.startsWith("imgBefore")) {
      const file = req.files[key][0];
      const imgBeforeFileName = `${key}_${complaintID}.jpg`;
      const imgBeforeFullPath = path.join(complaintDir, imgBeforeFileName);
      fs.renameSync(file.path, imgBeforeFullPath);
      imgBeforePaths.push(`uploads/${complaintID}/${imgBeforeFileName}`);
    }
  });

  Object.keys(req.files).forEach((key) => {
    if (key.startsWith("vidBefore")) {
      const file = req.files[key][0];
      const vidBeforeFileName = `${key}_${complaintID}.mp4`;
      const vidBeforeFullPath = path.join(complaintDir, vidBeforeFileName);
      fs.renameSync(file.path, vidBeforeFullPath);
      vidBeforePaths.push(`uploads/${complaintID}/${vidBeforeFileName}`);
    }
  });

  savedComplaint.imgBefore = imgBeforePaths;
  savedComplaint.vidBefore = vidBeforePaths;
  await savedComplaint.save();

  sendComplaintRaisedMail(savedComplaint._id);

  res.status(200).json({
    message: "Complaint added successfully.",
    complaint: savedComplaint,
  });
});

const fetchComplaints = asyncHandler(async (req, res) => {
  const query = getQuery(req.query);
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const complaints = await Complaint.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalCount = await Complaint.countDocuments(query);

  res.status(200).json({
    totalCount,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(totalCount / limit),
    complaints,
  });
});

const yourActivity = asyncHandler(async (req, res) => {
  const designation = req.user.designation;

  if (!designation) {
    res.status(400);
    throw new Error("Designation is required");
  }

  let statuses = [];
  let departmentQuery = null;

  switch (designation) {
    case "PRINCIPAL":
    case "ESTATE_OFFICER":
    case "ASSISTANT_TO_ESTATE_OFFICER":
    case "COMPLAINANT":
      statuses = ["EE_ACKNOWLEDGED","EE_TERMINATED","JE_WORKDONE"];
      break;

    case "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL":
      statuses = ["AE_ACKNOWLEDGED","AE_TERMINATED","CR_NOT_SATISFIED","CR_NOT_TERMINATED"];
      departmentQuery = { $in: ["CIVIL", "ELECTRICAL"] };
      break;

    case "EXECUTIVE_ENGINEER_IT":
      statuses = ["AE_ACKNOWLEDGED","AE_TERMINATED","CR_NOT_SATISFIED","CR_NOT_TERMINATED"];
      departmentQuery = "IT";
      break;

    case "ASSISTANT_ENGINEER_CIVIL":
      statuses = ["JE_WORKDONE", "EE_NOT_SATISFIED", "RESOURCE_REQUIRED","EE_NOT_TERMINATED","CR_NOT_SATISFIED"];
      departmentQuery = "CIVIL";
      break;

    case "ASSISTANT_ENGINEER_ELECTRICAL":
      statuses = ["JE_WORKDONE", "EE_NOT_SATISFIED", "RESOURCE_REQUIRED","EE_NOT_TERMINATED","CR_NOT_SATISFIED"];
      departmentQuery = "ELECTRICAL";
      break;

    case "ASSISTANT_ENGINEER_IT":
      statuses = ["JE_WORKDONE", "EE_NOT_SATISFIED", "RESOURCE_REQUIRED","EE_NOT_TERMINATED","CR_NOT_SATISFIED"];
      departmentQuery = "IT";
      break;

    case "JUNIOR_ENGINEER_CIVIL":
      statuses = ["RAISED", "JE_ACKNOWLEDGED", "AE_NOT_SATISFIED","AE_NOT_TERMINATED","CR_NOT_SATISFIED"];
      departmentQuery = "CIVIL";
      break;

    case "JUNIOR_ENGINEER_ELECTRICAL":
      statuses = ["RAISED", "JE_ACKNOWLEDGED", "AE_NOT_SATISFIED","AE_NOT_TERMINATED","CR_NOT_SATISFIED"];
      departmentQuery = "ELECTRICAL";
      break;

    case "JUNIOR_ENGINEER_IT":
      statuses = ["RAISED", "JE_ACKNOWLEDGED", "AE_NOT_SATISFIED","AE_NOT_TERMINATED","CR_NOT_SATISFIED"];
      departmentQuery = "IT";
      break;

    default:
      res.status(403);
      throw new Error("Invalid designation");
  }

  const query = {
    status: { $in: statuses },
  };

  if (departmentQuery) {
    query.department = departmentQuery;
  }

  const complaints = await Complaint.find(query).sort({
    emergency: -1,
    createdAt: -1,
  });

  res.status(200).json(complaints);
});

const getComplaintStatistics = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.query;

  if (!fromDate) {
    res.status(400);
    throw new Error("Start date (fromDate) is required.");
  }

  const startDate = new Date(fromDate);
  startDate.setHours(0, 0, 0, 0); 

  const endDate = new Date(toDate || new Date().toISOString());
  endDate.setHours(23, 59, 59, 999); 

  let match = {
    createdAt: {
      $gte: startDate, 
      $lte: endDate, 
    },
  };

  const statistics = await Complaint.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$department",
        totalComplaints: { $sum: 1 },
        pendingComplaints: {
          $sum: { $cond: [{ $ne: ["$status", "RESOLVED"] }, 1, 0] },
        },
        resolvedComplaints: {
          $sum: { $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0] },
        },
        totalPrice: { $sum: { $toDouble: "$price" } },
      },
    },
    {
      $group: {
        _id: null,
        totalComplaints: { $sum: "$totalComplaints" },
        pendingComplaints: { $sum: "$pendingComplaints" },
        resolvedComplaints: { $sum: "$resolvedComplaints" },
        departmentWise: {
          $push: {
            department: "$_id",
            pending: "$pendingComplaints",
            resolved: "$resolvedComplaints",
            price: "$totalPrice",
          },
        },
        totalPrice: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        totalComplaints: 1,
        pendingComplaints: 1,
        resolvedComplaints: 1,
        departmentWise: 1,
        totalPrice: 1,
      },
    },
  ]);

  res.json(
    statistics[0] || {
      totalComplaints: 0,
      pendingComplaints: 0,
      resolvedComplaints: 0,
      departmentWise: [],
      totalPrice: 0,
    }
  );
});

const fetchComplaintsWithPriceLater = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({
      isPriceEntered: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(complaints);
});

module.exports = {
  addComplaint,
  fetchComplaints,
  yourActivity,
  getComplaintStatistics,
  fetchComplaintsWithPriceLater,
};
