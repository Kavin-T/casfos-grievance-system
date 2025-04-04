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

const getUser = () => {
  const username = localStorage.getItem("username");
  const designation = localStorage.getItem("designation");
  return { username, designation };
};

export default function Home() {
  const [complaintCount, setComplaintCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState("complaint_statistics");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cookies, removeCookie] = useCookies([]);

  const navigate = useNavigate();

  const userInfo = getUser();

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

  const handleLogout = async () => {
    removeCookie("token");
    localStorage.removeItem("username");
    localStorage.removeItem("designation");
    navigate("/");
  };

  const handleComplaintStatusChange = (complaintID, newStatus) => {
    if (newStatus === "RESOLVED" || newStatus === "TERMINATED") {
      setNotificationUpdate((prev) => !prev); // Toggle state to trigger re-fetch
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <header className="bg-green-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href="http://localhost:3000/"><img
              src={casfos_logo}
              alt="CASFOS Logo"
              className="h-12 w-auto mr-4"
            /></a>
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

        {/* Tab content */}
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
