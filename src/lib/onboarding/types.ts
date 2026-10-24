// Shared types for the Onboarding concept flow. Mirrors the spec's section 2
// state model — `status` on a Step is always derived (see derive.ts), never
// set directly, so the UI can't drift out of sync with the underlying fields.

export type StepId = "personal" | "tax" | "deposit" | "eligibility" | "benefits" | "policies";
export type StepStatus = "not_started" | "in_progress" | "needs_attention" | "done";

export interface Step {
  id: StepId;
  title: string;
  minutes: number;
  status: StepStatus;
  issues: Issue[];
}

export interface Issue {
  fieldId: string;
  message: string;
  example?: string;
  severity: "blocking" | "suggestion";
}

export interface AiSuggestion {
  id: string;
  fieldId: string;
  kind: "explain" | "example" | "consistency_check";
  text: string;
  actions: ("use_this" | "edit" | "dismiss")[];
  sensitive: false;
}

export type FilingStatus = "single_or_mfs" | "married_jointly" | "head_of_household";
export type CitizenshipStatus = "citizen" | "noncitizen_national" | "permanent_resident" | "authorized_alien";
export type AccountType = "checking" | "savings";
export type BenefitChoice = "enroll" | "waive" | "decide_later";

export interface PersonalFields {
  legalName: string;
  preferredName: string;
  dob: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  touched: boolean;
  attempted: boolean;
}

export interface TaxFields {
  filingStatus: FilingStatus | "";
  multipleJobs: "yes" | "no" | "";
  dependents: string;
  extraWithholding: string;
  signatureName: string;
  confirmed: boolean;
  touched: boolean;
  attempted: boolean;
}

export interface DepositFields {
  noBankAccount: boolean;
  altOptionAcknowledged: boolean;
  accountHolderName: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: AccountType | "";
  touched: boolean;
  attempted: boolean;
}

export interface EligibilityFields {
  legalName: string;
  otherNamesUsed: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  citizenshipStatus: CitizenshipStatus | "";
  ssn: string;
  signatureName: string;
  confirmed: boolean;
  touched: boolean;
  attempted: boolean;
}

export interface BenefitsFields {
  medical: BenefitChoice | "";
  dentalVision: BenefitChoice | "";
  retirement401k: BenefitChoice | "";
  touched: boolean;
  attempted: boolean;
}

export interface PoliciesFields {
  readIds: string[]; // document ids marked "I've read this"
  acknowledged: boolean;
  touched: boolean;
  attempted: boolean;
}

export interface OnboardingFormData {
  personal: PersonalFields;
  tax: TaxFields;
  deposit: DepositFields;
  eligibility: EligibilityFields;
  benefits: BenefitsFields;
  policies: PoliciesFields;
}

export interface OnboardingState {
  accountStatus: "invited" | "verifying" | "active";
  steps: Record<StepId, Step>;
  forms: OnboardingFormData;
  helpOpen: boolean;
  helpContext?: { stepId?: StepId; fieldId?: string };
  tourSeen: boolean;
  tourOpen: boolean;
  savedAt?: string;
  dismissedSuggestions: string[];
}
