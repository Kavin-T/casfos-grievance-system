import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplaintsFilter = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    raiserName: '',
    subject: '',
    department: '',
    premises: '',
    location: '',
    details: '',
    emergency: '',
    status: '',
    startDate: '',
    endDate: '',
    createdStartDate: '',
    createdEndDate: '',
    acknowledgedStartDate: '',
    acknowledgedEndDate: '',
    resolvedStartDate: '',
    resolvedEndDate: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/complaint', {
        params: {
          ...filters,
          page,
          limit: 10,
        },
      });
      setComplaints(data.complaints);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching complaints:', error);
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

  const handleApplyFilters = () => {
    setPage(1); // Reset to the first page whenever filters are applied
    fetchComplaints();
  };

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Filter Complaints</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="raiserName"
          placeholder="Raiser Name"
          value={filters.raiserName}
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
          <label htmlFor="startDate" className="block text-green-700 font-medium mb-1">Start Date</label>
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
          <label htmlFor="endDate" className="block text-green-700 font-medium mb-1">End Date</label>
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
          <label htmlFor="createdStartDate" className="block text-green-700 font-medium mb-1">Created Start Date</label>
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
          <label htmlFor="createdEndDate" className="block text-green-700 font-medium mb-1">Created End Date</label>
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
          <label htmlFor="acknowledgedStartDate" className="block text-green-700 font-medium mb-1">Acknowledged Start Date</label>
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
          <label htmlFor="acknowledgedEndDate" className="block text-green-700 font-medium mb-1">Acknowledged End Date</label>
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
          <label htmlFor="resolvedStartDate" className="block text-green-700 font-medium mb-1">Resolved Start Date</label>
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
          <label htmlFor="resolvedEndDate" className="block text-green-700 font-medium mb-1">Resolved End Date</label>
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
      </div>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Complaints</h2>
      {loading ? (
        <p className="text-green-700">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <div key={complaint._id} className="p-4 bg-white shadow-md rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800">{complaint.subject}</h3>
                <p><strong>Raiser:</strong> {complaint.raiserName}</p>
                <p><strong>Department:</strong> {complaint.department}</p>
                <p><strong>Premises:</strong> {complaint.premises}</p>
                <p><strong>Location:</strong> {complaint.location}</p>
                <p><strong>Emergency:</strong> {complaint.emergency ? 'Yes' : 'No'}</p>
                <p><strong>Status:</strong> {complaint.status}</p>
                <p><strong>Created At:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                {complaint.acknowledgeAt && (
                  <p><strong>Acknowledged At:</strong> {new Date(complaint.acknowledgeAt).toLocaleDateString()}</p>
                )}
                {complaint.resolvedAt && (
                  <p><strong>Resolved At:</strong> {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-green-700">No complaints found.</p>
          )}
        </div>
      )}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className={`px-4 py-2 bg-green-500 text-white rounded-lg shadow-md ${
            page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
          }`}
        >
          Previous
        </button>
        <span className="text-green-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          className={`px-4 py-2 bg-green-500 text-white rounded-lg shadow-md ${
            page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ComplaintsFilter;

