import axios from "./axios";

// Fetch notifications
export const fetchNotifications = async (fromDate, toDate) => {
  try {
    const response = await axios.get("/notification", {
      params: { fromDate, toDate },
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch notifications.";
  }
};

// Mark notifications as read
export const markNotificationsAsRead = async () => {
  try {
    await axios.put("/notification/read");
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};
