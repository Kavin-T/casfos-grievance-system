import React, { useState } from 'react';
import complaints from '../complaints.json';

export default function ComplaintForm({ user }) {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [department, setDepartment] = useState('');
  const [building, setBuilding] = useState('');
  const [priority, setPriority] = useState('medium');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: complaints.length + 1,
      subject,
      details,
      department,
      building,
      priority,
      status: 'raised',
      raisedBy: user.id,
      raisedOn: new Date().toISOString(),
      fileAttachment: file ? file.name : null,
    };
    
    // In a real application, you would send this data to your backend
    // For this example, we'll just simulate a successful submission
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    // Reset form
    setSubject('');
    setDetails('');
    setDepartment('');
    setBuilding('');
    setPriority('medium');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700">
          Details
        </label>
        <textarea
          id="details"
          required
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          id="department"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select a department</option>
          <option value="IT">IT</option>
          <option value="Maintenance">Maintenance</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <div>
        <label htmlFor="building" className="block text-sm font-medium text-gray-700">
          Building
        </label>
        <input
          type="text"
          id="building"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Attachment
        </label>
        <input
          type="file"
          id="file"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Complaint
        </button>
      </div>

      {success && (
        <div className="mt-3 text-sm text-green-600">
          Complaint submitted successfully!
        </div>
      )}
    </form>
  );
}