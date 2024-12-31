import React, { useState, useEffect } from "react";
import {
  fetchComplaintsByDesignation,
  updateStatus,
  updateWorkDone,
} from "../services/yourActivity";
import { dateFormat, statusFormat } from "../utils/formatting";
import YourActivityPopup from "./YourActivityPopup";

const YourActivity = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusChange, setStatusChange] = useState("");
  const [remark, setRemark] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState({
    imgAfter: null,
    vidAfter: null,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const minImageSize = 1 * 1024 * 1024;
    const maxImageSize = 5 * 1024 * 1024;
    const minVideoSize = 5 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    if (file.type.startsWith("image")) {
      if (file.size < minImageSize) {
        alert("Image file size should be at least 1MB.");
        return;
      }
      if (file.size > maxImageSize) {
        alert("Image file size should not exceed 5MB.");
        return;
      }
    }

    if (file.type.startsWith("video")) {
      if (file.size < minVideoSize) {
        alert("Video file size should be at least 5MB.");
        return;
      }
      if (file.size > maxVideoSize) {
        alert("Video file size should not exceed 100MB.");
        return;
      }
    }

    setFiles((prevFiles) => ({
      ...prevFiles,
      [event.target.name]: file,
    }));
  };

  const fetchComplaints = async () => {
    try {
      const data = await fetchComplaintsByDesignation();
      setComplaints(data);
    } catch (err) {
      alert(err);
      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusChange("");
    setRemark("");
    setPrice("");
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
  };

  const handleStatusChange = async () => {
    if (!statusChange) {
      alert("Choose the status to change");
      return;
    }

    if (statusChange === "JE_WORKDONE" && !files.imgAfter && !files.vidAfter) {
      alert("At least one file must be uploaded.");
      return;
    }

    // Prompt for confirmation before submitting
    const isConfirmed = window.confirm(
      "Are you sure you want to update the complaint?"
    );
    if (!isConfirmed) {
      return;
    }

    let body = {};
    body["id"] = selectedComplaint._id;
    let endpoint = "";

    switch (statusChange) {
      case "JE_ACKNOWLEDGED":
        endpoint = "raised/je-acknowledged";
        break;
      case "RESOURCE_REQUIRED":
        endpoint = "raised/resource-required";
        body["remark_JE"] = remark;
        break;
      case "AE_ACKNOWLEDGED":
        endpoint = "je-workdone/ae-acknowledged";
        break;
      case "AE_NOT_SATISFIED":
        endpoint = "je-workdone/ae-not-satisfied";
        body["remark_AE"] = remark;
        break;
      case "EE_ACKNOWLEDGED":
        endpoint = "ae-acknowledged/ee-acknowledged";
        body["price"] = price;
        break;
      case "EE_NOT_SATISFIED":
        endpoint = "ae-acknowledged/ee-not-satisfied";
        body["remark_EE"] = remark;
        break;
      case "RESOLVED":
        endpoint = "ee-acknowledged/resolved";
        break;
      case "CLOSED":
        endpoint = "resource-required/closed";
        break;
      case "RAISED":
        endpoint = "resource-required/raised";
        body["remark_CR"] = remark;
        break;
      case "JE_WORKDONE":
        endpoint = "je-acknowledged/je-workdone";
        body = new FormData();
        body.append("id", selectedComplaint._id);
        if (files.imgAfter) body.append("imgAfter", files.imgAfter);
        if (files.vidAfter) body.append("vidAfter", files.vidAfter);
        break;
      default:
        break;
    }

    try {
      let response;
      if (statusChange === "JE_WORKDONE") {
        response = await updateWorkDone(body);
      } else {
        response = await updateStatus(body, endpoint);
      }

      alert(response.message);
      closeModal();
      await fetchComplaints();
    } catch (error) {
      alert(error);
      await fetchComplaints();
    }
  };

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            className={`p-4 shadow-md rounded-lg border relative ${
              complaint.emergency
                ? "bg-red-100 border-red-200" // Light red background for emergencies
                : "bg-white border-green-200" // Default for non-emergency complaints
            }`}
          >
            <div className="mb-10">
              <h3
                className={`text-xl font-bold ${
                  complaint.emergency ? "text-red-800" : "text-green-800"
                }`}
              >
                {complaint.subject}
              </h3>
              <p className="text-lg font-medium mt-2">
                <strong>Complaint ID:</strong> {complaint._id}
              </p>
              <p>
                <strong>Raiser:</strong> {complaint.raiserName}
              </p>
              <p>
                <strong>Department:</strong> {complaint.department}
              </p>
              <p>
                <strong>Premises:</strong> {complaint.premises}
              </p>
              <p>
                <strong>Location:</strong> {complaint.location}
              </p>
              <p>
                <strong>Created On:</strong> {dateFormat(complaint.createdAt)}
              </p>
              <p className="text-red-600 font-bold text-lg">
                <strong>Status:</strong> {statusFormat(complaint.status)}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => openModal(complaint)}
                className="absolute bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded"
                id={`update-button-${complaint._id}`}
              >
                Update
              </button>
            </div>
          </div>        
        ))}
      </div>

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
          handleFileChange={handleFileChange}
          closeModal={closeModal}
          handleStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default YourActivity;
