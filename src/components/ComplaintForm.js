import React, { useState } from 'react';
import { ClipboardIcon, BuildingOfficeIcon, MapPinIcon, PaperClipIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function ComplaintForm({ user, onSubmit }) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [department, setDepartment] = useState('');
  const [premises, setPremises] = useState('');
  const [location, setLocation] = useState('');
  const [otherLocation, setOtherLocation] = useState('');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      name,
      subject,
      details,
      department,
      premises,
      location: location === 'Other' ? otherLocation : location,
      raisedOn: date,
      status: 'Not started',
      raisedBy: user.id,
      fileAttachment: file ? file.name : null,
    };
    
    onSubmit(newComplaint);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    // Reset form
    setName('');
    setSubject('');
    setDetails('');
    setDepartment('');
    setPremises('');
    setLocation('');
    setOtherLocation('');
    setFile(null);
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Complaint Raiser Name <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            id="name"
            required
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      {/* Subject input */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ClipboardIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            id="subject"
            required
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      {/* Date picker */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date of Incident <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="date"
            id="date"
            required
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Details textarea */}
      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700">
          Details <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <textarea
            id="details"
            required
            rows={3}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
      </div>

      {/* Department select */}
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Department <span className="text-red-500">*</span>
        </label>
        <select
          id="department"
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select a department</option>
          <option value="Civil">Civil</option>
          <option value="Electrical">Electrical</option>
        </select>
      </div>

      {/* Premises select */}
      <div>
        <label htmlFor="premises" className="block text-sm font-medium text-gray-700">
          Premises <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            id="premises"
            required
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={premises}
            onChange={(e) => setPremises(e.target.value)}
          >
            <option value="">Select premises</option>
            <option value="VanVigyan">VanVigyan</option>
            <option value="VanVatika">VanVatika</option>
            <option value="CASFOS Sports Ground">CASFOS Sports Ground</option>
            <option value="Main Gate">Main Gate</option>
            <option value="Parking Area">Parking Area</option>
          </select>
        </div>
      </div>

      {/* Location select */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            id="location"
            required
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select location</option>
            <option value="Principal Chamber">Principal Chamber</option>
            <option value="Office">Office</option>
            <option value="Library">Library</option>
            <option value="Corbett Hall">Corbett Hall</option>
            <option value="GIS Lab">GIS Lab</option>
            <option value="V.C. Room">V.C. Room</option>
            <option value="Faculty Chamber">Faculty Chamber</option>
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Champion Hall">Champion Hall</option>
            <option value="G.D. Room">G.D. Room</option>
            <option value="IT & UPS Room">IT & UPS Room</option>
            <option value="Terrace & Staircase">Terrace & Staircase</option>
            <option value="Pavilion">Pavilion</option>
            <option value="Tennis Court">Tennis Court</option>
            <option value="Basketball Court">Basketball Court</option>
            <option value="Gym">Gym</option>
            <option value="Shuttle Cock Court">Shuttle Cock Court</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Overhead Tank">Overhead Tank</option>
            <option value="Sump">Sump</option>
            <option value="Pump Room">Pump Room</option>
            <option value="E.B. Room">E.B. Room</option>
            <option value="Security">Security</option>
            <option value="Cycle Stand">Cycle Stand</option>
            <option value="Toilet">Toilet</option>
            <option value="Front side Lawn Area">Front side Lawn Area</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Other Location input */}
      {location === 'Other' && (
        <div>
          <label htmlFor="otherLocation" className="block text-sm font-medium text-gray-700">
            Specify Other Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="otherLocation"
            required
            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={otherLocation}
            onChange={(e) => setOtherLocation(e.target.value)}
          />
        </div>
      )}

      {/* File upload */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Attachment (Optional)
        </label>
        <div className="mt-1 flex items-center">
          <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
            {file ? (
              <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <PaperClipIcon className="h-full w-full text-gray-300" aria-hidden="true" />
            )}
          </span>
          <label
            htmlFor="file-upload"
            className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
          >
            {file ? 'Change file' : 'Upload a file'}
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      </div>

      {/* Submit button */}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
