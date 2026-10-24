import type { OnboardingFormData } from "./types";

export const COMPANY = "Acme Studio";
export const HR_CONTACT = "Priya Shah";
export const MANAGER = "Sam Lee";
export const EMPLOYEE_EMAIL = "jordan.rivera@acmestudio.example";
export const START_DATE = "Mon, Nov 2, 2026";
export const FIRST_PAYDAY = "Fri, Nov 13, 2026";

export const POLICY_DOCS = [
  { id: "handbook", title: "Employee Handbook" },
  { id: "conduct", title: "Code of Conduct" },
  { id: "expense", title: "Expense Policy" },
  { id: "security", title: "IT & Security Policy" },
];

// Matches spec section 10: steps 1–2 done, step 3 (deposit) in progress,
// steps 4–6 not started.
export const initialFormData: OnboardingFormData = {
  personal: {
    legalName: "Jordan Rivera",
    preferredName: "Jordan",
    dob: "04/12/1996",
    street: "214 Congress Ave",
    city: "Austin",
    state: "TX",
    zip: "78701",
    phone: "(512) 555-0142",
    emergencyContactName: "Alex Rivera",
    emergencyContactPhone: "",
    touched: true,
    attempted: true,
  },
  tax: {
    filingStatus: "single_or_mfs",
    multipleJobs: "no",
    dependents: "",
    extraWithholding: "",
    signatureName: "Jordan Rivera",
    confirmed: true,
    touched: true,
    attempted: true,
  },
  deposit: {
    noBankAccount: false,
    altOptionAcknowledged: false,
    accountHolderName: "Jordan Rivera",
    bankName: "Lone Star Credit Union",
    routingNumber: "11100001",
    accountNumber: "",
    accountType: "",
    touched: true,
    attempted: false,
  },
  eligibility: {
    legalName: "",
    otherNamesUsed: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    citizenshipStatus: "",
    ssn: "",
    signatureName: "",
    confirmed: false,
    touched: false,
    attempted: false,
  },
  benefits: {
    medical: "",
    dentalVision: "",
    retirement401k: "",
    touched: false,
    attempted: false,
  },
  policies: {
    readIds: [],
    acknowledged: false,
    touched: false,
    attempted: false,
  },
};
