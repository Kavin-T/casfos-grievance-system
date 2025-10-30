/*
 * axios.js
 *
 * Purpose:
 * This file configures and exports a pre-configured Axios instance for making HTTP requests in the CASFOS Grievance Redressal System frontend.
 * It sets the base URL and credentials policy for all API requests.
 *
 * Features:
 * - Sets the base URL from environment variables (REACT_APP_BACKEND_API_URL).
 * - Enables sending credentials (cookies) with requests.
 * - Exports the configured Axios instance for use throughout the app.
 *
 * Usage:
 * Import this Axios instance in service files to make API requests.
 * Example: import axios from '../services/axios';
 *
 * Notes:
 * - Update the environment variable in .env to change the backend API URL.
 */

import axios from "axios";
import { getBaseUrl } from "../utils/getBaseUrl";

const BASE_URL = getBaseUrl();

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

export default axios;
