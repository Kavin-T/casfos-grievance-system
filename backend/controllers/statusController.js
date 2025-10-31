/*
 * StatusController.js
 *
 * Purpose:
 * This script defines controller functions for managing complaint workflows in an Express.js application.
 * It handles state transitions for complaints, including acknowledgment, work completion, resolution, termination, and department changes.
 *
 * Features:
 * - Manages complaint status transitions (e.g., RAISED to JE_ACKNOWLEDGED, JE_WORKDONE to RESOLVED).
 * - Supports file uploads for images and videos to document work done.
 * - Updates notifications for each state change.
 * - Sends email notifications when complaints are raised or departments are changed.
 * - Handles role-based complaint management for Junior Engineers (JE), Assistant Engineers (AE), Executive Engineers (EE), and Complainants (CR).
 * - Supports IT and non-IT department-specific messaging.
 *
 * Usage:
 * Import and use these functions in your route definitions (e.g., `router.post('/raised-to-je-acknowledged', raisedToJeAcknowledged);`).
 * Ensure middleware like `express-async-handler` is configured for error handling.
 *
 * Dependencies:
 * - express-async-handler: Wraps async route handlers to catch errors.
 * - path: Node.js module for handling file paths.
 * - fs: Node.js module for file system operations.
 * - Complaint: Mongoose model for complaint data.
 * - notificationController: Updates notifications for complaint status changes.
 * - emailHandler: Sends emails for complaint-related events.
 */
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Complaint = require("../models/complaintModel");
const { updateNotification } = require("./notificationController");
const { sendComplaintRaisedMail } = require("../middleware/emailHandler");

// Helper to add remarks to the complaint's remarks array
function addRemarkToComplaint(complaint, remark) {
  if (remark) {
    if (!Array.isArray(complaint.remarks)) complaint.remarks = [];
    if (Array.isArray(remark)) {
      complaint.remarks.push(...remark);
    } else {
      complaint.remarks.push(remark);
    }
  }
}

// raisedToJeAcknowledged: Acknowledges a complaint by a Junior Engineer (JE) or System Analyst (SA).
const raisedToJeAcknowledged = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  const username = req.user.username;

  if (!username) {
    res.status(400);
    throw new Error("Username required.");
    const { id, remark } = req.body;
}


  if (!id) {
    res.status(400);
    throw new Error("ID required.");
  }

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  if (
    complaint.status === "JE_ACKNOWLEDGED" ||
    complaint.status === "RESOURCE_REQUIRED"
  ) {
    return res.status(200).json({
      message: "Complaint already acknowledged.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "JE_ACKNOWLEDGED";
  complaint.status = "JE_ACKNOWLEDGED";
  complaint.acknowledgeAt = new Date();
  complaint.resolvedName = username;

  await complaint.save();
  if (complaint.department === "IT") {
    msg = "Complaint is ACKNOWLEDGED by SYSTEM ANALYST(SA)";
  } else {
    msg = "Complaint is ACKNOWLEDGED by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// jeAcknowledgedToJeWorkdone: Marks a complaint as work completed by JE or SA with file uploads.
const jeAcknowledgedToJeWorkdone = asyncHandler(async (req, res) => {
  const id = req.body.id;
  let remark = req.body.remark;
  if (typeof remark === "string") {
    try {
      remark = JSON.parse(remark);
    } catch (e) {
      remark = [];
    }
  }

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "JE_WORKDONE") {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  const complaintID = complaint.complaintID;

  const uploadsDir = path.resolve(__dirname, "../uploads");
  const complaintDir = path.join(uploadsDir, `${complaintID}`);
  fs.mkdirSync(complaintDir, { recursive: true });

  let imgAfterPaths = [];
  let vidAfterPaths = [];

  Object.keys(req.files).forEach((key) => {
    if (key.startsWith("imgAfter")) {
      const file = req.files[key][0];
      const imgAfterFileName = `${key}_${complaintID}.jpg`;
      const imgAfterFullPath = path.join(complaintDir, imgAfterFileName);
      fs.renameSync(file.path, imgAfterFullPath);
      imgAfterPaths.push(`uploads/${complaintID}/${imgAfterFileName}`);
    }
  });

  Object.keys(req.files).forEach((key) => {
    if (key.startsWith("vidAfter")) {
      const file = req.files[key][0];
      const vidAfterFileName = `${key}_${complaintID}.mp4`;
      const vidAfterFullPath = path.join(complaintDir, vidAfterFileName);
      fs.renameSync(file.path, vidAfterFullPath);
      vidAfterPaths.push(`uploads/${complaintID}/${vidAfterFileName}`);
    }
  });

  complaint.imgAfter = imgAfterPaths;
  complaint.vidAfter = vidAfterPaths;
  let msg = "";
  let sts = "JE_WORKDONE";
  complaint.status = "JE_WORKDONE";

  await complaint.save();

  if (complaint.department === "IT") {
    msg = "Work Done by SYSTEM ANALYST(SA)";
  } else {
    msg = "Work Done by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// crNotSatisfiedToJeWorkdone: Reprocesses a complaint marked as CR_NOT_SATISFIED by JE or SA.
const crNotSatisfiedToJeWorkdone = asyncHandler(async (req, res) => {
  const id = req.body.id;
  let remark = req.body.remark;
  if (typeof remark === "string") {
    try {
      remark = JSON.parse(remark);
    } catch (e) {
      remark = [];
    }
  }

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "JE_WORKDONE") {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  const complaintID = complaint.complaintID;

  const uploadsDir = path.resolve(__dirname, "../uploads");
  const complaintDir = path.join(uploadsDir, `${complaintID}`);
  fs.mkdirSync(complaintDir, { recursive: true });

  let imgAfterPaths = [];
  let vidAfterPaths = [];

  Object.keys(req.files).forEach((key) => {
    if (key.startsWith("imgAfter")) {
      const file = req.files[key][0];
      const imgAfterFileName = `${key}_${complaintID}.jpg`;
      const imgAfterFullPath = path.join(complaintDir, imgAfterFileName);
      fs.renameSync(file.path, imgAfterFullPath);
      imgAfterPaths.push(`uploads/${complaintID}/${imgAfterFileName}`);
    }
  });

  Object.keys(req.files).forEach((key) => {
    if (key.startsWith("vidAfter")) {
      const file = req.files[key][0];
      const vidAfterFileName = `${key}_${complaintID}.mp4`;
      const vidAfterFullPath = path.join(complaintDir, vidAfterFileName);
      fs.renameSync(file.path, vidAfterFullPath);
      vidAfterPaths.push(`uploads/${complaintID}/${vidAfterFileName}`);
    }
  });

  complaint.imgAfter = imgAfterPaths;
  complaint.vidAfter = vidAfterPaths;
  let msg = "";
  let sts = "JE_WORKDONE";
  complaint.status = "JE_WORKDONE";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "Re-Work done by SYSTEM ANALYST(SA)";
  } else {
    msg = "Re-Work done by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// jeWorkDoneToAeAcknowledged: Approves a complaint's work by Assistant Engineer (AE) or Officer in Charge (OC).
const jeWorkDoneToAeAcknowledged = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "AE_ACKNOWLEDGED" ||
    complaint.status === "AE_NOT_SATISFIED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "AE_ACKNOWLEDGED";
  complaint.status = "AE_ACKNOWLEDGED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "Complaint is APPROVED by OFFICER in CHARGE(OC)";
  } else {
    msg = "Complaint is APPROVED by ASSISTANT ENGINEER(AE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// jeWorkDoneToResolved: Marks a complaint as fully resolved after JE or SA work completion.
const jeWorkDoneToResolved = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "RESOLVED" ||
    complaint.status === "CR_NOT_SATISFIED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "Complaint is RESOLVED";
  let sts = "RESOLVED";
  complaint.status = "RESOLVED";
  await complaint.save();

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to RESOLVED successfully.",
    complaint,
  });
});

// jeWorkDoneToCrNotSatisfied: Marks a complaint as unsatisfactory by the complainant (CR).
const jeWorkDoneToCrNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and CR remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "RESOLVED" ||
    complaint.status === "CR_NOT_SATISFIED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }
  complaint.reRaised = true;
  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "CR_NOT_SATISFIED";
  complaint.status = "CR_NOT_SATISFIED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "Complainant is not Satisfied with the work done by SYSTEM ANALYST(SA)";
  } else {
    msg = "Complainant is not satisfied with the word done by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// aeNotTerminatedToRaised: Reverts a non-terminated complaint to RAISED status.
const aeNotTerminatedToRaised = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "RAISED" ||
    complaint.status === "RESOURCE_REQUIRED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "Complaint is RAISED again";
  let sts = "RAISED";
  complaint.status = "RAISED";
  await complaint.save();

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// eeTerminatedToTerminated: Finalizes a complaint as TERMINATED by Executive Engineer (EE).
const eeTerminatedToTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "TERMINATED" || complaint.status === "CR_NOT_TERMINATED") {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "Complaint is TERMINATED";
  let sts = "TERMINATED";
  complaint.status = "TERMINATED";
  await complaint.save();

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// aeAcknowledgedToEeAcknowledged: Approves a complaint by Executive Engineer (EE) or resolves it for IT department.
const aeAcknowledgedToEeAcknowledged = asyncHandler(async (req, res) => {
  const { id, price, priceLater, remark } = req.body;
  const designation = req.user.designation;

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  if (!priceLater && (price === undefined || !price)) {
    res.status(400);
    throw new Error("Price is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  addRemarkToComplaint(complaint, remark);

  if (!priceLater) {
    complaint.price = price;
  }
  else {
    complaint.priceLater = true;
  }

  if (designation === "EXECUTIVE_ENGINEER_IT") {
    complaint.status = "RESOLVED";
    complaint.resolvedAt = new Date();
    await complaint.save();

    updateNotification(
      complaint.complaintID,
      complaint.subject,
      "RESOLVED",
      "Complaint is RESOLVED by HEAD OF OFFICE (IT)"
    );

    return res.status(200).json({
      message: "Complaint status updated to RESOLVED successfully.",
      complaint,
    });
  }

  if (
    complaint.status === "EE_ACKNOWLEDGED" ||
    complaint.status === "EE_NOT_SATISFIED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  complaint.status = "EE_ACKNOWLEDGED";
  await complaint.save();

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    "EE_ACKNOWLEDGED",
    "Complaint is APPROVED by EXECUTIVE ENGINEER"
  );

  res.status(200).json({
    message: "Complaint status updated to EE ACKNOWLEDGED successfully.",
    complaint,
  });
});

// eeAcknowledgedToResolved: Marks a complaint as fully resolved after EE acknowledgment.
const eeAcknowledgedToResolved = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "RESOLVED") {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "Complaint is RESOLVED";
  let sts = "RESOLVED";
  complaint.status = "RESOLVED";
  complaint.resolvedAt = new Date();
  await complaint.save();

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to RESOLVED successfully.",
    complaint,
  });
});

// aeNotTerminatedToResourceRequired: Requests resources for a non-terminated complaint by JE or SA.
const aeNotTerminatedToResourceRequired = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and JE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "RAISED" ||
    complaint.status === "RESOURCE_REQUIRED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "RESOURCE_REQUIRED";
  complaint.status = "RESOURCE_REQUIRED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "SYSTEM ANALYST(SA) is requesting for RESOURCES";
  } else {
    msg = "JUNIOR ENGINEER(JE) is requesting for RESOURCES";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to RESOURCE REQUIRED successfully.",
    complaint,
  });
});

// resourceRequiredToAeNotTerminated: Cancels a resource request by Assistant Engineer (AE) or Officer in Charge.
const resourceRequiredToAeNotTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and AE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "AE_TERMINATED" ||
    complaint.status === "AE_NOT_TERMINATED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "AE_NOT_TERMINATED";
  complaint.status = "AE_NOT_TERMINATED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "OFFICER in CHARGE cancels the RESOURCE REQUIRED request";
  } else {
    msg = "ASSISTANT ENGINEER cancels the RESOURCE REQUIRED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// resourceRequiredToAeTerminated: Approves a resource request by Assistant Engineer (AE) or Officer in Charge.
const resourceRequiredToAeTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and AE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "AE_TERMINATED" ||
    complaint.status === "AE_NOT_TERMINATED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "AE_TERMINATED";
  complaint.status = "AE_TERMINATED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "OFFICER in CHARGE accepts the RESOURCE REQUIRED request";
  } else {
    msg = "ASSISTANT ENGINEER accepts the RESOURCE REQUIRED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// aeTerminatedToEeNotTerminated: Rejects a termination request by Executive Engineer (EE) or Head of Office.
const aeTerminatedToEeNotTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and EE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "EE_TERMINATED" ||
    complaint.status === "EE_NOT_TERMINATED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "EE_NOT_TERMINATED";
  complaint.status = "EE_NOT_TERMINATED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "HEAD of OFFICE cancels the complaint TERMINATED request";
  } else {
    msg = "EXECUTIVE ENGINEER cancels the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// eeTerminatedToCrNotTerminated: Allows complainant to reject a termination request.
const eeTerminatedToCrNotTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and CR remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "TERMINATED" ||
    complaint.status === "CR_NOT_TERMINATED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "CR_NOT_TERMINATED";
  complaint.status = "CR_NOT_TERMINATED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "HEAD of OFFICE cancels the complaint TERMINATED request";
  } else {
    msg = "Complaint Raiser cancels the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to CR NOT TERMINATED successfully.",
    complaint,
  });
});

// eeNotTerminatedToAeTerminated: Approves a previously rejected termination request by Assistant Engineer (AE) or Officer in Charge.
const eeNotTerminatedToAeTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and AE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "AE_TERMINATED" ||
    complaint.status === "AE_NOT_TERMINATED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "AE_TERMINATED";
  complaint.status = "AE_TERMINATED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "OFFICER in CHARGE accepts the complaint TERMINATED request";
  } else {
    msg = "ASSISTANT ENGINEER accepts the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// aeTerminatedToEeTerminated: Finalizes a termination request by Executive Engineer (EE) or Head of Office.
const aeTerminatedToEeTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and EE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "EE_TERMINATED" ||
    complaint.status === "EE_NOT_TERMINATED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "EE_TERMINATED";
  complaint.status = "EE_TERMINATED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "HEAD of OFFICE accepts the complaint TERMINATED request";
  } else {
    msg = "EXECUTIVE ENGINEER accepts the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// eeNotTerminatedToAeNotTerminated: Rejects a termination request by Assistant Engineer (AE) or Officer in Charge after EE rejection.
const eeNotTerminatedToAeNotTerminated = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and AE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "AE_TERMINATED" ||
    complaint.status === "AE_NOT_TERMINATED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "AE_NOT_TERMINATED";
  complaint.status = "AE_NOT_TERMINATED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "OFFICER in CHARGE cancels the complaint TERMINATED request";
  } else {
    msg = "ASSISTANT ENGINEER cancels the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// jeWorkdoneToAeNotSatisfied: Marks a complaint as unsatisfactory by Assistant Engineer (AE) or Officer in Charge.
const jeWorkdoneToAeNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and AE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "AE_NOT_SATISFIED" ||
    complaint.status === "AE_ACKNOWLEDGED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "AE_NOT_SATISFIED";
  complaint.status = "AE_NOT_SATISFIED";
  complaint.reRaised = true;
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "OFFICER in CHARGE is not satisfied with the WORKDONE";
  } else {
    msg = "ASSISTANT ENGINEER is not satisfied with the WORKDONE";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// aeAcknowledgedToEeNotSatisfied: Marks a complaint as unsatisfactory by Executive Engineer (EE) or Head of Office.
const aeAcknowledgedToEeNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and EE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "EE_NOT_SATISFIED" ||
    complaint.status === "EE_ACKNOWLEDGED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "EE_NOT_SATISFIED";
  complaint.status = "EE_NOT_SATISFIED";
  complaint.reRaised = true;
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "HEAD of OFFICE is not satisfied with the WORKDONE";
  } else {
    msg = "EXECUTIVE ENGINEER is not satisfied with the WORKDONE";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// raisedToResourceRequired: Requests resources for a newly raised complaint by Junior Engineer (JE) or System Analyst (SA).
const raisedToResourceRequired = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and JE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "RESOURCE_REQUIRED" ||
    complaint.status === "JE_ACKNOWLEDGED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "RESOURCE_REQUIRED";
  complaint.status = "RESOURCE_REQUIRED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "RESOURCE REQUIRED by SYSTEM ANALYST";
  } else {
    msg = "RESOURCE REQUIRED by JUNIOR ENGINEER";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// resourceRequiredToRaised: Cancels a resource request by the complainant (CR), reverting to RAISED status.
const resourceRequiredToRaised = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and CR remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "RAISED" || complaint.status === "TERMINATED") {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "RAISED";
  complaint.status = "RAISED";
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "Request for RESOURCE is cancelled";
  } else {
    msg = "Request for RESOURCE is cancelled";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to RAISED successfully.",
    complaint,
  });
});

// aeRemarkWhenCrNotSatisfied: Adds an additional remark by Assistant Engineer (AE) to a CR_NOT_SATISFIED complaint.
const aeRemarkWhenCrNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and AE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  addRemarkToComplaint(complaint, remark);

  res.status(200).json({
    message: "Complaint status updated successfully.",
    complaint,
  });
});

// eeRemarkWhenCrNotSatisfied: Adds an additional remark by Executive Engineer (EE) to a CR_NOT_SATISFIED complaint.
const eeRemarkWhenCrNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and EE remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  addRemarkToComplaint(complaint, remark);

  res.status(200).json({
    message: "Complaint status updated successfully.",
    complaint,
  });
});

// eeAcknowledgedToCrNotSatisfied: Marks a complaint as unsatisfactory by the complainant after EE acknowledgment.
const eeAcknowledgedToCrNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    res.status(400);
    throw new Error("Complaint ID and CR remark are required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (
    complaint.status === "CR_NOT_SATISFIED" ||
    complaint.status === "RESOLVED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  addRemarkToComplaint(complaint, remark);

  let msg = "";
  let sts = "CR_NOT_SATISFIED";
  complaint.status = "CR_NOT_SATISFIED";
  complaint.reRaised = true;
  await complaint.save();

  if (complaint.department === "IT") {
    msg = "Complainant is NOT SATISFIED with the work done";
  } else {
    msg = "Complainant is NOT SATISFIED with the work done";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: msg,
    complaint,
  });
});

// changeComplaintDepartment: Updates the department of a complaint and triggers an email notification.
const changeComplaintDepartment = asyncHandler(async (req, res) => {
  const { id, newDepartment, remark } = req.body;

  if (!id || !newDepartment) {
    res.status(400);
    throw new Error("Complaint ID and new department are required.");
  }

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  addRemarkToComplaint(complaint, remark);

  const previousDepartment = complaint.department;

  complaint.department = newDepartment;
  await complaint.save();

  sendComplaintRaisedMail(complaint._id);
  let msg = "Department changed from " + previousDepartment + " to " + newDepartment;
  let sts = "DEPARTMENT_CHANGED";

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint department updated successfully.",
    complaint,
  });
});

// updateComplaintPrice: Updates the price of a complaint and saves the complaint.
const updateComplaintPrice = asyncHandler(async (req, res) => {
  const { id, price, remark } = req.body;

  if (!id || price === undefined || (!price && price !== 0)) {
    res.status(400);
    throw new Error("Price is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  addRemarkToComplaint(complaint, remark);

  complaint.price = price;
  complaint.priceLater = false;
  await complaint.save();

  res.status(200).json({
    message: "Complaint price updated successfully.",
    complaint,
  });
});

module.exports = {
  raisedToJeAcknowledged,
  jeAcknowledgedToJeWorkdone,
  jeWorkDoneToAeAcknowledged,
  aeAcknowledgedToEeAcknowledged,
  eeAcknowledgedToResolved,
  jeWorkdoneToAeNotSatisfied,
  aeAcknowledgedToEeNotSatisfied,
  raisedToResourceRequired,
  resourceRequiredToRaised,
  changeComplaintDepartment,
  aeNotTerminatedToRaised,
  eeTerminatedToTerminated,
  aeNotTerminatedToResourceRequired,
  resourceRequiredToAeNotTerminated,
  resourceRequiredToAeTerminated,
  aeTerminatedToEeNotTerminated,
  eeNotTerminatedToAeTerminated,
  aeTerminatedToEeTerminated,
  eeNotTerminatedToAeNotTerminated,
  jeWorkDoneToResolved,
  jeWorkDoneToCrNotSatisfied,
  aeRemarkWhenCrNotSatisfied,
  eeRemarkWhenCrNotSatisfied,
  crNotSatisfiedToJeWorkdone,
  eeAcknowledgedToCrNotSatisfied,
  updateComplaintPrice,
  eeTerminatedToCrNotTerminated,
};
