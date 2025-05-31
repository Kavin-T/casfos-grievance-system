/*
 * formatting.js
 *
 * Purpose:
 * This utility file provides formatting and helper functions for displaying data in the CASFOS Grievance Redressal System frontend.
 * It includes functions for formatting designations, statuses, departments, dates, prices, and durations.
 *
 * Features:
 * - designationFormat: Converts designation codes to human-readable labels.
 * - statusFormat: Converts status codes and department to readable status strings.
 * - departmentFormat: Converts department codes to readable names.
 * - dateFormat: Formats dates for display.
 * - priceFormat: Formats price values for display.
 * - calculateDuration: Calculates and formats the duration between two timestamps.
 *
 * Usage:
 * Import and use these functions wherever data needs to be formatted for display in the UI.
 * Example: import { dateFormat, priceFormat } from '../utils/formatting';
 *
 * Notes:
 * - Designed for use in React components and services for consistent formatting.
 */

export const designationFormat = (designation) => {
  switch (designation) {
    case "PRINCIPAL":
      return "Principal";
    case "ESTATE_OFFICER":
      return "Estate Officer";
    case "ASSISTANT_TO_ESTATE_OFFICER":
      return "Assistant to Estate Officer";
    case "COMPLAINANT":
      return "Complainant";
    case "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL":
      return "Executive Engineer";
    case "EXECUTIVE_ENGINEER_IT":
      return "Head of Office (IT)";
    case "ASSISTANT_ENGINEER_CIVIL":
      return "Assistant Engineer (Civil)";
    case "ASSISTANT_ENGINEER_ELECTRICAL":
      return "Assistant Engineer (Electrical)";
    case "ASSISTANT_ENGINEER_IT":
      return "Officer in Charge (IT)";
    case "JUNIOR_ENGINEER_CIVIL":
      return "Junior Engineer (Civil)";
    case "JUNIOR_ENGINEER_ELECTRICAL":
      return "Junior Engineer (Electrical)";
    case "JUNIOR_ENGINEER_IT":
      return "System Analyst (IT)";
    default:
      return "Unknown Role";
  }
};

export const statusFormat = (status, department) => { 
  if (status === "RAISED") {
    return "Raised";
  } else if (status === "JE_ACKNOWLEDGED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "JE Acknowledged";
  } else if( status === "JE_ACKNOWLEDGED" && department==="IT") {
    return "SA Acknowledged";
  }

  else if (status === "JE_WORKDONE" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "JE Work Done";
  } else if( status === "JE_WORKDONE" && department==="IT") {
    return "SA Work Done";
  }
  
  else if (status === "AE_ACKNOWLEDGED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "AE Approved";
  } else if( status === "AE_ACKNOWLEDGED" && department==="IT") {
    return "OC Approved";
  }
  else if (status === "EE_ACKNOWLEDGED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "EE Approved";
  } else if( status === "EE_ACKNOWLEDGED" && department==="IT") {
    return "HO Approved";
  }
  else if (status === "RESOLVED") {
    return "Resolved";
  } else if (status === "CLOSED") {
    return "Closed";
  } else if (status === "RESOURCE_REQUIRED") {
    return "Resource Required";
  } 
  
  else if (status === "AE_NOT_SATISFIED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "AE Not Satisfied";
  } else if( status === "AE_NOT_SATISFIED" && department==="IT") {
    return "OC Not Satisfied";
  }
  else if (status === "EE_NOT_SATISFIED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "EE Not Satisfied";
  } else if( status === "EE_NOT_SATISFIED" && department==="IT") {
    return "HO Not Satisfied";
  }
  else if (status === "CR_NOT_SATISFIED") {
    return "CR Not Satisfied";
  } 
  else if (status === "AE_NOT_TERMINATED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "AE Not Terminated";
  } else if( status === "AE_NOT_TERMINATED" && department==="IT") {
    return "OC Not Terminated";
  }
  else if (status === "AE_TERMINATED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "AE Terminated";
  } else if( status === "AE_TERMINATED" && department==="IT") {
    return "OC Terminated";
  }
  else if (status === "EE_TERMINATED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "EE Terminated";
  } else if( status === "EE_TERMINATED" && department==="IT") {
    return "HO Terminated";
  }
  else if (status === "EE_NOT_TERMINATED" && (department==="CIVIL" || department==="ELECTRICAL") ) {
    return "EE Not Terminated";
  } else if( status === "EE_NOT_TERMINATED" && department==="IT") {
    return "HO Not Terminated";
  }
  else if (status === "TERMINATED") {
    return "Terminated";
  } else if(status === "CR_NOT_TERMINATED"){
    return "CR Not Terminated";
  } else {
    return "Unknown Status";
  }
};

export const departmentFormat = (department) => {
  switch (department) {
    case "CIVIL":
      return "Civil";
    case "ELECTRICAL":
      return "Electrical";
    case "IT":
      return "IT";
    default:
      return "Unknown Department";
  }
};

export const dateFormat = (date) => {
  return new Date(date).toLocaleString("ru-RU");
};

export const priceFormat = (price) => {
  return parseFloat(price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const calculateDuration = (timestamp1, timestamp2) => {
  let date1 = new Date(timestamp1);
  let date2 = new Date(timestamp2);

  if (date1 > date2) [date1, date2] = [date2, date1];

  let months =
    date2.getMonth() -
    date1.getMonth() +
    12 * (date2.getFullYear() - date1.getFullYear());
  let days = date2.getDate() - date1.getDate();
  let hours = date2.getHours() - date1.getHours();
  let minutes = date2.getMinutes() - date1.getMinutes();

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const prevMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }

  const pluralize = (value, singular, plural) =>
    `${value} ${value === 1 ? singular : plural}`;

  const result = [];
  if (months > 0) result.push(pluralize(months, "month", "months"));
  if (days > 0) result.push(pluralize(days, "day", "days"));
  if (hours > 0) result.push(pluralize(hours, "hour", "hours"));
  if (minutes > 0) result.push(pluralize(minutes, "minute", "minutes"));

  return result.length > 0 ? result.join(", ") : "0 minutes";
};
