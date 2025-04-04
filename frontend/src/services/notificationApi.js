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
    console.log("Fetched notifications:", response.data);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to fetch notifications.";
  }
};
