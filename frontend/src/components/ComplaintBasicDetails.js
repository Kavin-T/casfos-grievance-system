/*
 * ComplaintBasicDetails.js
 *
 * Purpose:
 * This React component displays the basic details of a complaint, such as subject, status, complainant, department, and location.
 * It provides a concise summary view for each complaint record.
 *
 * Features:
 * - Shows subject with color indicating emergency status.
 * - Displays 'Re-raised' tag if the complaint has been re-raised.
 * - Shows complaint ID, status (with color and icon), complainant, department, premises, location, and reported date.
 * - Uses utility functions for formatting status, date, and department.
 *
 * Usage:
 * Import and use this component in a parent component, passing a `complaint` object as a prop.
 * Example: <ComplaintBasicDetails complaint={complaintData} />
 *
 * Dependencies:
 * - formatting.js: Utility functions for formatting status, date, and department (../utils/formatting).
 *
 * Notes:
 * - Expects the `complaint` prop to have fields like subject, status, complainantName, department, premises, location, specificLocation, createdAt, etc.
 */
import React from "react";
import {
  statusFormat,
  dateFormat,
  departmentFormat,
} from "../utils/formatting";

// Main component to display basic complaint details
const ComplaintBasicDetails = ({ complaint }) => {
  return (
    <>
      {/* Header section with subject and emergency color */}
      <div className="flex justify-between gap-2 mt-2">
        <h2
          className={`text-xl font-bold ${
            complaint.emergency ? "text-red-800" : "text-green-800"
          }`}
        >
          {complaint.subject}
        </h2>
        {/* Show 'Re-raised' tag if complaint is re-raised */}
        {complaint.reRaised && (
          <p className="mt-2">
            <span className="bg-green-100 text-green-600 animate-pulse text-2 font-medium me-2 px-2.5 py-1.5 rounded-full dark:bg-green-600 dark:text-green-100 relative re-raised-tag">
              Re-raised
            </span>
          </p>
        )}
      </div>
      {/* Show complaint ID */}
      <p className="text-lg font-medium mt-2">
        <strong>Complaint ID:</strong> {complaint.complaintID}
      </p>
      {/* Show complaint status with color and icon */}
      <p
      className={`text-lg font-bold ${
      statusFormat(complaint.status, complaint.department) === "Resolved" ? "text-green-500" : "text-orange-500"
      }`} 
        >
        <strong>Status:</strong> {statusFormat(complaint.status, complaint.department)}
        {statusFormat(complaint.status, complaint.department) === "Resolved" ? "✔️" : statusFormat(complaint.status, complaint.department) === "Terminated" ? "❌": "⚠️"}
      </p>
      {/* Show complainant name */}
      <p>
        <strong>Complainant:</strong> {complaint.complainantName}
      </p>
      {/* Show department name */}
      <p>
        <strong>Department:</strong> {departmentFormat(complaint.department)}
      </p>
      {/* Show premises */}
      <p>
        <strong>Premises:</strong> {complaint.premises}
      </p>
      {/* Show location */}
      <p>
        <strong>Location:</strong> {complaint.location}
      </p>
      {/* Show specific location if available */}
      {complaint.specificLocation && (
        <p>
          <strong>Specific Location:</strong> {complaint.specificLocation}
        </p>
      )}
      {/* Show reported date */}
      <p>
        <strong>Reported On:</strong> {dateFormat(complaint.createdAt)}
      </p>
    </>
  );
};

export default ComplaintBasicDetails;
