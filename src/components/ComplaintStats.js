import React from 'react';
import complaints from '../complaints.json';

export default function ComplaintStats() {
  const totalComplaints = complaints.length;
  const raisedComplaints = complaints.filter(c => c.status === 'raised').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  const departments = [...new Set(complaints.map(c => c.department))];
  const departmentStats = departments.map(dept => ({
    name: dept,
    count: complaints.filter(c => c.department === dept).length
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Complaint Statistics</h2>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Complaints</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalComplaints}</dd>
        </div>
        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Raised</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{raisedComplaints}</dd>
        </div>
        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{inProgressComplaints}</dd>
        </div>
        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{resolvedComplaints}</dd>
        </div>
      </dl>
      <h3 className="mt-8 text-xl font-semibold text-gray-900">Complaints by Department</h3>
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {departmentStats.map((dept) => (
          <li key={dept.name} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
            <div className="w-full flex items-center justify-between p-6 space-x-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-900 text-sm font-medium truncate">{dept.name}</h3>
                </div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 text-sm font-medium">
                {dept.count}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}