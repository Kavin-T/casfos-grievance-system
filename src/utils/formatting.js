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
}

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
      return "Unknown Status"; // Default case for unmatched statuses
    }
};

export const dateFormat = (input) => {
    return new Date(input).toLocaleDateString('ru-RU');
}

export const priceFormat = (input) => {
  return parseFloat(input.$numberDecimal).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}