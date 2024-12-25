import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
  WrenchIcon, // Using WrenchIcon for departments
  CurrencyRupeeIcon, // Assuming a rupee icon is available
} from "@heroicons/react/24/outline";
import { fetchComplaintStatistics } from "../services/complaintApi";

export default function ComplaintStatistics() {
  const [statistics, setStatistics] = useState({});
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetchComplaintStatistics(year, month);
      setStatistics(response);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  const handleYearChange = (value) => {
    setYear(value);
    if (value === "All") {
      setMonth("All");
    }
  };

  const handleMonthChange = (value) => {
    if (year !== "All") {
      setMonth(value);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Complaint Statistics
      </h2>

      {/* Filters */}
      <div className="filters flex flex-col sm:flex-row sm:space-x-4 sm:items-center space-y-4 sm:space-y-0 mb-6">
        <label>
          Year:
          <select
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="ml-2 pl-2 pr-8 py-1 border rounded"
          >
            <option value="All">All</option>
            {[2021, 2022, 2023, 2024].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </label>
        <label>
          Month:
          <select
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="ml-2 pl-2 pr-8 py-1 border rounded"
            disabled={year === "All"}
          >
            <option value="All">All</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((m, index) => (
              <option key={m} value={index + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={fetchStatistics}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:self-start"
        >
          Fetch Statistics
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* General Statistics */}
          {statistics.totalComplaints ||
          statistics.pendingComplaints ||
          statistics.resolvedComplaints ||
          statistics.totalPrice ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="bg-green-100 rounded-lg p-4 flex items-center">
                <ChartBarIcon className="h-10 w-10 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Complaints
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {statistics.totalComplaints || 0}
                  </p>
                </div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-4 flex items-center">
                <ClockIcon className="h-10 w-10 text-yellow-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Complaints
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {statistics.pendingComplaints || 0}
                  </p>
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-4 flex items-center">
                <CheckCircleIcon className="h-10 w-10 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Resolved Complaints
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {statistics.resolvedComplaints || 0}
                  </p>
                </div>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 flex items-center">
                <CurrencyRupeeIcon className="h-10 w-10 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Price
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ₹{statistics.totalPrice || 0}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              No data available for the selected period
            </p>
          )}

          {/* Department-Wise Statistics */}
          {statistics.departmentWise &&
            Object.keys(statistics.departmentWise).length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Department-wise Statistics
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(statistics.departmentWise).map(
                    ([department, stats]) => {
                      const totalComplaints =
                        (stats.pending || 0) + (stats.resolved || 0);
                      let IconComponent = WrenchIcon;

                      // Update icons for specific departments
                      if (department.toLowerCase() === "civil") {
                        IconComponent = WrenchIcon;
                      } else if (department.toLowerCase() === "electrical") {
                        IconComponent = BoltIcon;
                      }

                      return (
                        <div
                          key={department}
                          className="bg-green-50 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-4">
                            <IconComponent className="h-8 w-8 text-green-600 mr-3" />
                            <h4 className="text-lg font-semibold text-gray-900">
                              {department}
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Pending
                              </p>
                              <p className="text-xl font-semibold text-gray-900">
                                {stats.pending || 0}
                              </p>
                              <p className="text-sm font-medium text-gray-500 mt-4">
                                Total Complaints
                              </p>
                              <p className="text-xl font-semibold text-gray-900">
                                {totalComplaints}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Resolved
                              </p>
                              <p className="text-xl font-semibold text-gray-900">
                                {stats.resolved || 0}
                              </p>
                              <p className="text-sm font-medium text-gray-500 mt-4">
                                Price
                              </p>
                              <p className="text-xl font-semibold text-gray-900">
                                ₹{stats.price || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
        </div>
      )}
    </div>
  );
}
