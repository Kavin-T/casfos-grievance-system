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
  });

  const [otherLocation, setOtherLocation] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [files, setFiles] = useState({
    imgBefore: null,
    vidBefore: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxImageSize = 5 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    if (file.type.startsWith("image")) {
      if (file.size > maxImageSize) {
        toast.error("Image file size should not exceed 5MB.");
        return;
      }
    }

    if (file.type.startsWith("video")) {
      if (file.size > maxVideoSize) {
        toast.error("Video file size should not exceed 100MB.");
        return;
      }
    }

    setFiles((prevFiles) => ({
      ...prevFiles,
      [event.target.name]: file,
    }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prompt for confirmation before submitting
    const isConfirmed = await confirmAction(
      `Are you sure you want to submit the form?`
    );
    if (!isConfirmed) {
      return;
    }

    if (!files.imgBefore && !files.vidBefore) {
      toast.error("At least one file must be uploaded.");
      return;
    }

    setIsSubmitting(true); // Disable form submission

    const data = new FormData();

    // Append form fields
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    if (formData["location"] === "Other") {
      data.set("location", otherLocation);
    }

    data.append("emergency", isEmergency);

    // Append files
    if (files.imgBefore) data.append("imgBefore", files.imgBefore);
    if (files.vidBefore) data.append("vidBefore", files.vidBefore);

    try {
      const response = await addComplaint(data);

      toast.success(response.message);

      // Reset the form after successful submission
      setFormData({
        complainantName: getUser().username,
        subject: "",
        date: "",
        details: "",
        department: "",
        premises: "",
        location: "",
      });
      setOtherLocation("");
      setIsEmergency(false);
      setFiles({
        imgBefore: null,
        vidBefore: null,
      });
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name input */}
      <div>
        <label
          htmlFor="complainantName"
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

      {/* Subject input */}
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
          <input
            type="text"
            name="subject"
            required
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>
      </div>

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
        </select>
      </div>

      {/* Premises select */}
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
            onChange={handleInputChange}
          >
            <option value="">Select premises</option>
            <option value="VanVigyan">VanVigyan</option>
            <option value="VanVatika">VanVatika</option>
            <option value="CASFOS Sports Ground">CASFOS Sports Ground</option>
            <option value="Main Gate">Main Gate</option>
            <option value="Parking Area">Parking Area</option>
          </select>
        </div>
      </div>

      {/* Location select */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            name="location"
            required
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={formData.location}
            onChange={handleInputChange}
          >
            <option value="">Select location</option>
            <option value="Principal Chamber">Principal Chamber</option>
            <option value="Office">Office</option>
            <option value="Library">Library</option>
            <option value="Corbett Hall">Corbett Hall</option>
            <option value="GIS Lab">GIS Lab</option>
            <option value="V.C. Room">V.C. Room</option>
            <option value="Faculty Chamber">Faculty Chamber</option>
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Champion Hall">Champion Hall</option>
            <option value="G.D. Room">G.D. Room</option>
            <option value="IT & UPS Room">IT & UPS Room</option>
            <option value="Terrace & Staircase">Terrace & Staircase</option>
            <option value="Pavilion">Pavilion</option>
            <option value="Tennis Court">Tennis Court</option>
            <option value="Basketball Court">Basketball Court</option>
            <option value="Gym">Gym</option>
            <option value="Shuttle Cock Court">Shuttle Cock Court</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Overhead Tank">Overhead Tank</option>
            <option value="Sump">Sump</option>
            <option value="Pump Room">Pump Room</option>
            <option value="E.B. Room">E.B. Room</option>
            <option value="Security">Security</option>
            <option value="Cycle Stand">Cycle Stand</option>
            <option value="Toilet">Toilet</option>
            <option value="Front side Lawn Area">Front side Lawn Area</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Other Location input */}
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
          <li>Images: Minimum size 1MB, Maximum size 5MB</li>
          <li>Videos: Minimum size 5MB, Maximum size 100MB</li>
        </ul>
      </div>

      {/* Image upload */}
      <div className="mt-1 flex items-center">
        <label
          htmlFor="imgBefore"
          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
        >
          {files?.imgBefore ? "Change image" : "Upload image"}
        </label>
        <input
          id="imgBefore"
          name="imgBefore"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
        {files?.imgBefore && (
          <span className="ml-3 text-sm text-gray-600">
            {files.imgBefore.name}
          </span>
        )}
      </div>

      {/* Video upload */}
      <div className="mt-1 flex items-center">
        <label
          htmlFor="vidBefore"
          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
        >
          {files.vidBefore ? "Change video" : "Upload video"}
        </label>
        <input
          id="vidBefore"
          name="vidBefore"
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={handleFileChange}
        />
        {files?.vidBefore && (
          <span className="ml-3 text-sm text-gray-600">
            {files.vidBefore.name}
          </span>
        )}
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
  );
}
