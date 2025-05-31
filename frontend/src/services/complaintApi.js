/*
 * complaintApi.js
 *
 * Purpose:
 * This file provides API functions for complaint-related operations in the CASFOS Grievance Redressal System frontend.
 * It handles adding complaints, fetching complaints, statistics, and complaints requiring price entry.
 *
 * Features:
 * - addComplaint: Submits a new complaint with form data (including file uploads).
 * - fetchComplaint: Retrieves complaints with filters and pagination.
 * - fetchComplaintStatistics: Gets statistics for complaints in a date range.
 * - fetchComplaintsWithPriceLater: Fetches complaints that require price entry later.
 *
 * Usage:
 * Import these functions wherever complaint data needs to be managed or displayed in the frontend.
 * Example: import { addComplaint, fetchComplaint } from '../services/complaintApi';
 *
 * Dependencies:
 * - axios.js: Configured Axios instance for API requests.
 *
 * Notes:
 * - Handles both frontend and backend errors gracefully.
 * - Update endpoints as needed to match backend API changes.
 */

import axios from "./axios";

// Add complaint
export const addComplaint = async (formData) => {
  try {
    const response = await axios.post("/complaint/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to submit complaint.";
  }
};

// Fetch complaints
export const fetchComplaint = async (filters, page) => {
  try {
    const response = await axios.get("/complaint", {
      params: {
        ...filters,
        page,
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch complaints.";
  }
};

// Fetch complaint statistics
export const fetchComplaintStatistics = async (fromDate, toDate) => {
  try {
    const response = await axios.get('/complaint/statistics', {
      params: { fromDate, toDate },
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : 'Unable to fetch complaints statistics.';
  }
};

export const fetchComplaintsWithPriceLater = async () => {
  try {
    const response = await axios.get('/complaint/complaints-with-price-later');
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : 'Unable to fetch complaints.';
  }
};
