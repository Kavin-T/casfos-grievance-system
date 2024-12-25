import axios from "axios";
import { getToken } from "../utils/useToken";

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const addComplaint = async (formData) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${BASE_URL}/complaint/add`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
  const token = getToken();
  try {
    const response = await axios.get(`${BASE_URL}/complaint`, {
      headers: {
        Authorization: `Bearer ${token}`,
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

export const fetchComplaintStatistics = async (year, month) => {
  const token = getToken(); 
  try {
    const response = await axios.get(`${BASE_URL}/complaint/statistics`, {
      params: { year, month },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch complaints statistics.";
  }
};

