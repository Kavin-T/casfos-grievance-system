/*
 * authApi.js
 *
 * Purpose:
 * This file provides authentication-related API functions for the CASFOS Grievance Redressal System frontend.
 * It handles user login and authentication status checks using Axios for HTTP requests.
 *
 * Features:
 * - loginUser: Authenticates a user with username and password, returns user data or error message.
 * - checkAuthentication: Checks if the current user session is authenticated.
 *
 * Usage:
 * Import these functions wherever authentication or login logic is required in the frontend.
 * Example: import { loginUser, checkAuthentication } from '../services/authApi';
 *
 * Dependencies:
 * - axios.js: Configured Axios instance for API requests.
 *
 * Notes:
 * - Handles both frontend and backend errors gracefully.
 */

import axios from "./axios";

// Login user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Login failed.";
  }
};

// Check authentication
export const checkAuthentication = async () => {
  try {
    const response = await axios.get("/auth/check");
    return response.data.authenticated;
  } catch (error) {
    return false;
  }
};
