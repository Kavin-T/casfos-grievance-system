import axios from "./axios";
import { dateFormat } from "../utils/formatting";

export const getReport = async (filters) => {
  try {
    const response = await axios.get("/report", {
      params: filters,
      responseType: "blob",
    });

    const contentType = response.headers["content-type"];
    const extension = contentType.includes("pdf") ? "pdf" : "csv";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `complaints_report_${dateFormat(new Date())}.${extension}`
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
