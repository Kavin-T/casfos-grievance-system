import { jwtDecode } from "jwt-decode"; // Ensure this package is installed

// Function to retrieve and validate the token
export const getToken = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No token found. Please log in.");
    return null;
  }

  return token;
};

// Function to decode the token and get user details
export const getUser = () => {
  const token = getToken(); // Get and validate the token

  if (!token) {
    return null; // No valid token
  }

  try {
    const { username, id, designation } = jwtDecode(token); // Decode token to extract details
    return { username, id, designation }; // Return user details
  } catch (error) {
    console.error("Failed to decode user details:", error);
    return null;
  }
};
