/*
 * Home.js
 *
 * Purpose:
 * This React component serves as the main dashboard and entry point for authenticated users in the CASFOS Grievance Redressal System.
 * It manages navigation, authentication, session handling, and tab-based access to all major features.
 *
 * Features:
 * - Tabbed navigation for statistics, complaints, user management, notifications, and more.
 * - Handles authentication, session expiry, and auto-logout.
 * - Fetches and displays counts for complaints and notifications.
 * - Responsive design for mobile and desktop tab navigation.
 * - Integrates all major components (statistics, new complaint, history, users, etc.).
 *
 * Usage:
 * Used as the main page after login. Renders all core features and manages user session state.
 * Example: <Home />
 *
 * Dependencies:
 * - All major feature components (ComplaintStatistics, NewComplaint, ComplaintsHistory, etc.).
 * - react-toastify for notifications.
 * - react-cookie for session management.
 * - react-router-dom for navigation.
 * - jwt-decode for token expiry handling.
 *
 * Notes:
 * - Expects user info in localStorage and cookies for authentication.
 * - Handles both mobile and desktop navigation patterns.
 */

import React, { useState, useEffect } from "react";
import Notifications from "./Notifications";
import NewComplaint from "./NewComplaint";
import ComplaintStatistics from "./ComplaintStatistics";
import ComplaintsHistory from "./ComplaintsHistory";
import YourActivity from "./YourActivity";
import Users from "./Users";
import PriceEntry from "./PriceEntry";
import casfos_logo from "../assets/images/casfos_logo.jpg";
import { useNavigate } from "react-router-dom";
import { designationFormat } from "../utils/formatting";
import { toast, ToastContainer } from "react-toastify";
import { checkAuthentication } from "../services/authApi";
import { useCookies } from "react-cookie";
import { fetchComplaintsByDesignation } from "../services/yourActivity";
import { fetchNotifications } from "../services/notificationApi";
import { jwtDecode } from "jwt-decode";

// Helper to get user info from localStorage
const getUser = () => {
  const username = localStorage.getItem("username");
  const designation = localStorage.getItem("designation");
  return { username, designation };
};

// Main Home component for dashboard and navigation
export default function Home() {
  // State for complaint and notification counts
  const [complaintCount, setComplaintCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  // State for tab navigation, menu, and session
  const [activeTab, setActiveTab] = useState("complaint_statistics");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cookies, removeCookie] = useCookies([]);

  const navigate = useNavigate();

  const userInfo = getUser();

  // Effect: Verify user authentication on mount
  useEffect(() => {
    const verifyUser = async () => {
      const response = await checkAuthentication();
      if (!response) {
        removeCookie("token");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  // Effect: Handle auto-logout on token expiry
  useEffect(() => {
    const handleAutoLogout = () => {
      toast.error("Session expired. Please login again.");
      removeCookie("token");
      localStorage.removeItem("username");
      localStorage.removeItem("designation");
      navigate("/login");
    };

    const token = cookies.token;
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeLeft = expiryTime - currentTime;

      if (timeLeft <= 0) {
        handleAutoLogout();
      } else {
        const timeout = setTimeout(handleAutoLogout, timeLeft);
        return () => clearTimeout(timeout);
      }
    } catch (err) {
      toast.error("Invalid token. Login Again");
      handleAutoLogout();
    }
  }, [cookies.token, navigate, removeCookie]);

  // Effect: Fetch complaint count for user
  useEffect(() => {
    const fetchComplaintCount = async () => {
      try {
        const data = await fetchComplaintsByDesignation();
        setComplaintCount(data.length);
        if (data.length > 0) {
          toast.warning(`You have ${data.length} pending complaints.`);
        }
      } catch (error) {
        console.error("Error fetching complaint data:", error);
      }
    };
    fetchComplaintCount();
  }, []);

  // Effect: Fetch notification count
  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const response = await fetchNotifications();
        console.log("Fetched notifications:", response.length);
        setNotificationCount(response.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotificationsData();
  }, [notificationUpdate]); // Re-fetch when notificationUpdate changes

  // Tab configuration for navigation
  const tabs = [
    { id: "complaint_statistics", label: "Complaint Statistics", show: true },
    {
      id: "new_complaint",
      label: "New Complaint",
      show:
        userInfo.designation === "COMPLAINANT" ||
        userInfo.designation === "ESTATE_OFFICER" ||
        userInfo.designation === "ASSISTANT_TO_ESTATE_OFFICER" ||
        userInfo.designation === "PRINCIPAL",
    },
    { id: "your_activity", label: "Your Activity", show: true },
    { id: "complaints_history", label: "Complaints History", show: true },
    {
      id: "users",
      label: "Users",
      show:
        userInfo.designation === "ESTATE_OFFICER" ||
        userInfo.designation === "PRINCIPAL",
    },
    {
      id: "price_entry",
      label: "Price Entry",
      show:
        userInfo.designation === "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL" ||
        userInfo.designation === "EXECUTIVE_ENGINEER_IT",
    },
    {
      id: "notification",
      label: "Notifications",
      show:
        userInfo.designation === "ESTATE_OFFICER" ||
        userInfo.designation === "PRINCIPAL" ||
        userInfo.designation === "COMPLAINANT" ||
        userInfo.designation === "ASSISTANT_TO_ESTATE_OFFICER",
    },
  ];

  // Handler for logout
  const handleLogout = async () => {
    removeCookie("token");
    localStorage.removeItem("username");
    localStorage.removeItem("designation");
    navigate("/");
  };

  // Handler for complaint status change (to update notifications)
  const handleComplaintStatusChange = (complaintID, newStatus) => {
    if (newStatus === "RESOLVED" || newStatus === "TERMINATED") {
      setNotificationUpdate((prev) => !prev); // Toggle state to trigger re-fetch
    }
  };

  return (
    <>
      {/* Toast notifications container */}
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      {/* Header with logo, title, user info, and logout */}
      <header className="bg-green-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href={process.env.REACT_APP_LANDING_PAGE_URL}>
              <img
                src={casfos_logo}
                alt="CASFOS Logo"
                className="h-12 w-auto mr-4"
              />
            </a>
            <h1 className="text-2xl font-bold">
              CASFOS Grievance Redressal System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {userInfo && (
              <>
                <div className="text-right">
                  <p className="font-semibold">{userInfo.username}</p>
                  <p className="text-sm text-green-300">
                    {designationFormat(userInfo.designation)}
                  </p>
                </div>
                <button
                  id="logout-button"
                  onClick={handleLogout} // Attach handleLogout to the button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-4">
          {/* Mobile view: scrollable tab bar */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between bg-gray-200 p-2 rounded-md">
              <button
                className="relative p-2 text-gray-700 bg-white rounded-md shadow"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                {/* YourActivity count in hamburger icon */}
                {complaintCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                    {complaintCount}
                  </span>
                )}
              </button>

              {/* Display Selected Tab */}
              <span className="ml-4 text-lg font-medium text-gray-700 pr-2">
                {tabs.find((tab) => tab.id === activeTab)?.label ||
                  "Select a Tab"}
              </span>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="mt-2 bg-white border rounded-md shadow-lg">
                {tabs
                  .filter((tab) => tab.show)
                  .map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMenuOpen(false); // Close menu on selection
                      }}
                      className={`relative block w-full text-left px-4 py-2 ${
                        activeTab === tab.id
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tab.label}
                      {tab.label === "Your Activity" && complaintCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                          {complaintCount}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            )}
          </div>
          {/* Desktop view: regular tab navigation */}
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs
                  .filter((tab) => tab.show)
                  .map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg
                        ${
                          activeTab === tab.id
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      {tab.label}
                      {tab.label === "Your Activity" && complaintCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                          {complaintCount}
                        </span>
                      )}
                      {tab.id === "notification" && notificationCount > 0 && (
                        <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                  ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab content for each feature */}
        {activeTab === "complaint_statistics" && <ComplaintStatistics />}

        {activeTab === "new_complaint" && <NewComplaint />}

        {activeTab === "your_activity" && (
          <YourActivity
            setComplaintCount={setComplaintCount}
            handleComplaintStatusChange={handleComplaintStatusChange}
          />
        )}

        {activeTab === "complaints_history" && <ComplaintsHistory />}

        {activeTab === "users" && <Users />}

        {activeTab === "price_entry" && <PriceEntry />}

        {activeTab === "notification" && <Notifications />}
      </div>
    </>
  );
}
