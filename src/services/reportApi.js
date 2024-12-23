import axios from "axios";
import { getToken } from "../utils/useToken";
import { dateFormat } from "../utils/formatting";

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getReport = async (filters) => {
  const token = getToken();
  try {
    const response = await axios.get(`${BASE_URL}/report`, {
      params: filters,
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `complaints_report_${dateFormat(new Date())}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : "Unable to get Report.";
  }
};
