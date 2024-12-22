import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL; // Access the base URL from .env

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : 'Login failed.';
  }
};