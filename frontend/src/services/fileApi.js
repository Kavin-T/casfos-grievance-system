/*
 * fileApi.js
 *
 * Purpose:
 * This file provides utility functions for handling media file access in the CASFOS Grievance Redressal System frontend.
 * It is used to open images and videos in a new browser tab from the backend server.
 *
 * Features:
 * - handleMediaOpen: Opens a given media file path in a new browser tab using the backend API URL.
 *
 * Usage:
 * Import and use handleMediaOpen in components where media preview is needed.
 * Example: handleMediaOpen(mediaPath);
 *
 * Dependencies:
 * - Uses the REACT_APP_BACKEND_API_URL environment variable for the backend base URL.
 *
 * Notes:
 * - Designed for previewing uploaded complaint images and videos.
 */

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const handleMediaOpen = (mediaPath) => {
    if (mediaPath) {
        window.open(
        `${BASE_URL}/${mediaPath}`,
        "_blank",
        "noopener noreferrer"
        );
    }
};
