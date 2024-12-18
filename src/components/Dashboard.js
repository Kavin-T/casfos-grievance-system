import React, { useState } from 'react';
import NewComplaint from './NewComplaint';
import ComplaintStatistics from './ComplaintStatistics';
import ComplaintsHistory from './ComplaintsHistory';
import YourActivity from './YourActivity';
import OngoingComplaints from './OngoingComplaints';
import Users from './Users';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'complaint_statistics', label: 'Complaint Statistics', show: true },
    { id: 'new_complaint', label: 'New Complaint', show: true },
    { id: 'your_activity', label: 'Your Activity', show: true },
    { id: 'ongoing_complaints', label: 'Ongoing Complaints', show: true },
    { id: 'complaints_history', label: 'Complaints History', show: true },
    { id: 'users', label: 'Users', show: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        {/* Mobile view: scrollable tab bar */}
        <div className="sm:hidden">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {tabs.filter(tab => tab.show).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm
                  ${activeTab === tab.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop view: regular tab navigation */}
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.filter(tab => tab.show).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'complaint_statistics' && (
        <ComplaintStatistics/>
      )}

      {activeTab === 'new_complaint' && (
        <NewComplaint/>
      )}
      
      {activeTab === 'your_activity' && (
        <YourActivity/>
      )}

      {activeTab === 'ongoing_complaints' && (
        <OngoingComplaints/>
      )}

      {activeTab === 'complaints_history' && (
        <ComplaintsHistory/>
      )}

      {activeTab === 'users' && (
        <Users/>
      )}
    </div>
  );
}
