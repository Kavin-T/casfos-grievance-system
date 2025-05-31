/*
 * notificationApi.js
 *
 * Purpose:
 * This file provides API functions for notification-related operations in the CASFOS Grievance Redressal System frontend.
 * It handles fetching notifications from the backend for display in the UI.
 *
 * Features:
 * - fetchNotifications: Retrieves all notifications for the current user.
 *
 * Usage:
 * Import this function wherever notifications need to be displayed or managed in the frontend.
 * Example: import { fetchNotifications } from '../services/notificationApi';
 *
 * Dependencies:
 * - axios.js: Configured Axios instance for API requests.
 *
 * Notes:
 * - Handles both frontend and backend errors gracefully.
 * - Update endpoints as needed to match backend API changes.
 */

import axios from "./axios";

// Fetch all notifications
export const fetchNotifications = async () => {
  try {
    const response = await axios.get("/notification");
    console.log("Fetched notifications:", response.data);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch notifications.";
  }
};
