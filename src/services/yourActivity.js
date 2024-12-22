import axios from "axios";
import { getToken,getUser } from "../utils/useToken";

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const fetchComplaintsByDesignation = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${BASE_URL}/your-activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch complaints.";
  }
};

export const updateStatus = async (formData,endpoint) => {
    const token = getToken();
    try {
        const response = await axios.put(`${BASE_URL}/status/${endpoint}`,
            formData,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response && error.response.data.message
        ? error.response.data.message
        : "Unable to update complaints.";
    }
};

export const updateWorkDone = async (formData) => {
    const token = getToken();
    try {
        const response = await axios.post(`${BASE_URL}/status/je-acknowledged/je-workdone`, 
            formData,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response && error.response.data.message
        ? error.response.data.message
        : "Unable to update complaints.";
    }
};