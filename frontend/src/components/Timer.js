/*
 * Timer.js
 *
 * Purpose:
 * This React component displays a live timer showing the elapsed time since a complaint was created.
 * It is used to visually track how long a complaint has been open, with special styling for emergencies.
 *
 * Features:
 * - Calculates and updates elapsed time (months, days, hours, minutes) every minute.
 * - Displays time in styled boxes, with different colors for emergency and non-emergency complaints.
 * - Uses React hooks for state and effect management.
 *
 * Usage:
 * Import and use this component wherever you want to show elapsed time for a complaint.
 * Example: <Timer createdAt={complaint.createdAt} isEmergency={complaint.emergency} />
 *
 * Dependencies:
 * - None (uses only React and Tailwind CSS for styling).
 *
 * Notes:
 * - Expects a valid ISO date string for createdAt.
 * - Designed to be reusable for any timer/elapsed time display in the app.
 */

import React, { useState, useEffect } from "react";

// Main Timer component for displaying elapsed time
export const Timer = ({ createdAt, isEmergency }) => {
  // State for elapsed time
  const [timeElapsed, setTimeElapsed] = useState({});

  // Effect: calculate and update elapsed time every minute
  useEffect(() => {
    const calculateElapsedTime = () => {
      const now = new Date();
      const createdDate = new Date(createdAt);

      const diffMs = now - createdDate;
      const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeElapsed({ months, days, hours, minutes });
    };

    // Initial calculation
    calculateElapsedTime();

    // Update every minute while the page is active
    const timerInterval = setInterval(calculateElapsedTime, 60000);

    return () => clearInterval(timerInterval);
  }, [createdAt]);

  // Styling for emergency and non-emergency
  const textColor = isEmergency ? "text-white" : "text-green-700";
  const bgColor = isEmergency ? "bg-red-600" : "bg-gray-200";

  return (
    <div className="flex flex-col items-center">
      {/* Section header */}
      <p className="font-bold mb-2 text-gray-700">Time Elapsed</p>
      <div className="flex space-x-1">
        {/* Timer Box for each time unit */}
        {["months", "days", "hours", "minutes"].map((unit, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center w-12 h-12 ${bgColor} ${textColor} rounded-md shadow`}
          >
            <div className="text-sm font-bold">
              {String(timeElapsed[unit] || 0).padStart(2, "0")}
            </div>
            <span className="text-[10px] uppercase">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
