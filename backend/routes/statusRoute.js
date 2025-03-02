const express = require("express");
const {
  raisedToJeAcknowledged,
  jeAcknowledgedToJeWorkdone,
  jeWorkDoneToAeAcknowledged,
  aeAcknowledgedToEeAcknowledged,
  eeAcknowledgedToResolved,
  jeWorkdoneToAeNotSatisfied,
  aeAcknowledgedToEeNotSatisfied,
  raisedToResourceRequired,
  resourceRequiredToClosed,
  resourceRequiredToRaised,
  changeComplaintDepartment,
} = require("../controllers/statusController");
const { upload, ensureTempDirectory } = require("../middleware/fileHandler");
const validateDesignation = require("../middleware/validateDesignationHandler");
const router = express.Router();

router.put(
  "/raised/je-acknowledged",
  validateDesignation([
    "JUNIOR_ENGINEER_CIVIL",
    "JUNIOR_ENGINEER_ELECTRICAL",
    "JUNIOR_ENGINEER_IT",
  ]),
  raisedToJeAcknowledged
);
router.post(
  "/je-acknowledged/je-workdone",
  validateDesignation([
    "JUNIOR_ENGINEER_CIVIL",
    "JUNIOR_ENGINEER_ELECTRICAL",
    "JUNIOR_ENGINEER_IT",
  ]),
  ensureTempDirectory,
  upload.fields([
    { name: "imgAfter_1", maxCount: 1 },
    { name: "imgAfter_2", maxCount: 1 },
    { name: "imgAfter_3", maxCount: 1 },
    { name: "vidAfter", maxCount: 1 },
  ]),
  jeAcknowledgedToJeWorkdone
);
router.put(
  "/je-workdone/ae-acknowledged",
  validateDesignation([
    "ASSISTANT_ENGINEER_CIVIL",
    "ASSISTANT_ENGINEER_ELECTRICAL",
    "ASSISTANT_ENGINEER_IT",
  ]),
  jeWorkDoneToAeAcknowledged
);
router.put(
  "/ae-acknowledged/ee-acknowledged",
  validateDesignation([
    "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
    "EXECUTIVE_ENGINEER_IT",
  ]),
  aeAcknowledgedToEeAcknowledged
);
router.put(
  "/ee-acknowledged/resolved",
  validateDesignation([
    "COMPLAINANT",
    "ESTATE_OFFICER",
    "PRINCIPAL",
    "ASSISTANT_TO_ESTATE_OFFICER",
  ]),
  eeAcknowledgedToResolved
);
router.put(
  "/je-workdone/ae-not-satisfied",
  validateDesignation([
    "ASSISTANT_ENGINEER_CIVIL",
    "ASSISTANT_ENGINEER_ELECTRICAL",
    "ASSISTANT_ENGINEER_IT",
  ]),
  jeWorkdoneToAeNotSatisfied
);
router.put(
  "/ae-acknowledged/ee-not-satisfied",
  validateDesignation([
    "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
    "EXECUTIVE_ENGINEER_IT",
  ]),
  aeAcknowledgedToEeNotSatisfied
);
router.put(
  "/raised/resource-required",
  validateDesignation([
    "JUNIOR_ENGINEER_CIVIL",
    "JUNIOR_ENGINEER_ELECTRICAL",
    "JUNIOR_ENGINEER_IT",
  ]),
  raisedToResourceRequired
);
router.put(
  "/resource-required/closed",
  validateDesignation([
    "COMPLAINANT",
    "ESTATE_OFFICER",
    "PRINCIPAL",
    "ASSISTANT_TO_ESTATE_OFFICER",
  ]),
  resourceRequiredToClosed
);
router.put(
  "/resource-required/raised",
  validateDesignation([
    "COMPLAINANT",
    "ESTATE_OFFICER",
    "PRINCIPAL",
    "ASSISTANT_TO_ESTATE_OFFICER",
  ]),
  resourceRequiredToRaised
);

router.put(
  "/change-department",
  validateDesignation([
    "JUNIOR_ENGINEER_CIVIL",
    "JUNIOR_ENGINEER_ELECTRICAL",
    "JUNIOR_ENGINEER_IT",
  ]),
  changeComplaintDepartment
);

module.exports = router;
