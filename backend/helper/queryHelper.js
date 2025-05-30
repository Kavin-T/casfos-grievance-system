/*
 * queryHelper.js
 *
 * Purpose:
 * This script provides a utility function to dynamically build MongoDB queries based on request parameters
 * in an Express.js application. It is designed to filter complaint data by date ranges, status, and other fields.
 *
 * Features:
 * - getQuery: Constructs a MongoDB query object from request parameters, supporting:
 *   - Date range filtering for complaint date, creation date, acknowledgment date, and resolution date.
 *   - Status filtering for specific statuses (e.g., JE_WORKDONE, TERMINATED, RESOLVED) or PENDING (non-terminated/resolved).
 *   - Case-insensitive regex filtering for text fields like complainantName, subject, etc.
 *   - Boolean filtering for the emergency field.
 * - Supports a predefined list of filterable fields for flexible querying.
 *
 * Usage:
 * Import this module in your application (e.g., `const getQuery = require('./queryHelper');`) and pass
 * the request query object (req.query) to the `getQuery` function to generate a MongoDB query. Use the
 * returned query object with Mongoose to filter complaint data.
 *
 * Dependencies:
 * - None (uses built-in JavaScript and MongoDB query syntax).
 *
 * Notes:
 * - The function expects request parameters to include date fields (e.g., startDate, createdStartDate) and
 *   filterable fields (e.g., complainantName, department).
 * - Text-based filters use case-insensitive regex ($regex with $options: 'i').
 * - The emergency field is converted to a boolean for querying.
 * - The query object is compatible with Mongoose's find() method.
 */

// Function to generate a MongoDB query object based on request parameters
const getQuery = (req) => {
  const {
    startDate,
    endDate,
    createdStartDate,
    createdEndDate,
    acknowledgedStartDate,
    acknowledgedEndDate,
    resolvedStartDate,
    resolvedEndDate,
    status,
    ...filters
  } = req;

  const query = {};

  // Handle date range for complaint date
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Handle date range for creation date
  if (createdStartDate || createdEndDate) {
    query.createdAt = {};
    if (createdStartDate) query.createdAt.$gte = new Date(createdStartDate);
    if (createdEndDate) query.createdAt.$lte = new Date(createdEndDate);
  }

  // Handle date range for acknowledgment date
  if (acknowledgedStartDate || acknowledgedEndDate) {
    query.acknowledgeAt = {};
    if (acknowledgedStartDate)
      query.acknowledgeAt.$gte = new Date(acknowledgedStartDate);
    if (acknowledgedEndDate)
      query.acknowledgeAt.$lte = new Date(acknowledgedEndDate);
  }

  // Handle date range for resolution date
  if (resolvedStartDate || resolvedEndDate) {
    query.resolvedAt = {};
    if (resolvedStartDate) query.resolvedAt.$gte = new Date(resolvedStartDate);
    if (resolvedEndDate) query.resolvedAt.$lte = new Date(resolvedEndDate);
  }

  // Handle status filtering
  if (status) {
    if (status === "JE_WORKDONE") {
      query.status = status;
    } else if (status === "TERMINATED" || status === "RESOLVED") {
      query.status = status;
    } else if (status === "PENDING") {
      query.status = { $nin: ["TERMINATED", "RESOLVED"] }; // Exclude TERMINATED and RESOLVED for PENDING
    }
  }

  // Define filterable fields for text-based and boolean queries
  const filterableFields = [
    "complainantName",
    "subject",
    "department",
    "premises",
    "location",
    "specificLocation",
    "details",
    "emergency",
    "complaintID",
  ];

  // Apply filters for text and boolean fields
  filterableFields.forEach((field) => {
    if (filters[field] !== undefined && filters[field] !== "") {
      if (field === "emergency") {
        query[field] = filters[field] === "true";
      } else {
        query[field] = { $regex: filters[field], $options: "i" }; // Case-insensitive regex for text fields
      }
    }
  });

  return query;
};

module.exports = getQuery;
