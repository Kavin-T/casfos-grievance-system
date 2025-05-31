/*
 * Notifications.js
 *
 * Purpose:
 * This React component displays user notifications for the CASFOS Grievance Redressal System.
 * It fetches notifications from the backend and shows them in a styled list with loading and error handling.
 *
 * Features:
 * - Fetches notifications from the backend API on mount.
 * - Displays a loading spinner while fetching.
 * - Shows a list of notifications with complaint ID, subject, and message.
 * - Handles and displays errors using toast notifications.
 * - Shows a message if no notifications are available.
 *
 * Usage:
 * Used in the dashboard or notification tab to show user notifications.
 * Example: <Notifications />
 *
 * Dependencies:
 * - fetchNotifications: API service for notifications (../services/notificationApi).
 * - react-toastify for notifications.
 * - Spinner: UI component for loading state.
 *
 * Notes:
 * - Expects backend to return an array of notification objects.
 * - Handles both frontend and backend errors gracefully.
 */

import React, { useState, useEffect } from "react";
import { fetchNotifications } from "../services/notificationApi";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

// Main Notifications component for displaying user notifications
export default function Notifications() {
  // State for notifications and loading
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotificationsData();
  }, []);

  // Function to fetch notifications from API
  const fetchNotificationsData = async () => {
    try {
      setLoading(true);
      const response = await fetchNotifications();
      setNotifications(response);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Section header */}
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>

      {/* Notification list or loading spinner */}
      {loading ? (
        <Spinner />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-gray-100 p-3 rounded-md shadow-sm"
            >
              <p className="text-sm text-gray-800">
                <strong>Complaint ID:</strong> {notification.complaintID}
              </p>
              <p className="text-sm text-gray-800">
                <strong>Subject:</strong> {notification.subject}
              </p>
              <p className="text-sm text-green-600">{notification.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No notifications available</p>
      )}
    </div>
  );
}
