import React, { useState } from 'react';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import ComplaintStats from './ComplaintStats';

export default function Dashboard({ user, complaints, onNewComplaint, onStatusChange, onFeedbackSubmit }) {
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'new', label: 'New Complaint', show: user.role === 'complaint_raiser' },
    { id: 'list', label: 'Complaint List', show: true },
    { id: 'stats', label: 'Complaint Stats', show: true }, // Changed to always show
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.filter(tab => tab.show).map((tab) => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </div>
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

      {activeTab === 'new' && user.role === 'complaint_raiser' && (
        <ComplaintForm user={user} onSubmit={onNewComplaint} />
      )}
      
      {activeTab === 'list' && (
        <ComplaintList
          user={user}
          complaints={complaints}
          onStatusChange={onStatusChange}
          onFeedbackSubmit={onFeedbackSubmit}
        />
      )}
      
      {activeTab === 'stats' && (
        <ComplaintStats complaints={complaints} />
      )}
    </div>
  );
}