import axios from "./axios";

// Login user
export const loginUser = async (username, password) => {
  console.log(username, password);
  try {
    const response = await axios.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    return error.response && error.response.data.message
      ? error.response.data.message
      : "Login failed.";
  }
};

// Check authentication
export const checkAuthentication = async () => {
  try {
    const response = await axios.get("/auth/check");
    return response.data.authenticated;
  } catch (error) {
    return false;
  }
};
