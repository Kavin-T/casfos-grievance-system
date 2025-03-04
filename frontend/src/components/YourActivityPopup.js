import React from "react";
import ComplaintBasicDetails from "./ComplaintBasicDetails";
import ComplaintAdditionalDetails from "./ComplaintAdditionalDeatils";
import { statusOptions } from "../constants/options";
import { FileUpload } from "./FileUpload";

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
}) => {
  const statusChangeOptions = statusOptions[selectedComplaint.status] || [];

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <ComplaintBasicDetails complaint={selectedComplaint} />

          <ComplaintAdditionalDetails complaint={selectedComplaint} />

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

          {selectedComplaint.status === "CR_NOT_SATISFIED" &&
            selectedComplaint.remark_CR && (
              <RemarkDisplay
                remark={selectedComplaint.remark_CR}
                label="CR Remark :"
              />
            )}

            {selectedComplaint.status === "AE_NOT_TERMINATED" &&
            selectedComplaint.remark_AE && (
              <RemarkDisplay
                remark={selectedComplaint.remark_AE}
                label="AE Remark :"
              />
            )}

            {selectedComplaint.status === "AE_TERMINATED" &&
            selectedComplaint.remark_AE && (
              <RemarkDisplay
                remark={selectedComplaint.remark_AE}
                label="AE Remark :"
              />
            )}

            {selectedComplaint.status === "EE_TERMINATED" &&
            selectedComplaint.remark_EE && (
              <RemarkDisplay
                remark={selectedComplaint.remark_EE}
                label="EE Remark :"
              />
            )}

            {selectedComplaint.status === "EE_NOT_TERMINATED" &&
            selectedComplaint.remark_EE && (
              <RemarkDisplay
                remark={selectedComplaint.remark_AE}
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

          {([
            "RESOURCE_REQUIRED",
            "AE_NOT_SATISFIED",
            "EE_NOT_SATISFIED","eeAcknowledgedToCrNotSatisfied","resourceRequiredToAeNotTerminated",
            "resourceRequiredToAeTerminated","crNotSatisfiedToEeNotSatisfied","aeNotTerminatedToResourceRequired",
            "eeNotTerminatedToAeNotTerminated", "eeNotTerminatedToAeNotTerminated",
            "aeTerminatedToEeNotTerminated", "aeTerminatedToEeTerminated"
          ].includes(statusChange) ||
            (selectedComplaint.status === "RESOURCE_REQUIRED" &&
              statusChange === "RAISED")) && (
            <div className="mt-4">
              <label htmlFor="remark">Enter Remark:</label>
              <div className="mt-2">
                <textarea
                  id="remark-text"
                  className="block mt-2 p-2 border rounded w-full"
                  placeholder="Enter remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
          )}

          {(statusChange === "EE_ACKNOWLEDGED" || statusChange=== "crNotSatisfiedToEeAcknowledged")&& (
            <div className="mt-4">
              <label htmlFor="price">Enter Expenditure:</label>
              <div className="mt-2">
                <input
                  id="price-input"
                  type="number"
                  className="block mt-2 p-2 border rounded w-full"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={1}
                />
              </div>
            </div>
          )}

          {statusChange === "JE_WORKDONE" && (
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
