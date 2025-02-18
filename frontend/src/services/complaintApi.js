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
