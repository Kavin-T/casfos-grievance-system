/*
 * ComplaintAdditionalDetails.js
 *
 * Purpose:
 * This React component displays additional details for a complaint, including timestamps, expenditure,
 * and media (images/videos) before and after resolution. It provides a structured and readable view
 * of complaint progress and supporting evidence.
 *
 * Features:
 * - Shows acknowledgement and resolution timestamps, with duration calculations.
 * - Displays complaint details and the name of the resolver.
 * - Shows expenditure if available.
 * - Renders buttons to preview images and videos (before and after resolution) using a media handler.
 * - Uses utility functions for formatting dates, prices, and durations.
 *
 * Usage:
 * Import and use this component in a parent component, passing a `complaint` object as a prop.
 * Example: `<ComplaintAdditionalDetails complaint={complaintData} />`
 *
 * Dependencies:
 * - formatting.js: Utility functions for formatting price, date, and duration (../utils/formatting).
 * - fileApi.js: Function to handle media preview (../services/fileApi).
 *
 * Notes:
 * - Expects the `complaint` prop to have fields like acknowledgeAt, resolvedAt, details, resolvedName,
 *   price, imgBefore, vidBefore, imgAfter, vidAfter, etc.
 * - Media buttons call `handleMediaOpen` to preview the selected file.
 */
import React from "react";
import {
  priceFormat, // Formats price values for display
  dateFormat, //  Formats date values for display
  calculateDuration, // Calculates duration between two dates
} from "../utils/formatting";
import { handleMediaOpen } from "../services/fileApi";

const ComplaintAdditionalDetails = ({ complaint }) => {
  return (
    <>
      {/* Show acknowledgement details if available */}
      {complaint.acknowledgeAt && (
        <>
          <p>
            <strong>Acknowledged On:</strong>{" "}
            {dateFormat(complaint.acknowledgeAt)}
          </p>
          <p>
            <strong>Time elapsed for Acknowledgement:</strong>{" "}
            {calculateDuration(complaint.createdAt, complaint.acknowledgeAt)}
          </p>
        </>
      )}
      {/* Show resolution details if available */}
      {complaint.resolvedAt && (
        <>
          <p>
            <strong>Resolved On:</strong> {dateFormat(complaint.resolvedAt)}
          </p>
          <p>
            <strong>Time elapsed for Resolution:</strong>{" "}
            {calculateDuration(complaint.createdAt, complaint.resolvedAt)}
          </p>
        </>
      )}
      {/* Show complaint details */}
      <p>
        <strong>Details:</strong>
      </p>
      <div className="max-h-[150px] overflow-y-auto border border-gray-300 p-2 rounded bg-gray-100">
        {complaint.details}
      </div>
      {/* Show resolver's name if available */}
      {complaint.resolvedName && (
        <p>
          <strong>Resolved by:</strong> {complaint.resolvedName}
        </p>
      )}
      {/* Show expenditure if price is greater than 0 */}
      {parseFloat(complaint.price.$numberDecimal) > 0 && (
        <div className="text-green-600 font-bold border border-green-600 p-2 my-5">
          Expenditure: ₹ {priceFormat(complaint.price.$numberDecimal)}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-3">
        {/* Render media buttons for before/after images and videos */}
        {/* Render buttons for images before resolution */}
        {complaint.imgBefore &&
          complaint.imgBefore.map((path, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 m-1"
              onClick={() => handleMediaOpen(path)}
            >
              {`Image ${index + 1} - Before`}
            </button>
          ))}

        {/* Render buttons for videos before resolution */}
        {complaint.vidBefore &&
          complaint.vidBefore.map((path, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 m-1"
              onClick={() => handleMediaOpen(path)}
            >
              {`Video ${index + 1} - Before`}
            </button>
          ))}

        {/* Render buttons for images after resolution */}
        {complaint.imgAfter &&
          complaint.imgAfter.map((path, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 m-1"
              onClick={() => handleMediaOpen(path)}
            >
              {`Image ${index + 1} - After`}
            </button>
          ))}

        {/* Render buttons for videos after resolution */}
        {complaint.vidAfter &&
          complaint.vidAfter.map((path, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 m-1"
              onClick={() => handleMediaOpen(path)}
            >
              {`Video ${index + 1} - After`}
            </button>
          ))}
      </div>
    </>
  );
};

export default ComplaintAdditionalDetails;
