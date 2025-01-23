import React from "react";
import { statusFormat, dateFormat, departmentFormat } from "../utils/formatting";

const ComplaintBasicDetails = ({ complaint }) => {
  return (
    <>
      <h2
        className={`text-xl font-bold ${
          complaint.emergency ? "text-red-800" : "text-green-800"
        }`}
      >
        {complaint.subject}
      </h2>
      <p className="text-lg font-medium mt-2">
        <strong>Complaint ID:</strong> {complaint._id}
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
      <p>
        <strong>Status:</strong> {statusFormat(complaint.status)}
      </p>
      <p>
        <strong>Created On:</strong> {dateFormat(complaint.createdAt)}
      </p>
    </>
  );
};

export default ComplaintBasicDetails;
