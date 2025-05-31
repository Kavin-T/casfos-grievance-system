/*
 * ComplaintStatistics.js
 *
 * Purpose:
 * This React component displays statistics and analytics for complaints, including totals, department-wise breakdowns, and expenditure.
 * It allows users to filter statistics by date range and view summary and department-level data.
 *
 * Features:
 * - Fetches and displays total, pending, resolved complaints, and total expenditure.
 * - Shows department-wise statistics with icons and breakdowns.
 * - Allows filtering by date range (from and to dates).
 * - Displays loading spinner and error notifications.
 *
 * Usage:
 * Import and use this component in a dashboard or analytics page.
 * Example: <ComplaintStatistics />
 *
 * Dependencies:
 * - fetchComplaintStatistics: API service for fetching statistics (../services/complaintApi).
 * - Spinner: UI component for loading state.
 * - @heroicons/react: For department and summary icons.
 * - react-toastify: For toast notifications.
 *
 * Notes:
 * - Expects backend API to support statistics queries by date range.
 * - Handles empty or missing data gracefully.
 */

import React, {useCallback, useState, useEffect } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
  WrenchIcon,
  CurrencyRupeeIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { fetchComplaintStatistics } from "../services/complaintApi";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

// Main component for complaint statistics and analytics
export default function ComplaintStatistics() {
  // State for statistics data
  const [statistics, setStatistics] = useState({});
  // State for date filters and loading
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Memoized function to fetch statistics from API
  const fetchStatistics = useCallback(async () => {
    if (!fromDate) {
      toast.error("Please specify the start date.");
      return;
    }

    const minAllowedDate = new Date("2025-03-01");
    const from = new Date(fromDate);
    const to = new Date(toDate || new Date().toISOString().split("T")[0]);

    if (from < minAllowedDate) {
      toast.error("Start date must be from March 2025 onwards.");
      return;
    }

    if (to < from) {
      toast.error("End date cannot be earlier than start date.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchComplaintStatistics(fromDate, toDate);
      setStatistics(response);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]); // Adding fromDate and toDate as dependencies

  // useEffect to set default dates and fetch statistics
  useEffect(() => {
    const currentDate = new Date();
    const defaultToDate = currentDate.toISOString().split("T")[0];
    const defaultFromDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    )
      .toISOString()
      .split("T")[0];

    if (!fromDate) setFromDate(defaultFromDate);
    if (!toDate) setToDate(defaultToDate);

    if (fromDate) {
      fetchStatistics();
    }
  }, [fromDate, toDate, fetchStatistics]); // Adding fetchStatistics to the dependency array

  // Handlers for date input changes
  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  // Map department names to appropriate icons
  const departmentIcons = {
    CIVIL: WrenchIcon,
    ELECTRICAL: BoltIcon,
    IT: ComputerDesktopIcon,
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      {/* Section header */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Complaint Statistics
      </h2>

      {/* Filters for date range */}
      <div className="filters flex flex-col sm:flex-row sm:space-x-4 sm:items-center space-y-4 sm:space-y-0 mb-6">
        <label>
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            min="2025-03-01"
            className="ml-2 py-1 border rounded"
          />
        </label>

        <label>
          To Date:
          <input
            type="date"
            value={toDate}
            min={fromDate}
            onChange={handleToDateChange}
            className="ml-2 py-1 border rounded"
          />
        </label>

        <button
          onClick={fetchStatistics}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:self-start"
        >
          Fetch Statistics
        </button>
      </div>

      {/* Loading spinner or statistics display */}
      {loading ? (
        <Spinner />
      ) : (
        <div>
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
                    Total Expenditure
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

          {/* Department-wise statistics section */}
          {statistics.departmentWise &&
            statistics.departmentWise.length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Department-wise Statistics
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {statistics.departmentWise.map((dept) => {
                    const { department, pending, resolved, price } = dept;
                    const totalComplaints = (pending || 0) + (resolved || 0);
                    const IconComponent =
                      departmentIcons[department] || ChartBarIcon;

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
                              {pending || 0}
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
                              {resolved || 0}
                            </p>
                            <p className="text-sm font-medium text-gray-500 mt-4">
                              Expenditure
                            </p>
                            <p className="text-xl font-semibold text-gray-900">
                              ₹{price || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
        </div>
      )}
    </div>
  );
}
