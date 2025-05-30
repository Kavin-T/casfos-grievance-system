/*
 * reportController.js
 *
 * Purpose:
 * This script provides a controller function for generating complaint reports in an Express.js application.
 * It supports generating reports in PDF or CSV format based on filtered complaint data from a MongoDB database.
 *
 * Features:
 * - generateComplaintReport: Generates a report of complaints based on query filters, supporting both PDF and CSV formats.
 * - Uses dynamic query building to filter complaints.
 * - Generates PDF reports using an HTML-to-PDF conversion library.
 * - Generates CSV reports for tabular data export.
 * - Sets appropriate HTTP headers for file downloads.
 * - Handles invalid report type errors with appropriate status codes and messages.
 *
 * Usage:
 * Import this module in your Express.js routes (e.g., `const reportController = require('./reportController');`)
 * and use the exported `generateComplaintReport` function as a route handler for generating complaint reports.
 * Pass query parameters to filter complaints and specify the report type (`type=pdf` or `type=csv`).
 * Ensure the Complaint model, query helper, and report helpers are properly configured.
 *
 * Dependencies:
 * - express-async-handler: Simplifies error handling for async Express route handlers.
 * - Complaint model: Mongoose model for complaint data (../models/complaintModel).
 * - queryHelper: Custom helper for generating MongoDB queries (../helper/queryHelper).
 * - reportPDFHelper: Custom helper for generating PDF report content (../helper/reportPDFHelper).
 * - reportCSVHelper: Custom helper for generating CSV report content (../helper/reportCSVHelper).
 * - html-pdf-node: Library for converting HTML to PDF.
 *
 * Notes:
 * - The `generateReport` function in reportPDFHelper should return a file object compatible with html-pdf-node.
 * - The `generateCSVReport` function in reportCSVHelper should return a string of CSV data.
 * - Query parameters are processed by the `getQuery` helper to filter complaints.
 */

const asyncHandler = require("express-async-handler");
const Complaint = require("../models/complaintModel");
const getQuery = require("../helper/queryHelper");
const { generateReport } = require("../helper/reportPDFHelper");
const { generateCSVReport } = require("../helper/reportCSVHelper");
const pdf = require("html-pdf-node");

// Handler to generate complaint reports in PDF or CSV format
const generateComplaintReport = asyncHandler(async (req, res) => {
  const filters = req.query;
  const query = getQuery(filters); // Build MongoDB query from filters
  const complaints = await Complaint.find(query).exec();

  if (req.query.type === "pdf") {
    const file = await generateReport(complaints);
    const pdfBuffer = await pdf.generatePdf(file, { format: "A2" });

    // Set headers for PDF download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=complaints_report.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } else if (req.query.type === "csv") {
    const csvData = generateCSVReport(complaints);

    // Set headers for CSV download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=complaints_report.csv"
    );
    res.setHeader("Content-Type", "text/csv");
    res.send(csvData);
  } else {
    res.status(400);
    throw new Error("Invalid report type. Please specify 'pdf' or 'csv'.");
  }
});

module.exports = { generateComplaintReport };
