import React from 'react';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon, BuildingOfficeIcon} from '@heroicons/react/24/outline';

export default function ComplaintStats({ complaints }) {
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Work completed').length;
  const pendingComplaints = totalComplaints - resolvedComplaints;

  const departmentStats = complaints.reduce((acc, complaint) => {
    if (!acc[complaint.department]) {
      acc[complaint.department] = { total: 0, resolved: 0 };
    }
    acc[complaint.department].total += 1;
    if (complaint.status === 'Work completed') {
      acc[complaint.department].resolved += 1;
    }
    return acc;
  }, {});

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complaint Statistics</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-green-100 rounded-lg p-4 flex items-center">
          <ChartBarIcon className="h-10 w-10 text-green-600 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Complaints</p>
            <p className="text-2xl font-semibold text-gray-900">{totalComplaints}</p>
          </div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 flex items-center">
          <ClockIcon className="h-10 w-10 text-yellow-600 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Complaints</p>
            <p className="text-2xl font-semibold text-gray-900">{pendingComplaints}</p>
          </div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 flex items-center">
          <CheckCircleIcon className="h-10 w-10 text-green-600 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Resolved Complaints</p>
            <p className="text-2xl font-semibold text-gray-900">{resolvedComplaints}</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Department-wise Statistics</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(departmentStats).map(([department, stats]) => (
          <div key={department} className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-8 w-8 text-green-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">{department}</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-xl font-semibold text-gray-900">{stats.resolved}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-xl font-semibold text-gray-900">{stats.total-stats.resolved}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}