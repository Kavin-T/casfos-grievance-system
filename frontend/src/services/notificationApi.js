<<<<<<< HEAD
// import axios from "./axios";

// // Fetch notifications
// export const fetchNotifications = async (fromDate, toDate) => {
//   try {
//     const response = await axios.get("/notification", {
//       params: { fromDate, toDate },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response && error.response.data.message
//       ? error.response.data.message
//       : "Unable to fetch notifications.";
//   }
// };






import axios from "./axios";

// Fetch all notifications
export const fetchNotifications = async () => {
  try {
    const response = await axios.get("/notification");
=======
import axios from "./axios";

// Fetch notifications
export const fetchNotifications = async (fromDate, toDate) => {
  try {
    const response = await axios.get("/notification", {
      params: { fromDate, toDate },
    });
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch notifications.";
  }
};
<<<<<<< HEAD
=======

// Mark notifications as read
export const markNotificationsAsRead = async () => {
  try {
    await axios.put("/notification/read");
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
