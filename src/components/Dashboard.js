import React, { useState } from 'react';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import ComplaintStats from './ComplaintStats';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-lg font-semibold">CASFOS Grievance System</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Welcome, {user.username}</span>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {user.role === 'complaint_raiser' && (
                <button
                  onClick={() => setActiveTab('new')}
                  className={`${
                    activeTab === 'new'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  New Complaint
                </button>
              )}
              <button
                onClick={() => setActiveTab('list')}
                className={`${
                  activeTab === 'list'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Complaints
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`${
                    activeTab === 'stats'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Statistics
                </button>
              )}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'new' && user.role === 'complaint_raiser' && <ComplaintForm user={user} />}
            {activeTab === 'list' && <ComplaintList user={user} />}
            {activeTab === 'stats' && user.role === 'admin' && <ComplaintStats />}
          </div>
        </div>
      </div>
    </div>
  );
}