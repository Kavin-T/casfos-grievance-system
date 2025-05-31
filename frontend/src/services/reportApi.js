/*
 * reportApi.js
 *
 * Purpose:
 * This file provides API functions for generating and downloading complaint reports in the CASFOS Grievance Redressal System frontend.
 * It handles requesting reports from the backend and triggering file downloads in the browser.
 *
 * Features:
 * - getReport: Fetches a report (PDF or CSV) based on filters and downloads it using a generated filename.
 *
 * Usage:
 * Import and use getReport wherever report generation or download is needed in the frontend.
 * Example: import { getReport } from '../services/reportApi';
 *
 * Dependencies:
 * - axios.js: Configured Axios instance for API requests.
 * - dateFormat: Utility for formatting dates in filenames.
 *
 * Notes:
 * - Handles both frontend and backend errors gracefully.
 * - Update endpoints as needed to match backend API changes.
 */

import axios from "./axios";
import { dateFormat } from "../utils/formatting";

export const getReport = async (filters) => {
  try {
    const response = await axios.get("/report", {
      params: filters,
      responseType: "blob",
    });

    const contentType = response.headers["content-type"];
    const extension = contentType.includes("pdf") ? "pdf" : "csv";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `complaints_report_${dateFormat(new Date())}.${extension}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to get Report.";
  }
};
