/*
 * YourActivity.js
 *
 * Purpose:
 * This React component displays and manages the complaints assigned to the current user based on their designation.
 * It allows users to update complaint status, upload resolution files, change departments, and view complaint details.
 *
 * Features:
 * - Fetches complaints for the logged-in user's designation.
 * - Allows status updates, remarks, price entry, and department changes.
 * - Handles file uploads for after-resolution images/videos.
 * - Displays a modal popup for detailed complaint actions.
 * - Shows a timer for each complaint and loading spinner during operations.
 * - Provides confirmation dialogs and toast notifications for user actions.
 *
 * Usage:
 * Used by staff and engineers to manage their assigned complaints. Should be rendered in a protected route or dashboard.
 * Example: <YourActivity setComplaintCount={setComplaintCount} handleComplaintStatusChange={handleComplaintStatusChange} />
 *
 * Dependencies:
 * - yourActivity.js: API services for complaint actions.
 * - ComplaintBasicDetails, YourActivityPopup, Spinner, Timer: UI components.
 * - react-toastify for notifications.
 * - confirmAction utility for confirmation dialogs.
 *
 * Notes:
 * - Expects backend to support complaint status updates and file uploads.
 * - Handles both frontend and backend errors gracefully.
 */

import React, { useState, useEffect } from "react";
import {
  fetchComplaintsByDesignation,
  updateStatus,
  updateWorkDone,
  changeDepartment,
} from "../services/yourActivity";
import { designationFormat } from "../utils/formatting";
import YourActivityPopup from "./YourActivityPopup";
import ComplaintBasicDetails from "./ComplaintBasicDetails";
import { toast } from "react-toastify";
import confirmAction from "../utils/confirmAction ";
import Spinner from "./Spinner";
import { Timer } from "./Timer";

// Helper to get user designation from localStorage
const getUser = () => {
  const designation = localStorage.getItem("designation");
  return { designation };
};

// Main YourActivity component for managing assigned complaints
const YourActivity = ({ setComplaintCount, handleComplaintStatusChange }) => {
  // State for complaints, selected complaint, status, remarks, price, files, loading, etc.
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusChange, setStatusChange] = useState("");
  const [remark, setRemark] = useState("");
  const [price, setPrice] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [priceLater, setPriceLater] = useState(false);
  const [files, setFiles] = useState({
    imgAfter_1: null,
    imgAfter_2: null,
    imgAfter_3: null,
    vidAfter: null,
  });
  const [loading, setLoading] = useState(true);

  // Fetch complaints for user on mount
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await fetchComplaintsByDesignation();
      setComplaints(data);
    } catch (err) {
      toast.error(err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handlers for opening/closing modal and resetting state
  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusChange("");
    setRemark("");
    setPrice("");
    setPriceLater(false);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setFiles({
      imgAfter: null,
      vidAfter: null,
    });
    setPrice("");
    setRemark("");
    setStatusChange("");
    setPriceLater(false);
  };

  // Handler for changing department
  const handleDepartmentChange = async () => {
    if (!newDepartment) {
      toast.error("Please select a new department.");
      return;
    }

    const isConfirmed = await confirmAction(
      "Are you sure you want to change the department?"
    );
    if (!isConfirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await changeDepartment({
        id: selectedComplaint._id,
        newDepartment,
      });
      toast.success(response.message);
      closeModal();
      setComplaintCount((prevCount) => prevCount - 1);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
    await fetchComplaints();
  };

  // Handler for updating complaint status and uploading files
  const handleStatusChange = async () => {
    const isConfirmed = await confirmAction(
      `Are you sure you want to update the complaint?`
    );
    if (!isConfirmed) {
      return;
    }

    if (
      !statusChange &&
      (selectedComplaint.status !== "CR_NOT_SATISFIED" &&
        ![
          "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL",
          "EXECUTIVE_ENGINEER_IT",
          "ASSISTANT_ENGINEER_CIVIL",
          "ASSISTANT_ENGINEER_ELECTRICAL",
          "ASSISTANT_ENGINEER_IT",
        ].includes(getUser().designation))
    ) {
      toast.error("Choose the status to change");
      return;
    }

    if (
      statusChange === "JE_WORKDONE" &&
      !files.imgAfter_1 &&
      !files.imgAfter_2 &&
      !files.imgAfter_3 &&
      !files.vidAfter
    ) {
      toast.error("At least one file must be uploaded.");
      return;
    }

    // Always build remark array: empty if no text, else array with one object
    let remarkArr = [];
    if (remark && remark.trim() !== "") {
      remarkArr = [
        {
          timestamp: new Date().toISOString(),
          designation: designationFormat(getUser().designation),
          remark: remark,
        },
      ];
    }


    let body;
    let endpoint = "";

    // Handle file upload cases (FormData)
    if (
      statusChange === "JE_WORKDONE" ||
      statusChange === "crNotSatisfiedToJeWorkdone"
    ) {
      body = new FormData();
      body.append("id", selectedComplaint._id);
      if (files.imgAfter_1) body.append("imgAfter_1", files.imgAfter_1);
      if (files.imgAfter_2) body.append("imgAfter_2", files.imgAfter_2);
      if (files.imgAfter_3) body.append("imgAfter_3", files.imgAfter_3);
      if (files.vidAfter) body.append("vidAfter", files.vidAfter);
      // Always attach remark array (empty or with one object)
      body.append("remark", JSON.stringify(remarkArr));
      endpoint =
        statusChange === "JE_WORKDONE"
          ? "je-acknowledged/je-workdone"
          : "cr-not-satisfied/je-workdone";
    } else {
      // All other cases: always send remark array
      body = {
        id: selectedComplaint._id,
        remark: remarkArr,
      };
      if (
        getUser().designation === "EXECUTIVE_ENGINEER_IT" &&
        statusChange === "APPROVE"
      ) {
        endpoint = "ae-acknowledged/ee-acknowledged";
        body["price"] = price;
        body["priceLater"] = priceLater;
      }
      switch (statusChange) {
        case "JE_ACKNOWLEDGED":
          endpoint = "raised/je-acknowledged";
          break;
        case "RESOURCE_REQUIRED":
          endpoint = "raised/resource-required";
          break;
        case "AE_ACKNOWLEDGED":
          endpoint = "je-workdone/ae-acknowledged";
          break;
        case "AE_NOT_SATISFIED":
          endpoint = "je-workdone/ae-not-satisfied";
          break;
        case "EE_ACKNOWLEDGED":
          endpoint = "ae-acknowledged/ee-acknowledged";
          body["price"] = price;
          body["priceLater"] = priceLater;
          break;
        case "EE_NOT_SATISFIED":
          endpoint = "ae-acknowledged/ee-not-satisfied";
          break;
        case "RESOLVED":
          endpoint = "ee-acknowledged/resolved";
          break;
        case "RAISED":
          endpoint = "resource-required/raised";
          break;
        case "aeNotTerminatedToRaised":
          endpoint = "ae-not-terminated/raised";
          break;
        case "eeAcknowledgedToCrNotSatisfied":
          endpoint = "ee-acknowledged/cr-not-satisfied";
          break;
        case "aeNotTerminatedToResourceRequired":
          endpoint = "ae-not-terminated/resource-required";
          break;
        case "resourceRequiredToAeNotTerminated":
          endpoint = "resource-required/ae-not-terminated";
          break;
        case "resourceRequiredToAeTerminated":
          endpoint = "resource-required/ae-terminated";
          break;
        case "aeTerminatedToEeNotTerminated":
          endpoint = "ae-terminated/ee-not-terminated";
          break;
        case "eeNotTerminatedToAeTerminated":
          endpoint = "ee-not-terminated/ae-terminated";
          break;
        case "aeTerminatedToEeTerminated":
          endpoint = "ae-terminated/ee-terminated";
          break;
        case "eeTerminatedToTerminated":
          endpoint = "ee-terminated/terminated";
          break;
        case "eeNotTerminatedToAeNotTerminated":
          endpoint = "ee-not-terminated/ae-not-terminated";
          break;
        case "jeWorkDoneToResolved":
          endpoint = "je-workdone/resolved";
          break;
        case "jeWorkDoneToCrNotSatisfied":
          endpoint = "je-workdone/cr-not-satisfied";
          break;
        case "aeRemarkWhenCrNotSatisfied":
          endpoint = "ae-remark/cr-not-satisfied";
          break;
        case "eeRemarkWhenCrNotSatisfied":
          endpoint = "ee-remark/cr-not-satisfied";
          break;
        case "eeTerminatedToCrNotTerminated":
          endpoint = "ee-terminated/cr-not-terminated";
          break;
        default:
          // For all other status changes, use generic endpoint if needed
          break;
      }
    }

    try {
      setLoading(true);
      let response;
      if (
        statusChange === "JE_WORKDONE" ||
        statusChange === "crNotSatisfiedToJeWorkdone"
      ) {
        response = await updateWorkDone(body, endpoint);
      } else {
        response = await updateStatus(body, endpoint);
      }

      toast.success(response.message);
      closeModal();
      if (statusChange !== "JE_ACKNOWLEDGED") {
        setComplaintCount((prevCount) => prevCount - 1);
      }
      if (
        ["RESOLVED", "eeTerminatedToTerminated", "jeWorkDoneToResolved"].includes(
          statusChange
        )
      ) {
        handleComplaintStatusChange(selectedComplaint._id, statusChange);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
    await fetchComplaints();
  };

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h1 className="text-xl font-bold text-green-700 mb-4">Your Activity</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => {
              let bgColor = "p-4 shadow-md rounded-lg border";
              if (complaint.status === "RESOLVED") {
                bgColor += " bg-green-100 border-green-300";
              } else if (complaint.emergency) {
                bgColor += " bg-red-100 border-red-300";
              } else {
                bgColor += " bg-yellow-100 border-yellow-300";
              }

              return (
                <div key={complaint._id} className={bgColor}>
                  <div className="mb-4">
                    <ComplaintBasicDetails complaint={complaint} />
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
                    <Timer
                      createdAt={complaint.createdAt}
                      isEmergency={complaint.emergency}
                    />
                    <button
                      onClick={() => openModal(complaint)}
                      className="mt-8 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 min-w-20 max-h-11"
                      id={`update-button-${complaint._id}`}
                    >
                      Update
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-green-700">No complaints.</p>
          )}
        </div>
      )}

      {/*POP UP WINDOW*/}
      {selectedComplaint && (
        <YourActivityPopup
          selectedComplaint={selectedComplaint}
          statusChange={statusChange}
          setStatusChange={setStatusChange}
          remark={remark}
          setRemark={setRemark}
          price={price}
          setPrice={setPrice}
          files={files}
          setFiles={setFiles}
          closeModal={closeModal}
          handleStatusChange={handleStatusChange}
          newDepartment={newDepartment}
          setNewDepartment={setNewDepartment}
          handleDepartmentChange={handleDepartmentChange}
          priceLater={priceLater}
          setPriceLater={setPriceLater}
        />
      )}
    </div>
  );
};

export default YourActivity;