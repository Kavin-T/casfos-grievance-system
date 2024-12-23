import axios from "axios";
import { getToken } from "../utils/useToken";

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const fetchUsers = async () => {
  const token = getToken(); // Retrieve the token using your utility function
  try {
    const response = await axios.get(`${BASE_URL}/user/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token here
      },
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch users.";
  }
};

export const addUser = async (formData) => {
  const token = getToken(); // Retrieve the token using your utility function
  try {
    const response = await axios.post(
      `${BASE_URL}/user/add`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to add user.";
  }
};

export const updateUser = async (formData) => {
  const token = getToken(); // Retrieve the token using your utility function
  try {
    const response = await axios.put(
      `${BASE_URL}/user/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to update user.";
  }
};


export const deleteUser = async (id) => {
  const token = getToken(); 
  try {
    const response = await axios.delete(
      `${BASE_URL}/user/delete/${id}`,
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
      : "Unable to delete user.";
  }
};
