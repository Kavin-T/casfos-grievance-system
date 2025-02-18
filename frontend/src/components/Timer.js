import React, { useState, useEffect } from "react";

export const Timer = ({ createdAt, isEmergency }) => {
  const [timeElapsed, setTimeElapsed] = useState({});

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

  const textColor = isEmergency ? "text-white" : "text-green-700";
  const bgColor = isEmergency ? "bg-red-600" : "bg-gray-200";

  return (
    <div className="flex flex-col items-center">
      <p className="font-bold mb-2 text-gray-700">Time Elapsed</p>
      <div className="flex space-x-1">
        {/* Timer Box */}
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
