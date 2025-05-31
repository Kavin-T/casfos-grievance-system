/*
 * yourActivity.js
 *
 * Purpose:
 * This file provides API functions for user activity and complaint workflow operations in the CASFOS Grievance Redressal System frontend.
 * It handles fetching complaints by designation, updating status, work done, department changes, and price updates.
 *
 * Features:
 * - fetchComplaintsByDesignation: Retrieves complaints assigned to the current user's designation.
 * - updateStatus: Updates the status of a complaint.
 * - updateWorkDone: Submits work done details and files for a complaint.
 * - changeDepartment: Changes the department assigned to a complaint.
 * - updateComplaintPrice: Updates the price/expenditure for a complaint.
 *
 * Usage:
 * Import these functions wherever user activity or complaint workflow logic is required in the frontend.
 * Example: import { fetchComplaintsByDesignation, updateStatus } from '../services/yourActivity';
 *
 * Dependencies:
 * - axios.js: Configured Axios instance for API requests.
 *
 * Notes:
 * - Handles both frontend and backend errors gracefully.
 * - Update endpoints as needed to match backend API changes.
 */

import axios from "./axios";

// Fetch complaints by designation
export const fetchComplaintsByDesignation = async () => {
  try {
    const response = await axios.get(`/complaint/your-activity`);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch complaints.";
  }
};

// Update complaint status
export const updateStatus = async (formData, endpoint) => {
  try {
    const response = await axios.put(`/status/${endpoint}`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to update complaints.";
  }
};

// Update work done status
export const updateWorkDone = async (formData,endpoint) => {
  try {
    const response = await axios.post(
      `/status/${endpoint}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to update complaints.";
  }
};

export const changeDepartment = async ({ id, newDepartment }) => {
  try {
    const response = await axios.put(`/status/change-department`, {
      id,
      newDepartment,
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to change department.";
  }
};

export const updateComplaintPrice = async (body) => {
  try{
    const response = await axios.put("/status/update-complaint-price", body);
    return response.data;
  }
  catch(error){
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to update price.";
  }
};
