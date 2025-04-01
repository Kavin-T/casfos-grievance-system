const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Complaint = require("../models/complaintModel");
const { updateNotification } = require("./notificationController");
const { sendComplaintRaisedMail } = require("../middleware/emailHandler");

const raisedToJeAcknowledged = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const username = req.user.username;

  if (!username) {
    res.status(400);
    throw new Error("Username required.");
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
  
  let msg="";
  let sts="JE_ACKNOWLEDGED";
  complaint.status = "JE_ACKNOWLEDGED";
  complaint.acknowledgeAt = new Date();
  complaint.resolvedName = username;

  await complaint.save();
  if(complaint.department === "IT"){
    msg="Complaint is ACKNOWLEDGED by SYSTEM ANALYST(SA)";
  }
  else{
    msg="Complaint is ACKNOWLEDGED by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint acknowledged successfully.",
    complaint,
  });
});

const jeAcknowledgedToJeWorkdone = asyncHandler(async (req, res) => {
  const { id } = req.body;

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
  let sts="JE_WORKDONE";
  complaint.status = "JE_WORKDONE";

  await complaint.save();

  if(complaint.department === "IT"){
    msg="Work Done by SYSTEM ANALYST(SA)";
  }
  else{
    msg="Work Done by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );


  res.status(200).json({
    message: "Media files uploaded and status updated successfully.",
    complaint,
  });
});

const crNotSatisfiedToJeWorkdone = asyncHandler(async (req, res) => {
  const { id } = req.body;

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
  let sts="JE_WORKDONE";
  complaint.status = "JE_WORKDONE";
  complaint.multiple_remark_ee = [];
  complaint.multiple_remark_ae = [];
  await complaint.save();

  if(complaint.department === "IT"){
    msg="Re-Work done by SYSTEM ANALYST(SA)";
  }
  else{
    msg="Re-Work done by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );


  res.status(200).json({
    message: "Media files uploaded and status updated successfully.",
    complaint,
  });
});

const jeWorkDoneToAeAcknowledged = asyncHandler(async (req, res) => {
  const { id } = req.body;

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

  let msg = "";
  let sts="AE_ACKNOWLEDGED";
  complaint.status = "AE_ACKNOWLEDGED";
  await complaint.save();

  if(complaint.department === "IT"){
    msg="Complaint is APPROVED by OFFICER in CHARGE(OC)";
  }
  else{
    msg="Complaint is APPROVED by ASSISTANT ENGINEER(AE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );


  res.status(200).json({
    message: "Complaint status updated to AE ACKNOWLEDGED successfully.",
    complaint,
  });
});

const jeWorkDoneToResolved = asyncHandler(async (req, res) => {
  const { id } = req.body;

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

  let msg = "Complaint is RESOLVED";
  let sts="RESOLVED";
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

const jeWorkDoneToCrNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark_CR } = req.body;

  if (!id || !remark_CR) {
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
  let msg = "";
  let sts="CR_NOT_SATISFIED";
  complaint.status = "CR_NOT_SATISFIED";
  complaint.remark_CR = remark_CR;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="Complainant is not Satisfied with the work done by SYSTEM ANALYST(SA)";
  }
  else{
    msg="Complainant is not satisfied with the word done by JUNIOR ENGINEER(JE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );


  res.status(200).json({
    message: "Complaint status updated to CR_NOT_SATISFIED successfully.",
    complaint,
  });
});

const aeNotTerminatedToRaised = asyncHandler(async (req, res) => {
  const { id } = req.body;

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

  let msg = "Complaint is RAISED again";
  let sts="RAISED";
  complaint.status = "RAISED";
  await complaint.save();

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );


  res.status(200).json({
    message: "Complaint status updated to AE ACKNOWLEDGED successfully.",
    complaint,
  });
});

const eeTerminatedToTerminated = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Complaint ID is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "TERMINATED") {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  let msg = "Complaint is TERMINATED";
  let sts="TERMINATED";
  complaint.status = "TERMINATED";
  await complaint.save();

  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to AE ACKNOWLEDGED successfully.",
    complaint,
  });
});

const aeAcknowledgedToEeAcknowledged = asyncHandler(async (req, res) => {
  const { id, price, priceLater } = req.body;

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

  if (
    complaint.status === "EE_ACKNOWLEDGED" ||
    complaint.status === "EE_NOT_SATISFIED"
  ) {
    return res.status(200).json({
      message: "Complaint already updated.",
    });
  }

  let msg = "";
  let sts="EE_ACKNOWLEDGED";
  complaint.status = "EE_ACKNOWLEDGED";
  complaint.price = price;
  if (!priceLater) {
    complaint.isPriceEntered = true;
  }
  await complaint.save();

  if(complaint.department === "IT"){
    msg="Complaint is APPROVED by HEAD OF OFFICE(HO)";
  }
  else{
    msg="Complaint is APPROVED by EXECUTIVE ENGINEER(EE)";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to EE ACKNOWLEDGED successfully.",
    complaint,
  });
});

const eeAcknowledgedToResolved = asyncHandler(async (req, res) => {
  const { id } = req.body;

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

  let msg = "Complaint is RESOLVED";
  let sts="RESOLVED";
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

const aeNotTerminatedToResourceRequired = asyncHandler(async (req, res) => {
  const { id, remark_JE } = req.body;

  if (!id || !remark_JE) {
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

  let msg = "";
  let sts="RESOURCE_REQUIRED";
  complaint.status = "RESOURCE_REQUIRED";
  complaint.remark_JE = remark_JE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="SYSTEM ANALYST(SA) is requesting for RESOURCES";
  }
  else{
    msg="JUNIOR ENGINEER(JE) is requesting for RESOURCES";
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

const resourceRequiredToAeNotTerminated = asyncHandler(async (req, res) => {
  const { id, remark_AE } = req.body;

  if (!id || !remark_AE) {
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

  let msg = "";
  let sts="AE_NOT_TERMINATED";
  complaint.status = "AE_NOT_TERMINATED";
  complaint.remark_AE = remark_AE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="OFFICER in CHARGE cancels the RESOURCE REQUIRED request";
  }
  else{
    msg="ASSISTANT ENGINEER cancels the RESOURCE REQUIRED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to AE NOT TERMINATED successfully.",
    complaint,
  });
});

const resourceRequiredToAeTerminated = asyncHandler(async (req, res) => {
  const { id, remark_AE } = req.body;

  if (!id || !remark_AE) {
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

  let msg = "";
  let sts="AE_TERMINATED";
  complaint.status = "AE_TERMINATED";
  complaint.remark_AE = remark_AE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="OFFICER in CHARGE accepts the RESOURCE REQUIRED request";
  }
  else{
    msg="ASSISTANT ENGINEER accepts the RESOURCE REQUIRED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to AE TERMINATED successfully.",
    complaint,
  });
});

const aeTerminatedToEeNotTerminated = asyncHandler(async (req, res) => {
  const { id, remark_EE } = req.body;

  if (!id || !remark_EE) {
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

  let msg = "";
  let sts="EE_NOT_TERMINATED";
  complaint.status = "EE_NOT_TERMINATED";
  complaint.remark_EE = remark_EE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="HEAD of OFFICE cancels the complaint TERMINATED request";
  }
  else{
    msg="EXECUTIVE ENGINEER cancels the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to EE NOT TERMINATED successfully.",
    complaint,
  });
});

const eeNotTerminatedToAeTerminated = asyncHandler(async (req, res) => {
  const { id, remark_AE } = req.body;

  if (!id || !remark_AE) {
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

  let msg = "";
  let sts="AE_TERMINATED";
  complaint.status = "AE_TERMINATED";
  complaint.remark_AE = remark_AE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="OFFICER in CHARGE accepts the complaint TERMINATED request";
  }
  else{
    msg="ASSISTANT ENGINEER accepts the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to AE TERMINATED successfully.",
    complaint,
  });
});

const aeTerminatedToEeTerminated = asyncHandler(async (req, res) => {
  const { id, remark_EE } = req.body;

  if (!id || !remark_EE) {
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

  let msg = "";
  let sts="EE_TERMINATED";
  complaint.status = "EE_TERMINATED";
  complaint.remark_EE = remark_EE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="HEAD of OFFICE accepts the complaint TERMINATED request";
  }
  else{
    msg="EXECUTIVE ENGINEER accepts the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to EE TERMINATED successfully.",
    complaint,
  });
});

const eeNotTerminatedToAeNotTerminated = asyncHandler(async (req, res) => {
  const { id, remark_AE } = req.body;

  if (!id || !remark_AE) {
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

  let msg = "";
  let sts="AE_NOT_TERMINATED";
  complaint.status = "AE_NOT_TERMINATED";
  complaint.remark_AE = remark_AE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="OFFICER in CHARGE cancels the complaint TERMINATED request";
  }
  else{
    msg="ASSISTANT ENGINEER cancels the complaint TERMINATED request";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to AE NOT TERMINATED successfully.",
    complaint,
  });
});

const jeWorkdoneToAeNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark_AE } = req.body;

  if (!id || !remark_AE) {
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

  let msg ="";
  let sts="AE_NOT_SATISFIED";
  complaint.status = "AE_NOT_SATISFIED";
  complaint.remark_AE = remark_AE;
  complaint.reRaised = true;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="OFFICER in CHARGE is not satisfied with the WORKDONE";
  }
  else{
    msg="ASSISTANT ENGINEER is not satisfied with the WORKDONE";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to AE NOT SATISFIED successfully.",
    complaint,
  });
});

const aeAcknowledgedToEeNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark_EE } = req.body;

  if (!id || !remark_EE) {
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

  let msg = "";
  let sts="EE_NOT_SATISFIED";
  complaint.status = "EE_NOT_SATISFIED";
  complaint.remark_EE = remark_EE;
  complaint.reRaised = true;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="HEAD of OFFICE is not satisfied with the WORKDONE";
  }
  else{
    msg="EXECUTIVE ENGINEER is not satisfied with the WORKDONE";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to EE NOT SATISFIED successfully.",
    complaint,
  });
});

const raisedToResourceRequired = asyncHandler(async (req, res) => {
  const { id, remark_JE } = req.body;

  if (!id || !remark_JE) {
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

  let msg = "";
  let sts="RESOURCE_REQUIRED";
  complaint.status = "RESOURCE_REQUIRED";
  complaint.remark_JE = remark_JE;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="RESOURCE REQUIRED by SYSTEM ANALYST";
  }
  else{
    msg="RESOURCE REQUIRED by JUNIOR ENGINEER";
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

const resourceRequiredToRaised = asyncHandler(async (req, res) => {
  const { id, remark_CR } = req.body;

  if (!id || !remark_CR) {
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

  let msg = "";
  let sts="RAISED";
  complaint.status = "RAISED";
  complaint.remark_CR = remark_CR;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="Request for RESOURCE is cancelled";
  }
  else{
    msg="Request for RESOURCE is cancelled";
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

  complaint.multiple_remark_ae.push(remark);
  await complaint.save();

  res.status(200).json({
    message: "Complaint status updated successfully.",
    complaint,
  });
});

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

  complaint.multiple_remark_ee.push(remark);
  await complaint.save();

  res.status(200).json({
    message: "Complaint status updated successfully.",
    complaint,
  });
});

const eeAcknowledgedToCrNotSatisfied = asyncHandler(async (req, res) => {
  const { id, remark_CR } = req.body;

  if (!id || !remark_CR) {
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

  let msg = "";
  let sts="CR_NOT_SATISFIED";
  complaint.status = "CR_NOT_SATISFIED";
  complaint.remark_CR = remark_CR;
  complaint.reRaised = true;
  await complaint.save();

  if(complaint.department === "IT"){
    msg="Complainant is NOT SATISFIED with the work done";
  }
  else{
    msg="Complainant is NOT SATISFIED with the work done";
  }
  updateNotification(
    complaint.complaintID,
    complaint.subject,
    sts,
    msg,
  );

  res.status(200).json({
    message: "Complaint status updated to CR NOT SATISFIED successfully.",
    complaint,
  });
});

const changeComplaintDepartment = asyncHandler(async (req, res) => {
  const { id, newDepartment } = req.body;

  if (!id || !newDepartment) {
    res.status(400);
    throw new Error("Complaint ID and new department are required.");
  }

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  const previousDepartment = complaint.department;

  complaint.department = newDepartment;
  await complaint.save();

  sendComplaintRaisedMail(complaint._id);
  let msg="Department changed from "+previousDepartment+" to "+newDepartment;
  let sts="DEPARTMENT_CHANGED";
 
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

const updateComplaintPrice = asyncHandler(async (req, res) => {
  const { id, price } = req.body;

  if (!id || price === undefined || (!price && price !== 0)) {
    res.status(400);
    throw new Error("Price is required.");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found.");
  }

  complaint.price = price;
  complaint.isPriceEntered = true;
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
};
