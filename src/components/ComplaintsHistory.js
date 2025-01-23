import React, { useState, useEffect } from "react";
import ComplaintBasicDetails from "./ComplaintBasicDetails";
import ComplaintAdditionalDetails from "./ComplaintAdditionalDeatils";
import { fetchComplaint } from "../services/complaintApi";
import { getReport } from "../services/reportApi";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

const ComplaintsHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    complainantID: "",
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

  const handleCloseModal = () => {
    setSelectedComplaint(null);
  };

  useEffect(() => {
    handleFetchComplaints();
  }, [toggle, page]);

  const handleFetchComplaints = async () => {
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
  };

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
      complainantName: "",
      subject: "",
      department: "",
      premises: "",
      location: "",
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

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      await getReport(filters);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Filter Complaints</h2>
      
      {/* Mobile view: Button to toggle filter visibility */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        >
          {showFilters ? "Hide Filters" : "View Filters"}
        </button>
      </div>

      {/* Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${showFilters ? "" : "hidden sm:grid"}`}>

        <input
          type="text"
          name="complainantID"
          placeholder="Complainant ID"
          value={filters.complainantID}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="text"
          name="complainantName"
          placeholder="Complainant Name"
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

        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Departments</option>
          <option value="CIVIL">Civil</option>
          <option value="ELECTRICAL">Electrical</option>
        </select>

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
          <option value="RAISED">Raised</option>
          <option value="JE_ACKNOWLEDGED">JE Acknowledged</option>
          <option value="WORKDONE">Work Done</option>
          <option value="AE_ACKNOWLEDGED">AE Acknowledged</option>
          <option value="EE_ACKNOWLEDGED">EE Acknowledged</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <div>
          <label htmlFor="startDate" className="block text-green-700 font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-green-700 font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="createdStartDate" className="block text-green-700 font-medium mb-1">
            Created Start Date
          </label>
          <input
            type="date"
            name="createdStartDate"
            id="createdStartDate"
            value={filters.createdStartDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="createdEndDate" className="block text-green-700 font-medium mb-1">
            Created End Date
          </label>
          <input
            type="date"
            name="createdEndDate"
            id="createdEndDate"
            value={filters.createdEndDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="acknowledgedStartDate" className="block text-green-700 font-medium mb-1">
            Acknowledged Start Date
          </label>
          <input
            type="date"
            name="acknowledgedStartDate"
            id="acknowledgedStartDate"
            value={filters.acknowledgedStartDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="acknowledgedEndDate" className="block text-green-700 font-medium mb-1">
            Acknowledged End Date
          </label>
          <input
            type="date"
            name="acknowledgedEndDate"
            id="acknowledgedEndDate"
            value={filters.acknowledgedEndDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="resolvedStartDate" className="block text-green-700 font-medium mb-1">
            Resolved Start Date
          </label>
          <input
            type="date"
            name="resolvedStartDate"
            id="resolvedStartDate"
            value={filters.resolvedStartDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="resolvedEndDate" className="block text-green-700 font-medium mb-1">
            Resolved End Date
          </label>
          <input
            type="date"
            name="resolvedEndDate"
            id="resolvedEndDate"
            value={filters.resolvedEndDate}
            onChange={handleFilterChange}
            className="p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="col-span-1">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Apply Filters
          </button>
        </div>

        <div className="col-span-1">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Clear Filters
          </button>
        </div>

        <div className="col-span-1">
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Generate Report
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-green-700 mb-4">Complaints</h2>
      {loading ? (
        <Spinner/>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className={`p-4 shadow-md rounded-lg border ${
                    complaint.emergency
                      ? "bg-red-100 border-red-300"
                      : "bg-white border-green-200"
                  }`}
                >
                  <ComplaintBasicDetails complaint={complaint}/>
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    View
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-green-700">No complaints found.</p>
            )}
          </div>

          {/* Modal to display detailed complaint information */}
          {selectedComplaint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-green-800 mb-4">
                  Complaint Details
                </h2>

                <ComplaintBasicDetails complaint={selectedComplaint}/>

                <ComplaintAdditionalDetails complaint={selectedComplaint}/>

                <button
                  className="mt-6 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
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