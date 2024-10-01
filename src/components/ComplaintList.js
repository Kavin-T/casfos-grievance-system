import React, { useState, useEffect } from 'react';
import complaints from '../complaints.json';
import { saveAs } from 'file-saver';

export default function ComplaintList({ user }) {
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    department: 'all',
    building: 'all'
  });

  useEffect(() => {
    let filtered = complaints;

    if (user.role === 'complaint_raiser') {
      filtered = filtered.filter(complaint => complaint.raisedBy === user.id);
    } else if (user.role === 'department_admin') {
      filtered = filtered.filter(complaint => complaint.department === user.department);
    }

    filtered = filtered.filter(complaint => 
      (filters.status === 'all' || complaint.status === filters.status) &&
      (filters.priority === 'all' || complaint.priority === filters.priority) &&
      (filters.department === 'all' || complaint.department === filters.department) &&
      (filters.building === 'all' || complaint.building === filters.building)
    );

    setFilteredComplaints(filtered);
  }, [user, filters]);

  const handleStatusChange = (complaintId, newStatus) => {
    // Update the status in the local state
    setFilteredComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
      )
    );

    // Update the status in the JSON file
    // Note: In a real application, this would be an API call to update the backend
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
    );
    // This is a placeholder for updating the JSON file
    console.log('Updated complaints:', updatedComplaints);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }));
  };

  const handleDownload = (fileAttachment) => {
    // In a real application, this would be a call to your backend to get the file
    // For this example, we'll just simulate a download
    saveAs(`/files/${fileAttachment}`, fileAttachment);
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <select
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="raised">Raised</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
        >
          <option value="all">All Departments</option>
          <option value="IT">IT</option>
          <option value="Maintenance">Maintenance</option>
          <option value="HR">HR</option>
        </select>
        <select
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={filters.building}
          onChange={(e) => handleFilterChange('building', e.target.value)}
        >
          <option value="all">All Buildings</option>
          <option value="Building A">Building A</option>
          <option value="Building B">Building B</option>
        </select>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredComplaints.map((complaint) => (
            <li key={complaint.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {complaint.subject}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {complaint.department}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    {complaint.building}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Raised on{' '}
                    <time dateTime={complaint.raisedOn}>
                      {new Date(complaint.raisedOn).toLocaleDateString()}
                    </time>
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-900">{complaint.details}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500">
                  Priority: <span className="text-gray-900">{complaint.priority}</span>
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                {(user.role === 'admin' || user.role === 'department_admin') && (
                  <select
                    className="block w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  >
                    <option value="raised">Raised</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                )}
                <button
                  onClick={() => handleDownload(complaint.fileAttachment)}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download Attachment
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}