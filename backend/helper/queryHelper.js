const getQuery = (req) => {
  const {
    startDate,
    endDate,
    createdStartDate,
    createdEndDate,
    acknowledgedStartDate,
    acknowledgedEndDate,
    resolvedStartDate,
    resolvedEndDate,
    status,
    ...filters
  } = req;

  const query = {};

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (createdStartDate || createdEndDate) {
    query.createdAt = {};
    if (createdStartDate) query.createdAt.$gte = new Date(createdStartDate);
    if (createdEndDate) query.createdAt.$lte = new Date(createdEndDate);
  }

  if (acknowledgedStartDate || acknowledgedEndDate) {
    query.acknowledgeAt = {};
    if (acknowledgedStartDate)
      query.acknowledgeAt.$gte = new Date(acknowledgedStartDate);
    if (acknowledgedEndDate)
      query.acknowledgeAt.$lte = new Date(acknowledgedEndDate);
  }

  if (resolvedStartDate || resolvedEndDate) {
    query.resolvedAt = {};
    if (resolvedStartDate) query.resolvedAt.$gte = new Date(resolvedStartDate);
    if (resolvedEndDate) query.resolvedAt.$lte = new Date(resolvedEndDate);
  }

  if (status) {
    if(status === "JE_WORKDONE"){
      query.status = status;
    }
    else if (status === "TERMINATED" || status === "RESOLVED") {
      query.status = status;
    } else if (status === "PENDING") {
      query.status = { $nin: ["TERMINATED", "RESOLVED"] };
    }
  }

  const filterableFields = [
    "complainantName",
    "subject",
    "department",
    "premises",
    "location",
    "specificLocation",
    "details",
    "emergency",
    "complaintID",
  ];

  filterableFields.forEach((field) => {
    if (filters[field] !== undefined && filters[field] !== "") {
      if (field === "emergency") {
        query[field] = filters[field] === "true";
      } 
      else {
        query[field] = { $regex: filters[field], $options: "i" };
      }
    }
  });

  return query;
};

module.exports = getQuery;
