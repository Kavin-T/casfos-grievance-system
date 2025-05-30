/*
 * formatting.js
 *
 * Purpose:
 * This script provides utility functions for formatting data in an Express.js application, specifically for
 * complaint-related data stored in a MongoDB database. It handles formatting of statuses, departments, prices,
 * dates, and duration calculations for improved readability in user interfaces or reports.
 *
 * Features:
 * - statusFormat: Converts complaint status codes to human-readable strings, with department-specific variations
 *   for Civil, Electrical, and IT departments.
 * - departmentFormat: Converts department codes to user-friendly names.
 * - priceFormat: Formats numerical prices to Indian currency format with two decimal places.
 * - dateFormat: Converts date objects to a localized string format (Russian locale).
 * - calculateDuration: Calculates the time difference between two timestamps and returns a human-readable duration string.
 *
 * Usage:
 * Import this module in your application (e.g., `const formatting = require('./formatting');`) and use the exported
 * functions to format complaint-related data for display or reporting. These functions are typically used in controllers
 * or views to present data in a user-friendly format.
 *
 * Dependencies:
 * - None (uses built-in JavaScript Date and string manipulation).
 *
 * Notes:
 * - The statusFormat function handles department-specific terminology (e.g., "JE" for Civil/Electrical, "SA" for IT).
 * - The dateFormat function uses the Russian locale ("ru-RU") for date formatting; adjust as needed for other locales.
 * - The priceFormat function uses the Indian locale ("en-IN") for currency formatting.
 * - The calculateDuration function ensures accurate time difference calculations, handling edge cases like negative values.
 */

// Format complaint status based on status code and department
const statusFormat = (status, department) => {
  if (status === "RAISED") {
    return "Raised";
  } else if (
    status === "JE_ACKNOWLEDGED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "JE Acknowledged";
  } else if (status === "JE_ACKNOWLEDGED" && department === "IT") {
    return "SA Acknowledged";
  } else if (
    status === "JE_WORKDONE" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "JE Work Done";
  } else if (status === "JE_WORKDONE" && department === "IT") {
    return "SA Work Done";
  } else if (
    status === "AE_ACKNOWLEDGED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "AE Approved";
  } else if (status === "AE_ACKNOWLEDGED" && department === "IT") {
    return "OC Approved";
  } else if (
    status === "EE_ACKNOWLEDGED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "EE Approved";
  } else if (status === "EE_ACKNOWLEDGED" && department === "IT") {
    return "HO Approved";
  } else if (status === "RESOLVED") {
    return "Resolved";
  } else if (status === "CLOSED") {
    return "Closed";
  } else if (status === "RESOURCE_REQUIRED") {
    return "Resource Required";
  } else if (
    status === "AE_NOT_SATISFIED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "AE Not Satisfied";
  } else if (status === "AE_NOT_SATISFIED" && department === "IT") {
    return "OC Not Satisfied";
  } else if (
    status === "EE_NOT_SATISFIED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "EE Not Satisfied";
  } else if (status === "EE_NOT_SATISFIED" && department === "IT") {
    return "HO Not Satisfied";
  } else if (status === "CR_NOT_SATISFIED") {
    return "CR Not Satisfied";
  } else if (
    status === "AE_NOT_TERMINATED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "AE Not Terminated";
  } else if (status === "AE_NOT_TERMINATED" && department === "IT") {
    return "OC Not Terminated";
  } else if (
    status === "AE_TERMINATED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "AE Terminated";
  } else if (status === "AE_TERMINATED" && department === "IT") {
    return "OC Terminated";
  } else if (
    status === "EE_TERMINATED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "EE Terminated";
  } else if (status === "EE_TERMINATED" && department === "IT") {
    return "HO Terminated";
  } else if (
    status === "EE_NOT_TERMINATED" &&
    (department === "CIVIL" || department === "ELECTRICAL")
  ) {
    return "EE Not Terminated";
  } else if (status === "EE_NOT_TERMINATED" && department === "IT") {
    return "HO Not Terminated";
  } else if (status === "TERMINATED") {
    return "Terminated";
  } else {
    return "Unknown Status";
  }
};

// Format department codes to user-friendly names
const departmentFormat = (input) => {
  switch (input) {
    case "CIVIL":
      return "Civil";
    case "ELECTRICAL":
      return "Electrical";
    default:
      return "Unknown Department";
  }
};

// Format dates to localized string
const dateFormat = (input) => {
  return new Date(input).toLocaleString("ru-RU");
};

// Format prices to Indian currency format
const priceFormat = (input) => {
  return parseFloat(input).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Calculate duration between two timestamps
const calculateDuration = (timestamp1, timestamp2) => {
  let date1 = new Date(timestamp1);
  let date2 = new Date(timestamp2);

  if (date1 > date2) [date1, date2] = [date2, date1];

  let months =
    date2.getMonth() -
    date1.getMonth() +
    12 * (date2.getFullYear() - date1.getFullYear());
  let days = date2.getDate() - date1.getDate();
  let hours = date2.getHours() - date1.getHours();
  let minutes = date2.getMinutes() - date1.getMinutes();

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const prevMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }

  const pluralize = (value, singular, plural) =>
    `${value} ${value === 1 ? singular : plural}`;

  const result = [];
  if (months > 0) result.push(pluralize(months, "month", "months"));
  if (days > 0) result.push(pluralize(days, "day", "days"));
  if (hours > 0) result.push(pluralize(hours, "hour", "hours"));
  if (minutes > 0) result.push(pluralize(minutes, "minute", "minutes"));

  return result.length > 0 ? result.join(", ") : "0 minutes";
};

module.exports = {
  statusFormat,
  departmentFormat,
  priceFormat,
  calculateDuration,
  dateFormat,
};
