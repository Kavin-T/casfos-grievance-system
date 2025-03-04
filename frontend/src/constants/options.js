export const designations = [
  { value: "PRINCIPAL", label: "Principal" },
  { value: "ESTATE_OFFICER", label: "Estate Officer" },
  {
    value: "ASSISTANT_TO_ESTATE_OFFICER",
    label: "Assistant to Estate Officer",
  },
  { value: "COMPLAINANT", label: "Complainant" },
  { value: "EXECUTIVE_ENGINEER_CIVIL_AND_ELECTRICAL", label: "Executive Engineer" },
  { value: "EXECUTIVE_ENGINEER_IT", label: "Head of Office (IT)" },
  { value: "ASSISTANT_ENGINEER_CIVIL", label: "Assistant Engineer (Civil)" },
  {
    value: "ASSISTANT_ENGINEER_ELECTRICAL",
    label: "Assistant Engineer (Electrical)",
  },
  {
    value: "ASSISTANT_ENGINEER_IT",
    label: "Officer in Charge (IT)",
  },
  { value: "JUNIOR_ENGINEER_CIVIL", label: "Junior Engineer (Civil)" },
  {
    value: "JUNIOR_ENGINEER_ELECTRICAL",
    label: "Junior Engineer (Electrical)",
  },
  { value: "JUNIOR_ENGINEER_IT", label: "System Analyst (IT)" },
];

export const statusOptions = { 
  RAISED: [
    { value: "JE_ACKNOWLEDGED", label: "JE Acknowledged" },
    { value: "RESOURCE_REQUIRED", label: "Resource Required" },
  ],
  JE_WORKDONE: [
    { value: "AE_ACKNOWLEDGED", label: "AE Approved" },
    { value: "AE_NOT_SATISFIED", label: "AE Not Satisfied" },
  ],
  AE_ACKNOWLEDGED: [
    { value: "EE_ACKNOWLEDGED", label: "EE Approved" },
    { value: "EE_NOT_SATISFIED", label: "EE Not Satisfied" },
  ],
  EE_ACKNOWLEDGED: [
    { value: "RESOLVED", label: "Resolved" },
    { value: "eeAcknowledgedToCrNotSatisfied", label: "CR Not Satisfied" },
  ],
  RESOURCE_REQUIRED: [
    { value: "resourceRequiredToAeNotTerminated", label: "AE Not Terminated" },
    { value: "resourceRequiredToAeTerminated", label: "AE Terminated" }
  ],
  EE_NOT_SATISFIED: [
    { value: "AE_NOT_SATISFIED", label: "AE Not Satisfied" },
    { value: "AE_ACKNOWLEDGED", label: "AE Approved" },
  ],
  JE_ACKNOWLEDGED: [{ value: "JE_WORKDONE", label: "JE Work Done" }],
  AE_NOT_SATISFIED: [{ value: "JE_WORKDONE", label: "JE Work Done" }],
  CR_NOT_SATISFIED: [
    { value: "crNotSatisfiedToEeAcknowledged", label: "EE Acknowledged" },
    { value: "crNotSatisfiedToEeNotSatisfied", label: "EE Not Satisfied" },
  ],
  AE_NOT_TERMINATED: [
    { value: "aeNotTerminatedToRaised", label: "Raised" },
    { value: "aeNotTerminatedToResourceRequired", label: "Resource Required" },
  ],
  EE_NOT_TERMINATED: [
    { value: "eeNotTerminatedToAeNotTerminated", label: "AE Not Terminated" },
    { value: "eeNotTerminatedToAeTerminated", label: "AE Terminated" },
  ],
  AE_TERMINATED: [
    { value: "aeTerminatedToEeNotTerminated", label: "EE Not Terminated" },
    { value: "aeTerminatedToEeTerminated", label: "EE Terminated" },
  ],
  EE_TERMINATED: [
    { value: "eeTerminatedToTerminated", label: "Terminated" }
  ],
};

export const locationOptions = {
  "Vana Vigyan Building - Ground Floor": [
    "Admin Section",
    "Training Section",
    "Principal's Chamber",
    "Staff Toilet",
    "Faculty (Gents) Toilet",
    "Corbett Hall",
    "Library ",
    "Video Conference Room",
    "GIS Lab",
    "Officer Trainee - Gents Toilet",
    "Officer Trainee - Ladies Toilet",
    "Faculty (Ladies) Toilet",
    "Corridor",
    "Godown",
    "Store",
    "Parking Shed",
    "Main Gate",
    "Reception Area"
  ],
  "Vana Vigyan Building - First Floor": [
    "Faculty Chambers",
    "GD rooms",
    "IT Room",
    "PT and GI room",
    "UPS room",
    "Faculty (Gents) Toilet",
    "Lecture Hall - 1",
    "Lecture Hall - 2",
    "Champion Hall",
    "Lab",
    "Officer Trainees' - Gents Toilet",
    "Officer Trainees' - Ladies Toilet",
    "Corridor",
    "Faculty (Engineering) Room"
  ],
  "Vana Vatika": ["Common Area", "VIP Room", "Toilet", "Green Room"],
  "Chandan Hostel": [
    "Reception",
    "Mess",
    "A-Block",
    "B-Block",
    "Common Toilets",
    "Corridor",
    "Terrace",
  ],
  "Executive Hostel": [
    "Reception Area",
    "Suite Rooms",
    "Rooms",
    "Common Toilet",
    "Corridor",
    "Outer Area",
    "Dining/Kitchen",
    "Store Room",
  ],
  "Sports Ground": [
    "GYM",
    "Pavilion Building",
    "Store room",
    "PT and GI room",
    "Snooker Hall",
    "Tennis Court",
    "Volley Ball Court",
    "Rest room - Faculty",
    "Rest room - Gents",
    "Rest room - Ladies",
    "Basket Ball Court",
    "Badminton Court",
  ],
  Quarters: [
    "A-5 Quarters",
    "A-2 Quarters",
    "Type-5 ",
    "Type-4",
    "Type-3",
    "Type-2",
    "Type-1",
    "Servant Quarters",
  ],
  "Mess Building": [
    "Dining Room",
    "Kitchen",
    "Store Room",
    "Wash Area",
    "Rest room - Gents",
    "Rest room - Ladies",
    "Corridor",
    "Parking Area",
  ],
  "Ladies Hostel": [
    "Rooms",
    "Washing area",
    "Corridor",
    "Reception",
    "Parking Area",
  ],
};

export const subjectOptions = [
  "Water Leaking",
  "Water Seepage",
  "Water Supply",
  "Water Purifier",
  "Hot Water System",
  "Light Not Working",
  "Fan Not Working",
  "AC Not Working",
  "Internet Not Working",
  "Drainage Block",
  "Motor Not Working",
  "Toilet Flush/HandWash set Not Working",
  "No Power Supply",
  "Sanitation",
];
