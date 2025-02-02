import React from "react";
import {
  priceFormat,
  dateFormat,
  calculateDuration,
} from "../utils/formatting";
import { handleMediaOpen } from "../services/fileApi";

const ComplaintAdditionalDetails = ({ complaint }) => {
  return (
    <>
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
      <p>
        <strong>Details:</strong>
      </p>
      <div className="max-h-[150px] overflow-y-auto border border-gray-300 p-2 rounded bg-gray-100">
        {complaint.details}
      </div>
      {complaint.resolvedName && (
        <p>
          <strong>Resolved by:</strong> {complaint.resolvedName}
        </p>
      )}
      {parseFloat(complaint.price.$numberDecimal) > 0 && (
        <div className="text-green-600 font-bold border border-green-600 p-2 my-5">
          Expenditure: ₹ {priceFormat(complaint.price.$numberDecimal)}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-3">
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
