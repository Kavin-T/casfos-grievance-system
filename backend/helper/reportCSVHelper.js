/*
 * reportCSVHelper.js
 *
 * Purpose:
 * This script provides a utility function to generate a CSV report from complaint data in an Express.js application.
 * It formats complaint data into a structured CSV file using predefined fields and formatting utilities.
 *
 * Features:
 * - generateCSVReport: Converts an array of complaint objects into a CSV string, with fields formatted for readability.
 * - Supports custom formatting for dates, statuses, departments, prices, and durations using helper functions from formatting.js.
 * - Includes a comprehensive set of fields such as complaint ID, complainant details, status, dates, durations, and remarks.
 * - Handles missing or undefined data gracefully with fallback values (e.g., "N/A" for missing dates).
 *
 * Usage:
 * Import this module in your application (e.g., `const { generateCSVReport } = require('./reportCSVHelper');`) and
 * pass an array of complaint objects to the `generateCSVReport` function to produce a CSV string. This string can be
 * used in a response for download in an Express route.
 *
 * Dependencies:
 * - json2csv: Library for converting JSON data to CSV format.
 * - formatting.js: Provides helper functions for formatting status, department, date, price, and duration.
 *
 * Notes:
 * - The complaint objects must include fields like complaintID, complainantName, status, department, etc., as defined in the fields array.
 * - The generated CSV includes headers and formatted values for user-friendly output.
 * - The function assumes the formatting functions (statusFormat, departmentFormat, etc.) are correctly implemented in formatting.js.
 */

const { Parser } = require("json2csv");
const {
  statusFormat,
  departmentFormat,
  dateFormat,
  priceFormat,
  calculateDuration,
} = require("./formatting");

// Function to generate CSV report from complaints data
const generateCSVReport = (complaints) => {
  // Define fields for the CSV report
  const fields = [
    { label: "ID", value: "complaintID" },
    { label: "Complainant Name", value: "complainantName" },
    { label: "Subject", value: "subject" },
    {
      label: "Date Raised",
      value: (row) => (row.date ? dateFormat(row.date) : "N/A"),
    },
    { label: "Department", value: (row) => departmentFormat(row.department) },
    { label: "Premises", value: "premises" },
    { label: "Location", value: "location" },
    { label: "Specific Location", value: "specificLocation" },
    { label: "Emergency", value: (row) => (row.emergency ? "Yes" : "No") },
    { label: "Re-Raised", value: (row) => (row.reRaised ? "Yes" : "No") },
    {
      label: "Status",
      value: (row) => statusFormat(row.status, row.department),
    },
    {
      label: "Reported On",
      value: (row) => (row.createdAt ? dateFormat(row.createdAt) : "N/A"),
    },
    {
      label: "Acknowledged On",
      value: (row) =>
        row.acknowledgeAt ? dateFormat(row.acknowledgeAt) : "N/A",
    },
    {
      label: "Resolved On",
      value: (row) => (row.resolvedAt ? dateFormat(row.resolvedAt) : "N/A"),
    },
    {
      label: "Time elapsed for Acknowledgement",
      value: (row) =>
        row.createdAt && row.acknowledgeAt
          ? calculateDuration(row.createdAt, row.acknowledgeAt)
          : "N/A",
    },
    {
      label: "Time elapsed for Resolution",
      value: (row) =>
        row.createdAt && row.resolvedAt
          ? calculateDuration(row.createdAt, row.resolvedAt)
          : "N/A",
    },
    {
      label: "Expenditure",
      value: (row) => priceFormat(row.price || 0),
    },
    { label: "Remark by JE", value: "remark_JE" },
    { label: "Remark by AE", value: "remark_AE" },
    { label: "Remark by EE", value: "remark_EE" },
    { label: "Remark by CR", value: "remark_CR" },
    { label: "Resolved By", value: "resolvedName" },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(complaints); // Parse complaints to CSV
  return csv;
};

module.exports = { generateCSVReport };
