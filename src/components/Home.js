import React, { useState } from "react";
import NewComplaint from "./NewComplaint";
import ComplaintStatistics from "./ComplaintStatistics";
import ComplaintsHistory from "./ComplaintsHistory";
import YourActivity from "./YourActivity";
import Users from "./Users";
import casfos_logo from "../assets/images/casfos_logo.jpg";
import { getUser } from "../utils/useToken";
import { useNavigate } from "react-router-dom";
import { designationFormat } from "../utils/formatting";

export default function Home() {
  const [activeTab, setActiveTab] = useState("complaint_statistics");

  const navigate = useNavigate();

  const tabs = [
    { id: "complaint_statistics", label: "Complaint Statistics", show: true },
    { id: "new_complaint", label: "New Complaint", show: true },
    { id: "your_activity", label: "Your Activity", show: true },
    { id: "complaints_history", label: "Complaints History", show: true },
    { id: "users", label: "Users", show: true },
  ];

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the JWT token from storage
    navigate("/"); 
  };

  return (
    <>
      <header className="bg-green-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={casfos_logo}
              alt="CASFOS Logo"
              className="h-12 w-auto mr-4"
            />
            <h1 className="text-2xl font-bold">CASFOS Grievance System</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="text-right">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-green-300">{designationFormat(user.designation)}</p>
                </div>
                <button
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
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {tabs
                .filter((tab) => tab.show)
                .map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                  whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }
                `}
                  >
                    {tab.label}
                  </button>
                ))}
            </div>
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
                      className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                    >
                      {tab.label}
                    </button>
                  ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "complaint_statistics" && <ComplaintStatistics />}

        {activeTab === "new_complaint" && <NewComplaint />}

        {activeTab === "your_activity" && <YourActivity />}

        {activeTab === "complaints_history" && <ComplaintsHistory />}

        {activeTab === "users" && <Users />}
      </div>
    </>
  );
}
