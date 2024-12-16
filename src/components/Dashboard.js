import React, { useState } from 'react';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import ComplaintStats from './ComplaintStats';
import ComplaintFilter from './ComplaintsFilter';

export default function Dashboard({ user, complaints, onNewComplaint, onStatusChange, onFeedbackSubmit }) {
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'new', label: 'New Complaint', show: user.role === 'complaint_raiser' },
    { id: 'list', label: 'Complaint List', show: true },
    { id: 'stats', label: 'Complaint Stats', show: user.role === 'casfos_admin' },
    { id: 'filter', label: 'Complaint Filter', show: true }
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

      {activeTab === 'filter' && (
        <ComplaintFilter />
      )}
      
      {activeTab === 'stats' && user.role === 'casfos_admin' && (
        <ComplaintStats complaints={complaints} />
      )}
    </div>
  );
}
