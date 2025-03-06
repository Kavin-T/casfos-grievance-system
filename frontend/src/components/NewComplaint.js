import React, { useState } from "react";
import {
  ClipboardIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { addComplaint } from "../services/complaintApi";
import { toast } from "react-toastify";
import confirmAction from "../utils/confirmAction ";
import { locationOptions, subjectOptions } from "../constants/options";
import Spinner from "./Spinner";
import { FileUpload } from "./FileUpload";

const getUser = () => {
  const user = localStorage.getItem("username");
  return { username: user };
};

export default function NewComplaint() {
  const [formData, setFormData] = useState({
    complainantName: getUser().username,
    subject: "",
    date: "",
    details: "",
    department: "",
    premises: "",
    location: "",
    specificLocation: "",
  });

  const [otherLocation, setOtherLocation] = useState("");
  const [otherPremises, setOtherPremises] = useState("");
  const [otherSubject, setOtherSubject] = useState("");

  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [files, setFiles] = useState({
    imgBefore_1: null,
    imgBefore_2: null,
    imgBefore_3: null,
    vidBefore: null,
  });

  const handlePremisesChange = (e) => {
    const selectedPremises = e.target.value;
    setFormData((prev) => ({
      ...prev,
      premises: selectedPremises,
      location: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = await confirmAction(
      `Are you sure you want to submit the form?`
    );
    if (!isConfirmed) {
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    if (formData["subject"] === "Other") {
      data.set("subject", otherSubject);
    }

    if (formData["premises"] === "Other") {
      data.set("premises", otherPremises);
    }

    if (formData["location"] === "Other") {
      data.set("location", otherLocation);
    }

    data.append("emergency", isEmergency);

    if (files.imgBefore_1) data.append("imgBefore_1", files.imgBefore_1);
    if (files.imgBefore_2) data.append("imgBefore_2", files.imgBefore_2);
    if (files.imgBefore_3) data.append("imgBefore_3", files.imgBefore_3);
    if (files.vidBefore) data.append("vidBefore", files.vidBefore);

    try {
      const response = await addComplaint(data);

      toast.success(response.message);

      setFormData({
        complainantName: getUser().username,
        subject: "",
        date: "",
        details: "",
        department: "",
        premises: "",
        location: "",
        specificLocation: "",
      });

      setOtherPremises("");
      setOtherLocation("");
      setOtherSubject("");
      setIsEmergency(false);

      setFiles({
        imgBefore_1: null,
        imgBefore_2: null,
        imgBefore_3: null,
        vidBefore: null,
      });
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Complainant Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="complainantName"
              required
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={formData.complainantName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Subject Select */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Subject <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ClipboardIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <select
              name="subject"
              required
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={formData.subject}
              onChange={handleInputChange}
            >
              <option value="">Select subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Show input for custom subject when "Other" is selected */}
        {formData.subject === "Other" && (
          <div>
            <label
              htmlFor="customSubject"
              className="block text-sm font-medium text-gray-700"
            >
              Specify Other Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customSubject"
              required
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={otherSubject}
              onChange={(e) => setOtherSubject(e.target.value)}
            />
          </div>
        )}

        {/* Date picker */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Incident <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="date"
              name="date"
              required
              className="focus:ring-green-500 focus:border-green-500 block w-50 pl-10 sm:text-sm border-gray-300 rounded-md"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Details textarea */}
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700"
          >
            Details <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              name="details"
              required
              rows={3}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              value={formData.details}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Department select */}
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="">Select a department</option>
            <option value="CIVIL">Civil</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="IT">IT</option>
          </select>
        </div>

        {/* Premises Select */}
        <div>
          <label
            htmlFor="premises"
            className="block text-sm font-medium text-gray-700"
          >
            Premises <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BuildingOfficeIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <select
              name="premises"
              required
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={formData.premises}
              onChange={handlePremisesChange}
            >
              <option value="">Select premises</option>
              {Object.keys(locationOptions).map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {formData.premises === "Other" && (
          <div>
            <label
              htmlFor="otherPremises"
              className="block text-sm font-medium text-gray-700"
            >
              Specify Other Premises <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="otherPremises"
              required
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={otherPremises}
              onChange={(e) => setOtherPremises(e.target.value)}
            />
          </div>
        )}

        {/* Location Select */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <select
              name="location"
              required
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={formData.location}
              onChange={(e) => {
                handleInputChange(e); // Update formData with selected location
                if (e.target.value !== "Other") {
                  setOtherLocation(""); // Clear the "Other Location" field if not selected
                }
              }}
              disabled={
                !formData.premises ||
                (formData.premises === "Other" && !otherPremises.trim())
              }
            >
              <option value="">Select location</option>
              {formData.premises &&
                locationOptions[formData.premises]?.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Other Location Text Box */}
        {formData.location === "Other" && (
          <div>
            <label
              htmlFor="otherLocation"
              className="block text-sm font-medium text-gray-700"
            >
              Specify Other Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="otherLocation"
              required
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={otherLocation}
              onChange={(e) => setOtherLocation(e.target.value)}
            />
          </div>
        )}

        {/* Specific Location Text Box */}
        <div>
          <label
            htmlFor="specificLocation"
            className="block text-sm font-medium text-gray-700"
          >
            Specific Location
          </label>
          <input
            type="text"
            name="specificLocation"
            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.specificLocation}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                specificLocation: e.target.value,
              }))
            }
          />
        </div>

        {/* Emergency checkbox */}
        <div className="flex items-center">
          <input
            id="isEmergency"
            type="checkbox"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            checked={isEmergency}
            onChange={() => setIsEmergency(!isEmergency)}
          />
          <label
            htmlFor="isEmergency"
            className="ml-2 block text-sm text-gray-700"
          >
            Mark as Emergency
          </label>
        </div>

        <div className="text-red-500 mt-2 text-wrap">
          <strong>Warning:</strong> The file must meet the following size
          restrictions:
          <ul className="list-disc pl-4">
            <li>Videos: Maximum size 100MB</li>
            <li>Images: Maximum size 5MB</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-100 rounded-md shadow-lg">
          {/* Image Before 1 */}
          <FileUpload
            id="imgBefore_1"
            name="imgBefore_1"
            label="Image 1 - Before"
            fileType="image"
            files={files}
            setFiles={setFiles}
          />

          {/* Image Before 2 */}
          <FileUpload
            id="imgBefore_2"
            name="imgBefore_2"
            label="Image 2 - Before"
            fileType="image"
            files={files}
            setFiles={setFiles}
            dependentFileKey="imgBefore_1"
          />

          {/* Image Before 3 */}
          <FileUpload
            id="imgBefore_3"
            name="imgBefore_3"
            label="Image 3 - Before"
            fileType="image"
            files={files}
            setFiles={setFiles}
            dependentFileKey="imgBefore_2"
          />

          {/* Video Before */}
          <FileUpload
            id="vidBefore"
            name="vidBefore"
            label="Video Before"
            fileType="video"
            files={files}
            setFiles={setFiles}
          />
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>
      {isSubmitting && <Spinner />}
    </>
  );
}
