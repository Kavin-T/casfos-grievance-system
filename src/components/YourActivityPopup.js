import React from "react";
import ComplaintDetailsPopup from "./ComplaintDetailsPopup";

// Mapping for status transitions
const statusOptions = {
  RAISED: [
    { value: "JE_ACKNOWLEDGED", label: "JE_ACKNOWLEDGED" },
    { value: "RESOURCE_REQUIRED", label: "RESOURCE_REQUIRED" },
  ],
  JE_WORKDONE: [
    { value: "AE_ACKNOWLEDGED", label: "AE_ACKNOWLEDGED" },
    { value: "AE_NOT_SATISFIED", label: "AE_NOT_SATISFIED" },
  ],
  AE_ACKNOWLEDGED: [
    { value: "EE_ACKNOWLEDGED", label: "EE_ACKNOWLEDGED" },
    { value: "EE_NOT_SATISFIED", label: "EE_NOT_SATISFIED" },
  ],
  EE_ACKNOWLEDGED: [{ value: "RESOLVED", label: "RESOLVED" }],
  RESOURCE_REQUIRED: [
    { value: "CLOSED", label: "CLOSED" },
    { value: "RAISED", label: "RAISED" },
  ],
  EE_NOT_SATISFIED: [
    { value: "AE_NOT_SATISFIED", label: "AE_NOT_SATISFIED" },
    { value: "AE_ACKNOWLEDGED", label: "AE_ACKNOWLEDGED" },
  ],
  JE_ACKNOWLEDGED: [{ value: "JE_WORKDONE", label: "JE_WORKDONE" }],
  AE_NOT_SATISFIED: [{ value: "JE_WORKDONE", label: "JE_WORKDONE" }],
};

const YourActivityPopup = ({
  selectedComplaint,
  statusChange,
  setStatusChange,
  remark,
  setRemark,
  price,
  setPrice,
  files,
  handleFileChange,
  closeModal,
  handleStatusChange,
}) => {
  const statusChangeOptions = statusOptions[selectedComplaint.status] || [];

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <ComplaintDetailsPopup selectedComplaint={selectedComplaint}/>

          {selectedComplaint.status === "RESOURCE_REQUIRED" &&
            selectedComplaint.remark_JE && (
              <RemarkDisplay
                remark={selectedComplaint.remark_JE}
                label="JE Remark :"
              />
            )}

          {selectedComplaint.status === "AE_NOT_SATISFIED" &&
            selectedComplaint.remark_AE && (
              <RemarkDisplay
                remark={selectedComplaint.remark_AE}
                label="AE Remark :"
              />
            )}

          {selectedComplaint.status === "EE_NOT_SATISFIED" &&
            selectedComplaint.remark_EE && (
              <RemarkDisplay
                remark={selectedComplaint.remark_EE}
                label="EE Remark :"
              />
            )}

          {selectedComplaint.status === "RAISED" &&
            selectedComplaint.remark_CR && (
              <RemarkDisplay
                remark={selectedComplaint.remark_CR}
                label="CR Remark :"
              />
            )}

          <div className="mt-4">
            <label htmlFor="statusChange">Change Status:</label>
            <div className="mt-2">
              <select
                id="statusChange"
                value={statusChange}
                onChange={(e) => setStatusChange(e.target.value)}
                className="block p-2 border rounded w-full"
              >
                <option value="">Select</option>
                {statusChangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(
            [
            "RESOURCE_REQUIRED",
            "AE_NOT_SATISFIED",
            "EE_NOT_SATISFIED",
            ].includes(statusChange) || 
            (selectedComplaint.status === "RESOURCE_REQUIRED" && statusChange === "RAISED")
          ) && (
            <div className="mt-4">
              <label htmlFor="remark">Enter Remark:</label>
              <div className="mt-2">
                <textarea
                  className="block mt-2 p-2 border rounded w-full"
                  placeholder="Enter remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
          )}

          {statusChange === "EE_ACKNOWLEDGED" && (
            <div className="mt-4">
              <label htmlFor="price">Enter Price:</label>
              <div className="mt-2">
                <input
                  type="number"
                  className="block mt-2 p-2 border rounded w-full"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          )}

          {statusChange === "JE_WORKDONE" && (
            <div className="mt-2">
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="imgAfter"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                >
                  {files.imgAfter ? "Change image" : "Upload image"}
                </label>
                <input
                  id="imgAfter"
                  name="imgAfter"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                {files?.imgAfter && (
                  <span className="ml-3 text-sm text-gray-600">
                    {files.imgAfter.name}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="vidAfter"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                >
                  {files.vidAfter ? "Change video" : "Upload video"}
                </label>
                <input
                  id="vidAfter"
                  name="vidAfter"
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                {files?.vidAfter && (
                  <span className="ml-3 text-sm text-gray-600">
                    {files.vidAfter.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {statusChange === "JE_WORKDONE" &&
            !(files.imgAfter || files.vidAfter) && (
              <div className="text-red-500 mt-2">
                <p>
                  <strong>Warning:</strong> You must upload either an image or a
                  video.
                </p>
              </div>
            )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusChange}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={
                statusChange === "JE_WORKDONE" &&
                !(files.imgAfter || files.vidAfter)
              }
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const RemarkDisplay = ({ label, remark }) => {
  return (
    <div className="text-red-600 font-bold mt-5 mb-5">
      <div className="mb-2">{label}</div>
      <div className="max-h-[150px] overflow-y-auto border border-red-600 p-2 bg-gray-100 rounded">
        <p className="m-0 whitespace-pre-wrap break-words">{remark}</p>
      </div>
    </div>
  );
};

export default YourActivityPopup;
