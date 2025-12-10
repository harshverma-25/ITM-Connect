/**
 * ✅ ITM Roll Number Validator (PRODUCTION READY)
 * Format: 0905(BRANCH)(YEAR)(ROLL)
 * Example: 0905IT231055 | 0905CSE231055 | 0905AIML241023
 */

const allowedBranches = [
  "IT", "CS", "CSE",
  "AI", "DS", "AL", "AIML",
  "CE", "ME", "EE",
  "EC", "ECE", "EN", "ET",
  "BT", "CH", "PE",
  "AE", "IE", "MT",
  "RO", "CY"
];

export const validateRollNumber = (rollNumber) => {
  if (!rollNumber || typeof rollNumber !== "string") {
    return {
      valid: false,
      message: "Roll number is required and must be a string",
    };
  }

  const cleanRoll = rollNumber.trim().toUpperCase();

  // ✅ Must start with 0905
  if (!cleanRoll.startsWith("0905")) {
    return {
      valid: false,
      message: "Roll number must start with college code 0905",
    };
  }

  // ✅ Must be at least 11 chars: 0905 + IT + 23 + 1
  if (cleanRoll.length < 11) {
    return {
      valid: false,
      message: "Roll number is too short",
    };
  }

  // ✅ Extract parts SAFELY using regex
  const rollRegex = /^0905([A-Z]{2,4})(\d{2})(\d{1,4})$/;
  const match = cleanRoll.match(rollRegex);

  if (!match) {
    return {
      valid: false,
      message: "Roll number format is invalid",
    };
  }

  const branch = match[1];       // ✅ 2–4 letters
  const yearPart = match[2];     // ✅ 2 digits
  const rollDigits = match[3];   // ✅ 1–4 digits

  // ✅ Branch validation
  if (!allowedBranches.includes(branch)) {
    return {
      valid: false,
      message: `Invalid branch. Allowed: ${allowedBranches.join(", ")}`,
    };
  }

  // ✅ Year validation (2020–2029)
  const year = parseInt(yearPart, 10);
  if (year < 20 || year > 29) {
    return {
      valid: false,
      message: "Admission year must be between 20–29",
    };
  }

  // ✅ Roll number validation (0001 – 9999)
  const rollValue = parseInt(rollDigits, 10);
  if (rollValue < 1 || rollValue > 9999) {
    return {
      valid: false,
      message: "Roll number must be between 0001–9999",
    };
  }

  // ✅ SUCCESS
  return {
    valid: true,
    message: "Valid roll number",
    rollNumber: cleanRoll,
    collegeCode: "0905",
    branch,
    admissionYear: `20${yearPart}`,
    yearShort: yearPart,
    rollDigits,
    parsedData: {
      fullYear: `20${yearPart}`,
      branch,
      rollSequence: rollValue,
    },
  };
};

// ✅ Extract details safely
export const extractRollNumberDetails = (rollNumber) => {
  const validation = validateRollNumber(rollNumber);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  return validation.parsedData;
};

// ✅ Display formatter
export const formatRollNumberDisplay = (rollNumber) => {
  const validation = validateRollNumber(rollNumber);

  if (!validation.valid) return rollNumber;

  return `${validation.branch} ${validation.yearShort}-${validation.rollDigits}`;
};
