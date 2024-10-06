import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { ClipboardIcon, BuildingOfficeIcon, MapPinIcon, PaperClipIcon, CheckCircleIcon, ClockIcon, ArrowDownTrayIcon, ChatBubbleLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function ComplaintList({ user, complaints, onStatusChange, onFeedbackSubmit }) {
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [statusChangeComplaint, setStatusChangeComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleDownload = (fileAttachment) => {
    saveAs(`/files/${fileAttachment}`, fileAttachment);
  };

  const handleFeedbackSubmit = () => {
    onFeedbackSubmit(feedbackComplaint.id, feedback);
    setFeedbackComplaint(null);
    setFeedback('');
  };

  const handleStatusChangeSubmit = () => {
    onStatusChange(statusChangeComplaint.id, newStatus);
    setStatusChangeComplaint(null);
    setNewStatus('');
  };

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <div key={complaint.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Complaint Header: Subject and Status */}
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer" onClick={() => setExpandedComplaint(expandedComplaint === complaint.id ? null : complaint.id)}>
            <div className="flex items-center">
              <ClipboardIcon className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">{complaint.subject}</h3>
            </div>
            <div className="flex items-center space-x-4">
              {/* Show status next to the subject */}
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                complaint.status === 'Work completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {complaint.status}
              </span>
              {/* Expand/Collapse Icon */}
              {expandedComplaint === complaint.id ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {/* Complaint Details (shown when expanded) */}
          {expandedComplaint === complaint.id && (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Details</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.details}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Department
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.department}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.premises} - {complaint.location}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.role === 'casfos_admin' || user.role === 'cpwd_admin' ? (
                      <button
                        onClick={() => {
                          setStatusChangeComplaint(complaint);
                          setNewStatus(complaint.status);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Change Status
                      </button>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        complaint.status === 'Work completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status}
                      </span>
                    )}
                  </dd>
                </div>
                {complaint.fileAttachment && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <PaperClipIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Attachment
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <button
                        onClick={() => handleDownload(complaint.fileAttachment)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download
                      </button>
                    </dd>
                  </div>
                )}
                {user.role === 'complaint_raiser' && complaint.status === 'Work completed' && !complaint.feedback && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Feedback
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <button
                        onClick={() => setFeedbackComplaint(complaint)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Provide Feedback
                      </button>
                    </dd>
                  </div>
                )}
                {complaint.feedback && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Feedback
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.feedback}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      ))}

      {/* Feedback Modal */}
      {feedbackComplaint && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Provide Feedback</h3>
                    <div className="mt-2">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Enter your feedback here"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleFeedbackSubmit}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => setFeedbackComplaint(null)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {statusChangeComplaint && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Change Status</h3>
                    <div className="mt-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      >
                        <option value="Work in progress">Work in progress</option>
                        <option value="Work completed">Work completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleStatusChangeSubmit}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => setStatusChangeComplaint(null)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
