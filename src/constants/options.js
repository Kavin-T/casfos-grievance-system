export const designations = [
  { value: "PRINCIPAL", label: "Principal" },
  { value: "ESTATE_OFFICER", label: "Estate Officer" },
  { value: "ASSISTANT_TO_ESTATE_OFFICER", label: "Assistant to Estate Officer" },
  { value: "COMPLAINANT", label: "Complainant" },
  { value: "EXECUTIVE_ENGINEER_CIVIL", label: "Executive Engineer (Civil)" },
  { value: "EXECUTIVE_ENGINEER_ELECTRICAL", label: "Executive Engineer (Electrical)" },
  { value: "ASSISTANT_ENGINEER_CIVIL", label: "Assistant Engineer (Civil)" },
  { value: "ASSISTANT_ENGINEER_ELECTRICAL", label: "Assistant Engineer (Electrical)" },
  { value: "JUNIOR_ENGINEER_CIVIL", label: "Junior Engineer (Civil)" },
  { value: "JUNIOR_ENGINEER_ELECTRICAL", label: "Junior Engineer (Electrical)" },
];

export const statusOptions = {
  RAISED: [
    { value: "JE_ACKNOWLEDGED", label: "JE_ACKNOWLEDGED" },
    { value: "RESOURCE_REQUIRED", label: "RESOURCE_REQUIRED" },
  ],
  JE_WORKDONE: [
    { value: "AE_ACKNOWLEDGED", label: "AE_ACKNOWLEDGED" },
    { value: "AE_NOT_SATISFIED", label: "AE_NOT_SATISFIED" },
  ],
  AE_ACKNOWLEDGED: [
    { value: "EE_ACKNOWLEDGED", label: "EE_ACKNOWLEDGED" },
    { value: "EE_NOT_SATISFIED", label: "EE_NOT_SATISFIED" },
  ],
  EE_ACKNOWLEDGED: [{ value: "RESOLVED", label: "RESOLVED" }],
  RESOURCE_REQUIRED: [
    { value: "CLOSED", label: "CLOSED" },
    { value: "RAISED", label: "RAISED" },
  ],
  EE_NOT_SATISFIED: [
    { value: "AE_NOT_SATISFIED", label: "AE_NOT_SATISFIED" },
    { value: "AE_ACKNOWLEDGED", label: "AE_ACKNOWLEDGED" },
  ],
  JE_ACKNOWLEDGED: [{ value: "JE_WORKDONE", label: "JE_WORKDONE" }],
  AE_NOT_SATISFIED: [{ value: "JE_WORKDONE", label: "JE_WORKDONE" }],
};