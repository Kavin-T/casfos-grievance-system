export const designationFormat = (input) => {
  if (input === "ESTATE_OFFICER") {
    return "Estate Officer";
  } else if (input === "COMPLAINT_RAISER") {
    return "Complaint Raiser";
  } else if (input === "EXECUTIVE_ENGINEER") {
    return "Executive Engineer";
  } else if (input === "ASSISTANT_ENGINEER") {
    return "Assistant Engineer";
  } else if (input === "JUNIOR_ENGINEER") {
    return "Junior Engineer";
  } else {
    return "Unknown Role";
  }
};

export const statusFormat = (input) => {
  if (input === "RAISED") {
    return "Raised";
  } else if (input === "JE_ACKNOWLEDGED") {
    return "JE Acknowledged";
  } else if (input === "JE_WORKDONE") {
    return "JE Work Done";
  } else if (input === "AE_ACKNOWLEDGED") {
    return "AE Acknowledged";
  } else if (input === "EE_ACKNOWLEDGED") {
    return "EE Acknowledged";
  } else if (input === "RESOLVED") {
    return "Resolved";
  } else if (input === "CLOSED") {
    return "Closed";
  } else if (input === "RESOURCE_REQUIRED") {
    return "Resource Required";
  } else if (input === "AE_NOT_SATISFIED") {
    return "AE Not Satisfied";
  } else if (input === "EE_NOT_SATISFIED") {
    return "EE Not Satisfied";
  } else {
    return "Unknown Status";
  }
};

export const dateFormat = (input) => {
  return new Date(input).toLocaleString("ru-RU");
};

export const priceFormat = (input) => {
  return parseFloat(input).toLocaleString("en-IN", {
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