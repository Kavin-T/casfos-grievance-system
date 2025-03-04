import React from "react";
import {
  statusFormat,
  dateFormat,
  departmentFormat,
} from "../utils/formatting";

const ComplaintBasicDetails = ({ complaint }) => {
  return (
    <>
      <div className="flex justify-between gap-2 mt-2">
        <h2
          className={`text-xl font-bold ${
            complaint.emergency ? "text-red-800" : "text-green-800"
          }`}
        >
          {complaint.subject}
        </h2>
        {complaint.reRaised && (
          <p className="mt-2">
            <span className="bg-green-100 text-green-600 animate-pulse text-2 font-medium me-2 px-2.5 py-1.5 rounded-full dark:bg-green-600 dark:text-green-100 relative re-raised-tag">
              Re-raised
            </span>
          </p>
        )}
      </div>
      <p className="text-lg font-medium mt-2">
        <strong>Complaint ID:</strong> {complaint.complaintID}
      </p>
      <p
      className={`text-lg font-bold ${
      statusFormat(complaint.status) === "Resolved" ? "text-green-500" : "text-orange-500"
      }`} 
        >
        <strong>Status:</strong> {statusFormat(complaint.status)}
        {statusFormat(complaint.status) === "Resolved" ? "✔️" : statusFormat(complaint.status) === "Terminated" ? "❌": "⚠️"}
      </p>
      <p>
        <strong>Complainant:</strong> {complaint.complainantName}
      </p>
      <p>
        <strong>Department:</strong> {departmentFormat(complaint.department)}
      </p>
      <p>
        <strong>Premises:</strong> {complaint.premises}
      </p>
      <p>
        <strong>Location:</strong> {complaint.location}
      </p>
      {complaint.specificLocation && (
        <p>
          <strong>Specific Location:</strong> {complaint.specificLocation}
        </p>
      )}
      <p>
        <strong>Created On:</strong> {dateFormat(complaint.createdAt)}
      </p>
    </>
  );
};

export default ComplaintBasicDetails;
