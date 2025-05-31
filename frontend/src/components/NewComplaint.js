/*
 * NewComplaint.js
 *
 * Purpose:
 * This React component provides a form for users to submit new complaints in the CASFOS Grievance Redressal System.
 * It handles form state, validation, file uploads, and submission to the backend API.
 *
 * Features:
 * - Form fields for complainant name, subject, date, details, department, premises, location, and specific location.
 * - Custom subject, premises, and location fields when 'Other' is selected.
 * - Emergency checkbox and file uploads for images/videos before incident.
 * - Comprehensive validation for all fields and file uploads.
 * - Displays error messages and toast notifications.
 * - Shows a spinner during submission.
 *
 * Usage:
 * Used as the main form for submitting new complaints. Should be rendered in a protected route or dashboard.
 * Example: <NewComplaint />
 *
 * Dependencies:
 * - addComplaint: API service for submitting complaints (../services/complaintApi).
 * - FileUpload: Component for file uploads.
 * - react-toastify for notifications.
 * - @heroicons/react for icons.
 *
 * Notes:
 * - Expects user info in localStorage.
 * - Handles both frontend and backend errors gracefully.
 */

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

// Helper to get user info from localStorage
const getUser = () => {
  const user = localStorage.getItem("username");
  return { username: user };
};

// Main NewComplaint component for complaint submission
export default function NewComplaint() {
  // State for form fields, custom fields, emergency, submission, and files
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

  // Handler for premises change
  const handlePremisesChange = (e) => {
    const selectedPremises = e.target.value;
    setFormData((prev) => ({
      ...prev,
      premises: selectedPremises,
      location: "",
    }));
  };

  // Generic handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isConfirmed = await confirmAction(
      `Are you sure you want to submit the form?`
    );
    if (!isConfirmed) {
      return;
    }
  
    // Collect reasons for errors
    const reasons = [];
  
    // Complainant Name Validation (No special symbols)
    if (!formData.complainantName || formData.complainantName.trim() === "") {
      reasons.push("Complainant name is required.");
    } else if (!/^[a-zA-Z\s]+$/.test(formData.complainantName)) {
      reasons.push("Complainant name must contain only alphabets and spaces.");
    }
  
    // Subject Validation
    if (!formData.subject || formData.subject.trim() === "") {
      reasons.push("Subject is required.");
    } else if (formData.subject === "Other" && (!otherSubject || otherSubject.trim() === "")) {
      reasons.push("Custom subject is required when 'Other' is selected.");
    } else if (formData.subject === "Other" && /[^a-zA-Z0-9\s]/.test(otherSubject)) {
      reasons.push("Custom subject must not contain special symbols.");
    }
  
    // Date of Incident Validation
    if (!formData.date || formData.date.trim() === "") {
      reasons.push("Date of incident is required.");
    } else if (new Date(formData.date) > new Date()) {
      reasons.push("Date of incident cannot be in the future.");
    }
  
    // Details Validation (No special symbols)
    if (!formData.details || formData.details.trim() === "") {
      reasons.push("Details are required.");
    } else if (formData.details.length < 20) {
      reasons.push("Details must be at least 20 characters long.");
    } else if (/[^a-zA-Z0-9\s.,]/.test(formData.details)) {
      reasons.push("Details must not contain special symbols (except periods and commas).");
    }
  
    // Department Validation
    if (!formData.department || formData.department.trim() === "") {
      reasons.push("Department is required.");
    }
  
    // Premises Validation
    if (!formData.premises || formData.premises.trim() === "") {
      reasons.push("Premises are required.");
    } else if (formData.premises === "Other" && (!otherPremises || otherPremises.trim() === "")) {
      reasons.push("Custom premises are required when 'Other' is selected.");
    } else if (formData.premises === "Other" && /[^a-zA-Z0-9\s]/.test(otherPremises)) {
      reasons.push("Custom premises must not contain special symbols.");
    }
  
    // Location Validation
    if (!formData.location || formData.location.trim() === "") {
      reasons.push("Location is required.");
    } else if (formData.location === "Other" && (!otherLocation || otherLocation.trim() === "")) {
      reasons.push("Custom location is required when 'Other' is selected.");
    } else if (formData.location === "Other" && /[^a-zA-Z0-9\s]/.test(otherLocation)) {
      reasons.push("Custom location must not contain special symbols.");
    }
  
    // Specific Location Validation (Optional, but no special symbols)
    if (formData.specificLocation && /[^a-zA-Z0-9\s]/.test(formData.specificLocation)) {
      reasons.push("Specific location must not contain special symbols.");
    }
  
    // File Upload Validation
    if (!files.imgBefore_1 || !files.vidBefore) {
      reasons.push("At least one image and one video must be uploaded.");
    }
  
    if (files.imgBefore_1 && !["image/jpeg", "image/png"].includes(files.imgBefore_1.type)) {
      reasons.push("Image must be in .jpg or .png format.");
    }
  
    if (files.vidBefore && !["video/mp4", "video/quicktime"].includes(files.vidBefore.type)) {
      reasons.push("Video must be in .mp4 or .mov format.");
    }
  
    if (files.imgBefore_1 && files.imgBefore_1.size > 5 * 1024 * 1024) {
      reasons.push("Image size must not exceed 5MB.");
    }
  
    if (files.vidBefore && files.vidBefore.size > 100 * 1024 * 1024) {
      reasons.push("Video size must not exceed 100MB.");
    }
  
  
    // If there are any errors, show the collective reason and prevent submission
    if (reasons.length > 0) {
      toast.error(`Unable to submit complaint: ${reasons.join(" ")}`);
      return; // Exit function if there are validation errors
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
      {/* Complaint submission form */}
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
              maxLength={100}
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
              max={new Date().toISOString().split("T")[0]} // Disable future dates
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

        {/* Warning about file size restrictions */}
        <div className="text-red-500 mt-2 text-wrap">
          <strong>Warning:</strong> The file must meet the following size
          restrictions:
          <ul className="list-disc pl-4">
            <li>Videos: Maximum size 100MB</li>
            <li>Images: Maximum size 5MB</li>
          </ul>
        </div>

        {/* File upload components for images and video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-100 rounded-md shadow-lg">
          {/* Image Before 1 */}
          <FileUpload
            id="imgBefore_1"
            name="imgBefore_1"
            label="Image 1 - Before"
            fileType="image"
            files={files}
            setFiles={setFiles}
            accept=".jpg,.jpeg,.png,.heic"
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
            accept=".jpg,.jpeg,.png,.heic"
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
            accept=".jpg,.jpeg,.png,.heic"
          />

          {/* Video Before */}
          <FileUpload
            id="vidBefore"
            name="vidBefore"
            label="Video Before"
            fileType="video"
            files={files}
            setFiles={setFiles}
            accept=".mp4,.mov"
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
