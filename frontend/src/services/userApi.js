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
