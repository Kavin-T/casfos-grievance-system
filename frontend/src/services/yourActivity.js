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
export const updateWorkDone = async (formData) => {
  try {
    const response = await axios.post(
      `/status/je-acknowledged/je-workdone`,
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
