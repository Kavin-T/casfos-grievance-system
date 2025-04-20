import React, {useCallback, useState, useEffect } from "react";
import ComplaintBasicDetails from "./ComplaintBasicDetails";
import ComplaintAdditionalDetails from "./ComplaintAdditionalDeatils";
import { fetchComplaint } from "../services/complaintApi";
import { getReport } from "../services/reportApi";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { Timer } from "./Timer";

const ComplaintsHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    complaintID: "",
    complainantName: "",
    subject: "",
    department: "",
    premises: "",
    location: "",
    specificLocation: "",
    details: "",
    emergency: "",
    status: "",
    startDate: "",
    endDate: "",
    createdStartDate: "",
    createdEndDate: "",
    acknowledgedStartDate: "",
    acknowledgedEndDate: "",
    resolvedStartDate: "",
    resolvedEndDate: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("modal");

  const handleCloseModal = () => {
    setSelectedComplaint(null);
  };

  

  const handleFetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchComplaint(filters, page);
      setComplaints(response.complaints);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    handleFetchComplaints();
  }, [toggle, page, handleFetchComplaints]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleApplyFilters = async () => {
    setPage(1);
    await handleFetchComplaints();
  };

  const handleClearFilters = () => {
    setFilters({
      complaintID: "",
      complainantName: "",
      subject: "",
      department: "",
      premises: "",
      location: "",
      specificLocation: "",
      details: "",
      emergency: "",
      status: "",
      startDate: "",
      endDate: "",
      createdStartDate: "",
      createdEndDate: "",
      acknowledgedStartDate: "",
      acknowledgedEndDate: "",
      resolvedStartDate: "",
      resolvedEndDate: "",
    });
    setPage(1);
    setToggle(!toggle);
  };

  const handleGenerateReport = async (type) => {
    setLoading(true);
    try {
      await getReport({ ...filters, type });
      toast.success(`${type.toUpperCase()} Report downloaded successfully!`);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Filter Complaints
      </h2>
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        >
          {showFilters ? "Hide Filters" : "View Filters"}
        </button>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${
          showFilters ? "" : "hidden sm:grid"
        }`}
      >
        {/* Text Inputs */}
        <input
          type="text"
          name="complaintID"
          placeholder="Complaint ID"
          value={filters.complaintID}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="complainantName"
          placeholder="Complainant Name"
          maxLength={100}
          value={filters.complainantName}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={filters.subject}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="premises"
          placeholder="Premises"
          value={filters.premises}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="specificLocation"
          placeholder="Specific Location"
          value={filters.specificLocation}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="details"
          placeholder="Details"
          value={filters.details}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Select Inputs */}
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Departments</option>
          <option value="CIVIL">Civil</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="IT">IT</option>
        </select>
        <select
          name="emergency"
          value={filters.emergency}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All</option>
          <option value="true">Emergency</option>
          <option value="false">Non-Emergency</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="JE_WORKDONE">JE WorkDone</option>
          <option value="RESOLVED">Resolved</option>
          <option value="TERMINATED">Terminated</option>
        </select>

        {/* Date Pickers */}
        <div>
          <label className="block text-green-700 font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            min="2025-03-01"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-green-700 font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            min={filters.startDate}
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-green-700 font-medium mb-1">
            Created Start Date
          </label>
          <input
            type="date"
            name="createdStartDate"
            min="2025-03-01"
            value={filters.createdStartDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-green-700 font-medium mb-1">
            Created End Date
          </label>
          <input
            type="date"
            name="createdEndDate"
            min={filters.createdStartDate}
            value={filters.createdEndDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-green-700 font-medium mb-1">
            Acknowledged Start Date
          </label>
          <input
            type="date"
            name="acknowledgedStartDate"
            min="2025-03-01"
            value={filters.acknowledgedStartDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-green-700 font-medium mb-1">
            Acknowledged End Date
          </label>
          <input
            type="date"
            name="acknowledgedEndDate"
            min={filters.acknowledgedStartDate}
            value={filters.acknowledgedEndDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-green-700 font-medium mb-1">
            Resolved Start Date
          </label>
          <input
            type="date"
            name="resolvedStartDate"
            min="2025-03-01"
            value={filters.resolvedStartDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-green-700 font-medium mb-1">
            Resolved End Date
          </label>
          <input
            type="date"
            name="resolvedEndDate"
            min={filters.resolvedStartDate}
            value={filters.resolvedEndDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="col-span-1">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 w-full"
          >
            Apply Filters
          </button>
        </div>
        <div className="col-span-1">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 w-full"
          >
            Clear Filters
          </button>
        </div>
        <div className="col-span-1">
          <button
            onClick={() => handleGenerateReport("pdf")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 w-full"
          >
            PDF Report
          </button>
        </div>
        <div className="col-span-1">
          <button
            onClick={() => handleGenerateReport("csv")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 w-full"
          >
            CSV Report
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleViewModeChange("modal")}
          className={`px-4 py-2 rounded-lg shadow-md mr-2 ${
            viewMode === "modal"
              ? "bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          View in Card
        </button>
        <button
          onClick={() => handleViewModeChange("list")}
          className={`px-4 py-2 rounded-lg shadow-md ${
            viewMode === "list"
              ? "bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          View in List
        </button>
      </div>

      <h2 className="text-2xl font-bold text-green-700 mb-4">Complaints</h2>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {viewMode === "modal" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className={`p-4 shadow-md rounded-lg border ${
                    complaint.status === "RESOLVED"
                      ? "bg-green-100 border-green-300"
                      : complaint.emergency
                      ? "bg-red-100 border-red-300"
                      : "bg-yellow-100 border-yellow-300"
                  }`}
                >
                  <ComplaintBasicDetails complaint={complaint} />
                  <div className="flex justify-between gap-2 mt-4">
                    {complaint.status !== "RESOLVED" &&
                      complaint.status !== "TERMINATED" && (
                        <Timer
                          createdAt={complaint.createdAt}
                          isEmergency={complaint.emergency}
                        />
                      )}
                    <button
                      className="mt-8 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 min-w-20 max-h-11"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-3 text-left text-green-700">ID</th>
                    <th className="p-3 text-left text-green-700">Name</th>
                    <th className="p-3 text-left text-green-700">Subject</th>
                    <th className="p-3 text-left text-green-700">Department</th>
                    <th className="p-3 text-left text-green-700">Premises</th>
                    <th className="p-3 text-left text-green-700">Location</th>
                    <th className="p-3 text-left text-green-700">Details</th>
                    <th className="p-3 text-left text-green-700">Emergency</th>
                    <th className="p-3 text-left text-green-700">Status</th>
                    <th className="p-3 text-left text-green-700">Reported On</th>
                    <th className="p-3 text-left text-green-700">Timer</th>
                    <th className="p-3 text-left text-green-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => {
                    const rowBg =
                      complaint.status === "RESOLVED"
                        ? "bg-green-60"
                        : complaint.emergency
                        ? "bg-red-50"
                        : "bg-yellow-50";

                    return (
                      <tr
                        key={complaint._id}
                        className={`${rowBg} hover:bg-green-100`}
                      >
                        <td className="p-3 border-b">
                          {complaint.complaintID}
                        </td>
                        <td className="p-3 border-b">
                          {complaint.complainantName}
                        </td>
                        <td className="p-3 border-b">{complaint.subject}</td>
                        <td className="p-3 border-b">{complaint.department}</td>
                        <td className="p-3 border-b">{complaint.premises}</td>
                        <td className="p-3 border-b">
                          {complaint.specificLocation}
                        </td>
                        <td className="p-3 border-b">{complaint.details}</td>
                        <td className="p-3 border-b">
                          {complaint.emergency ? "Yes" : "No"}
                        </td>
                        <td className="p-3 border-b capitalize">
                          {complaint.status.toLowerCase()}
                        </td>
                        <td className="p-3 border-b">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 border-b">
                          {complaint.status !== "RESOLVED" &&
                            complaint.status !== "TERMINATED" && (
                              <Timer
                                createdAt={complaint.createdAt}
                                isEmergency={complaint.emergency}
                              />
                            )}
                        </td>
                        <td className="p-3 border-b">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              Complaint Details
            </h2>
            <ComplaintBasicDetails complaint={selectedComplaint} />
            <ComplaintAdditionalDetails complaint={selectedComplaint} />
            <button
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center mt-6 space-x-4">
        {page !== 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Previous
          </button>
        )}
        <span className="text-green-700 font-medium">
          Page {page} of {totalPages}
        </span>
        {page !== totalPages && (
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintsHistory;
