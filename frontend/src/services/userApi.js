/*
 * userApi.js
 *
 * Purpose:
 * This file provides API functions for user management operations in the CASFOS Grievance Redressal System frontend.
 * It handles fetching, adding, updating, and deleting users via the backend API.
 *
 * Features:
 * - fetchUsers: Retrieves all users from the backend.
 * - addUser: Adds a new user with provided form data.
 * - updateUser: Updates an existing user's information.
 * - deleteUser: Deletes a user by ID.
 *
 * Usage:
 * Import these functions wherever user management is required in the frontend.
 * Example: import { fetchUsers, addUser } from '../services/userApi';
 *
 * Dependencies:
 * - axios.js: Configured Axios instance for API requests.
 *
 * Notes:
 * - Handles both frontend and backend errors gracefully.
 * - Update endpoints as needed to match backend API changes.
 */

import axios from "./axios";

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`/user/all`);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch users.";
  }
};

// Add a new user
export const addUser = async (formData) => {
  try {
    const response = await axios.post(`/user/add`, formData);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to add user.";
  }
};

// Update an existing user
export const updateUser = async (formData) => {
  try {
    const response = await axios.put(`/user/update`, formData);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to update user.";
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`/user/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to delete user.";
  }
};
