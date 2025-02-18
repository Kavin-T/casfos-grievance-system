import React from "react";
import { toast } from "react-toastify";

export const FileUpload = ({
  id,
  name,
  label,
  fileType,
  files,
  setFiles,
  dependentFileKey = null,
}) => {
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

  const isDisabled = dependentFileKey && !files?.[dependentFileKey];

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
      <span className="text-lg font-semibold text-gray-700 mb-2">{label}</span>
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
      <input
        id={id}
        name={name}
        type="file"
        accept={fileType === "image" ? "image/*" : "video/*"}
        className="sr-only"
        onChange={handleFileChange}
        disabled={isDisabled}
      />
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
