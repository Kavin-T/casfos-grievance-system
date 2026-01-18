/*
 * YourActivityPopup.js
 *
 * Purpose:
 * This React component renders a modal popup for updating the status, remarks, department, and files for a selected complaint.
 * It is used as part of the complaint workflow for staff and engineers to take actions on complaints.
 *
 * Features:
 * - Displays complaint basic and additional details.
 * - Allows status change, department change, and entering remarks or price.
 * - Handles file uploads for after-resolution images/videos.
 * - Shows dynamic form fields based on complaint status and user designation.
 * - Provides validation and feedback for user actions.
 *
 * Usage:
 * Used as a modal in the YourActivity component for complaint actions.
 * Example: <YourActivityPopup ...props />
 *
 * Dependencies:
 * - ComplaintBasicDetails, ComplaintAdditionalDetails: Components for displaying complaint info.
 * - FileUpload: Component for file uploads.
 * - statusOptions: Constants for status dropdowns.
 * - react-toastify for notifications.
 *
 * Notes:
 * - Expects props for selected complaint, status, remarks, price, files, and handlers.
 * - Handles both frontend and backend errors gracefully.
 */

import React from "react";
import ComplaintBasicDetails from "./ComplaintBasicDetails";
import ComplaintAdditionalDetails from "./ComplaintAdditionalDeatils";
import { statusOptions } from "../constants/options";
import { FileUpload } from "./FileUpload";
import { toast } from "react-toastify";

// Helper to get user designation from localStorage
const getUser = () => {
  const designation = localStorage.getItem("designation");
  return { designation };
};

// Helper to check if remark is mandatory for current status/designation
const isRemarkMandatory = (statusChange, selectedComplaint) => {
  const designation = getUser().designation;
  // List of conditions where remark is mandatory (from original code)
  return (
    [
      "RESOURCE_REQUIRED",
      "AE_NOT_SATISFIED",
      "EE_NOT_SATISFIED",
      "resourceRequiredToAeNotTerminated",
      "resourceRequiredToAeTerminated",
      "aeNotTerminatedToResourceRequired",
      "eeNotTerminatedToAeTerminated",
      "eeNotTerminatedToAeNotTerminated",
      "aeTerminatedToEeNotTerminated",
      "aeTerminatedToEeTerminated",
      "jeWorkDoneToCrNotSatisfied",
      "eeAcknowledgedToCrNotSatisfied",
      "eeTerminatedToCrNotTerminated",
    ].includes(statusChange) ||
    (selectedComplaint.status === "RESOURCE_REQUIRED" &&
      statusChange === "RAISED") ||
    (selectedComplaint.status === "CR_NOT_SATISFIED" &&
      [
        "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
        "EXECUTIVE_ENGINEER_IT",
        "ASSISTANT_ENGINEER_CIVIL",
        "ASSISTANT_ENGINEER_ELECTRICAL",
        "ASSISTANT_ENGINEER_IT",
      ].includes(designation))
  );
};

// Main YourActivityPopup component for complaint actions modal
const YourActivityPopup = ({
  selectedComplaint,
  statusChange,
  setStatusChange,
  remark,
  setRemark,
  price,
  setPrice,
  files,
  setFiles,
  closeModal,
  handleStatusChange,
  newDepartment,
  setNewDepartment,
  handleDepartmentChange,
  priceLater,
  setPriceLater
}) => {
  // Compute status change options based on user and complaint status
  const statusChangeOptions =
    [
      "COMPLAINANT",
      "ESTATE_OFFICER",
      "PRINCIPAL",
      "ASSISTANT_TO_ESTATE_OFFICER",
    ].includes(getUser().designation) &&
    selectedComplaint.status === "JE_WORKDONE"
      ? statusOptions["JE_WORKDONE_DISPLAYING_TO_CR"]
      : [
          "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
          "EXECUTIVE_ENGINEER_IT",
          "ASSISTANT_ENGINEER_CIVIL",
          "ASSISTANT_ENGINEER_ELECTRICAL",
          "ASSISTANT_ENGINEER_IT",
        ].includes(getUser().designation) &&
        selectedComplaint.status === "CR_NOT_SATISFIED"
      ? []
      : statusOptions[selectedComplaint.status] || [];

  // Allowed designations for certain actions
  // eslint-disable-next-line no-unused-vars
  const allowedDesignations = [
    "JUNIOR_ENGINEER_CIVIL",
    "JUNIOR_ENGINEER_ELECTRICAL",
    "JUNIOR_ENGINEER_IT",
  ];
  // eslint-disable-next-line no-unused-vars
  const isIT = selectedComplaint.department === "IT";

  // --- REMARKS DISPLAY LOGIC (Unified) ---
  // Display all remarks as a timeline/list
  const renderRemarks = () => {
    if (!selectedComplaint.remarks || selectedComplaint.remarks.length === 0) {
      return (
        <div className="text-gray-500 font-semibold mt-4 mb-4">
          No remarks yet.
        </div>
      );
    }
    return (
      <div className="mt-4 mb-4">
        <div className="font-bold text-lg mb-2 text-green-700">Remarks Timeline:</div>
        <div className="max-h-[200px] overflow-y-auto border border-green-400 p-2 bg-gray-50 rounded">
          {selectedComplaint.remarks.map((r, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">{r.designation || "User"}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500">{r.timestamp ? new Date(r.timestamp).toLocaleString() : ""}</span>
              </div>
              <div className="whitespace-pre-wrap break-words text-gray-900"><strong>Remark:</strong> {r.remark}</div>
              {idx !== selectedComplaint.remarks.length - 1 && <hr className="my-2 border-green-200" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render modal with complaint details, status/remark/price/file fields, and action buttons
  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <ComplaintBasicDetails complaint={selectedComplaint} />

          <ComplaintAdditionalDetails complaint={selectedComplaint} />

          {/* Unified remarks display */}
          {renderRemarks()}

          {selectedComplaint.status === "RAISED" && (
            <div className="mt-3">
              <h2 className="font-bold text-lg mb-2">Change Department</h2>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
              >
                <option value="">Select Department</option>
                <option value="CIVIL">CIVIL</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="IT">IT</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleDepartmentChange}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Change Department
                </button>
              </div>
            </div>
          )}

          {statusChangeOptions.length > 0 ? (
            <div className="mt-4">
              <label className="text-lg font-bold" htmlFor="statusChange">
                Change Status:
              </label>
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
          ) : [
              "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
              "EXECUTIVE_ENGINEER_IT",
              "",
            ].includes(getUser().designation) ? (
            setStatusChange("eeRemarkWhenCrNotSatisfied")
          ) : [
              "ASSISTANT_ENGINEER_CIVIL",
              "ASSISTANT_ENGINEER_ELECTRICAL",
              "ASSISTANT_ENGINEER_IT",
            ].includes(getUser().designation) ? (
            setStatusChange("aeRemarkWhenCrNotSatisfied")
          ) : null}

          {/* --- REMARK FIELD: Always show, mandatory for some, optional for others --- */}
          <div className="mt-4">
            <label htmlFor="remark" className="font-bold">
              Enter Remark:{" "}
              {isRemarkMandatory(statusChange, selectedComplaint) && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <div className="mt-2">
              <textarea
                id="remark-text"
                className="block mt-2 p-2 border rounded w-full"
                placeholder={
                  isRemarkMandatory(statusChange, selectedComplaint)
                    ? "Enter remark (required)"
                    : "Enter remark (optional)"
                }
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required={isRemarkMandatory(statusChange, selectedComplaint)}
              />
            </div>
          </div>
          {/* --- END REMARK FIELD --- */}

          {(statusChange === "EE_ACKNOWLEDGED" ||
            statusChange === "crNotSatisfiedToEeAcknowledged") && (
            <div className="mt-4">
              <label htmlFor="price">Enter Expenditure:</label>
              <div className="mt-2">
                <input
                  id="price-input"
                  type="number"
                  className="block mt-2 p-2 border rounded w-full"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) {
                      toast.error("Price cannot be negative.");
                      setPrice("0");
                    } else {
                      setPrice(e.target.value);
                    }
                  }}
                  min={0}
                  disabled={priceLater} 
                />
                <div className="mt-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={priceLater}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setPriceLater(checked);
                        if (checked) {
                          setPrice("0");    
                        } else {
                          setPrice("");      
                        }
                      }}
                    />
                    <span className="ml-2">Will be entered later</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {(statusChange === "JE_WORKDONE" ||
            statusChange === "crNotSatisfiedToJeWorkdone") && (
            <>
              <div className="text-red-500 mt-2 text-wrap">
                <strong>Warning:</strong> The file must meet the following size
                restrictions:
                <ul className="list-disc pl-4">
                  <li>Videos: Maximum size 100MB</li>
                  <li>Images: Maximum size 5MB</li>
                </ul>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-6 p-6 bg-gray-100 rounded-md shadow-lg">
                {/* Image After 1 */}
                <FileUpload
                  id="imgAfter_1"
                  name="imgAfter_1"
                  label="Image 1 - After"
                  fileType="image"
                  files={files}
                  setFiles={setFiles}
                />

                {/* Image After 2 */}
                <FileUpload
                  id="imgAfter_2"
                  name="imgAfter_2"
                  label="Image 2 - After"
                  fileType="image"
                  files={files}
                  setFiles={setFiles}
                  dependentFileKey="imgAfter_1"
                />

                {/* Image After 3 */}
                <FileUpload
                  id="imgAfter_3"
                  name="imgAfter_3"
                  label="Image 3 - After"
                  fileType="image"
                  files={files}
                  setFiles={setFiles}
                  dependentFileKey="imgAfter_2"
                />

                {/* Video After */}
                <FileUpload
                  id="vidAfter"
                  name="vidAfter"
                  label="Video After"
                  fileType="video"
                  files={files}
                  setFiles={setFiles}
                />
              </div>
            </>
          )}

          {statusChange === "JE_WORKDONE" &&
            !(
              files.imgAfter_1 ||
              files.imgAfter_2 ||
              files.imgAfter_3 ||
              files.vidAfter
            ) && (
              <div className="text-red-500 mt-2">
                <p>
                  <strong>Warning:</strong> You must upload at least one image
                  or a video.
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
              id="popup-submit"
              onClick={handleStatusChange}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={isRemarkMandatory(statusChange, selectedComplaint) && !remark}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default YourActivityPopup;