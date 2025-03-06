import React, { useState, useEffect } from "react";
import {
  fetchComplaintsByDesignation,
  updateStatus,
  updateWorkDone,
  changeDepartment,
} from "../services/yourActivity";
import YourActivityPopup from "./YourActivityPopup";
import ComplaintBasicDetails from "./ComplaintBasicDetails";
import { toast } from "react-toastify";
import confirmAction from "../utils/confirmAction ";
import Spinner from "./Spinner";
import { Timer } from "./Timer";

const getUser = () => {
  const designation = localStorage.getItem("designation");
  return { designation };
};

const YourActivity = ({ setComplaintCount }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusChange, setStatusChange] = useState("");
  const [remark, setRemark] = useState("");
  const [price, setPrice] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [files, setFiles] = useState({
    imgAfter_1: null,
    imgAfter_2: null,
    imgAfter_3: null,
    vidAfter: null,
  });
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async () => {
    const isConfirmed = await confirmAction(
      `Are you sure you want to update the complaint?`
    );
    if (!isConfirmed) {
      return;
    }

    if (!statusChange && (selectedComplaint.status !== "CR_NOT_SATISFIED" && !["EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL", "EXECUTIVE_ENGINEER_IT", "ASSISTANT_ENGINEER_CIVIL", "ASSISTANT_ENGINEER_ELECTRICAL", "ASSISTANT_ENGINEER_IT"].includes(getUser().designation))) {
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
      case "RAISED":
        endpoint = "resource-required/raised";
        body["remark_CR"] = remark;
        break;
      case "JE_WORKDONE":
        endpoint = "je-acknowledged/je-workdone";
        body = new FormData();
        body.append("id", selectedComplaint._id);
        if (files.imgAfter_1) body.append("imgAfter_1", files.imgAfter_1);
        if (files.imgAfter_2) body.append("imgAfter_2", files.imgAfter_2);
        if (files.imgAfter_3) body.append("imgAfter_3", files.imgAfter_3);
        if (files.vidAfter) body.append("vidAfter", files.vidAfter);
        break;
      case "crNotSatisfiedToEeAcknowledged":
          endpoint = "cr-not-satisfied/ee-acknowledged";
          body["price"] = price;
          break;
      case "crNotSatisfiedToEeNotSatisfied":
          body["remark_EE"] = remark;
          endpoint = "cr-not-satisfied/ee-not-satisfied";
          break;
      case "aeNotTerminatedToRaised":
          endpoint = "ae-not-terminated/raised";
          break;
      case "eeAcknowledgedToCrNotSatisfied":
          body["remark_CR"] = remark;
          endpoint = "ee-acknowledged/cr-not-satisfied";
          break;
      case "aeNotTerminatedToResourceRequired":
          body["remark_JE"] = remark;
          endpoint = "ae-not-terminated/resource-required";
          break;
      case "resourceRequiredToAeNotTerminated":
          body["remark_AE"] = remark;
          endpoint = "resource-required/ae-not-terminated";
          break;
      case "resourceRequiredToAeTerminated":
          body["remark_AE"] = remark;
          endpoint = "resource-required/ae-terminated";
          break;
      case "aeTerminatedToEeNotTerminated":
          body["remark_EE"] = remark;
          endpoint = "ae-terminated/ee-not-terminated";
          break;
      case "eeNotTerminatedToAeTerminated":
          body["remark_AE"] = remark;
          endpoint = "ee-not-terminated/ae-terminated";
          break;
      case "aeTerminatedToEeTerminated":
          body["remark_EE"] = remark;
          endpoint = "ae-terminated/ee-terminated";
          break;
      case "eeTerminatedToTerminated":
          endpoint = "ee-terminated/terminated";
          break;
      case "eeNotTerminatedToAeNotTerminated":
          body["remark_AE"] = remark;
          endpoint = "ee-not-terminated/ae-not-terminated";
          break;
      case "jeWorkDoneToResolved":
            endpoint = "je-workdone/resolved";
            break;
      case "jeWorkDoneToCrNotSatisfied":
            body["remark_CR"] = remark;
            endpoint = "je-workdone/cr-not-satisfied";
            break;
      case "crNotSatisfiedToJeWorkdone":
            endpoint = "cr-not-satisfied/je-workdone";
            body = new FormData();
            body.append("id", selectedComplaint._id);
            if (files.imgAfter_1) body.append("imgAfter_1", files.imgAfter_1);
            if (files.imgAfter_2) body.append("imgAfter_2", files.imgAfter_2);
            if (files.imgAfter_3) body.append("imgAfter_3", files.imgAfter_3);
            if (files.vidAfter) body.append("vidAfter", files.vidAfter);
            break;
      case "aeRemarkWhenCrNotSatisfied":
            body["remark"] = remark;
            endpoint = "ae-remark/cr-not-satisfied";
            break;
      case "eeRemarkWhenCrNotSatisfied":
            body["remark"] = remark;
            endpoint = "ee-remark/cr-not-satisfied";
            break;
      default:
          break;
    }

    try {
      setLoading(true);
      let response;
      if (statusChange === "JE_WORKDONE" || statusChange === "crNotSatisfiedToJeWorkdone") {
        response = await updateWorkDone(body,endpoint);
      } else {
        response = await updateStatus(body, endpoint);
      }

      toast.success(response.message);
      closeModal();
      if (statusChange !== "JE_ACKNOWLEDGED") {
        setComplaintCount((prevCount) => prevCount - 1);
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
        />
      )}
    </div>
  );
};

export default YourActivity;
