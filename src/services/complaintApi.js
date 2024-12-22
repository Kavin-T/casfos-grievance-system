import axios from "axios";
import { getToken } from "../utils/useToken";

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const addComplaint = async (formData) => {
  const token = getToken(); // Retrieve the token using your utility function
  try {
    const response = await axios.post(
      `${BASE_URL}/complaint/add`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to submit complaint.";
  }
};

export const fetchComplaint = async (filters,page) => {
  const token = getToken(); // Retrieve the token using your utility function
  try {
    const response = await axios.get(`${BASE_URL}/complaint`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      },
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
