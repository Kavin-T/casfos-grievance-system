/*
 * FileUpload.js
 *
 * Purpose:
 * This React component provides a reusable file upload UI for images and videos, with validation and preview.
 * It is used for uploading complaint-related media files in the application.
 *
 * Features:
 * - Supports image and video uploads with file type and size validation.
 * - Shows a preview of the selected file (image or video).
 * - Disables upload if a dependent file is not present (for chained uploads).
 * - Displays error messages using toast notifications.
 *
 * Usage:
 * Import and use this component in a parent form, passing required props for file handling.
 * Example: <FileUpload id="imgBefore" name="imgBefore" label="Upload Before Image" fileType="image" files={files} setFiles={setFiles} />
 *
 * Dependencies:
 * - react-toastify: For toast notifications.
 *
 * Notes:
 * - Expects parent to manage the files state and provide setFiles handler.
 * - Accepts a dependentFileKey prop to control enabling/disabling based on another file's presence.
 */

import React from "react";
import { toast } from "react-toastify";

// Accepted file extensions for images and videos
const ACCEPTED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png,.bmp,.gif,.webp,.tiff,.heic";
const ACCEPTED_VIDEO_EXTENSIONS = ".mp4,.mov,.avi,.mkv,.webm,.flv,.wmv";

// Main FileUpload component
export const FileUpload = ({
  id,
  name,
  label,
  fileType,
  files,
  setFiles,
  dependentFileKey = null,
}) => {
  // Handler for file input change and validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxImageSize = 5 * 1024 * 1024; 
    const maxVideoSize = 100 * 1024 * 1024; 

    if (fileType === "image") {
      if (!ACCEPTED_IMAGE_EXTENSIONS.includes(file.name.split(".").pop().toLowerCase())) {
        toast.error("Unsupported image format.");
        return;
      }
      if (file.size > maxImageSize) {
        toast.error("Image file size should not exceed 5MB.");
        return;
      }
    }

    if (fileType === "video") {
      if (!ACCEPTED_VIDEO_EXTENSIONS.includes(file.name.split(".").pop().toLowerCase())) {
        toast.error("Unsupported video format.");
        return;
      }
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

  // Disable upload if dependent file is not present
  const isDisabled = dependentFileKey && !files?.[dependentFileKey];

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
      {/* Label for file input */}
      <span className="text-lg font-semibold text-gray-700 mb-2">{label}</span>
      {/* File input label and button */}
      <label
        htmlFor={id}
        className={`py-2 px-4 rounded-md text-sm font-medium ${
          isDisabled
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-green-500 text-white cursor-pointer hover:bg-green-600 focus:ring-green-500"
        }`}
      >
        {files?.[name] ? `Change ${fileType}` : `Upload ${fileType}`}
      </label>
      {/* File input (hidden) */}
      <input
        id={id}
        name={name}
        type="file"
        accept={fileType === "image" ? ACCEPTED_IMAGE_EXTENSIONS : ACCEPTED_VIDEO_EXTENSIONS}
        className="sr-only"
        onChange={handleFileChange}
        disabled={isDisabled}
      />
      {/* Preview of selected file (image or video) */}
      {files?.[name] && (
        <div className="mt-4 items-center flex flex-col">
          {fileType === "image" ? (
            <img
              src={URL.createObjectURL(files[name])}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          ) : (
            <video
              src={URL.createObjectURL(files[name])}
              controls
              className="w-full rounded-lg shadow-md border border-gray-300"
            />
          )}
          <span className="block mt-2 text-sm text-gray-500">
            File name: {files[name].name}
          </span>
        </div>
      )}
    </div>
  );
};
