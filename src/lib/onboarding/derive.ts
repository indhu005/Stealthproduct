import type {
  BenefitsFields,
  DepositFields,
  EligibilityFields,
  Issue,
  OnboardingFormData,
  PersonalFields,
  PoliciesFields,
  Step,
  StepId,
  StepStatus,
  TaxFields,
} from "./types";

export const STEP_ORDER: StepId[] = ["personal", "tax", "deposit", "eligibility", "benefits", "policies"];

export const STEP_META: Record<StepId, { title: string; minutes: number }> = {
  personal: { title: "Personal details", minutes: 2 },
  tax: { title: "Tax withholding (federal W-4)", minutes: 4 },
  deposit: { title: "Direct deposit", minutes: 3 },
  eligibility: { title: "Work eligibility (I-9, Section 1)", minutes: 3 },
  benefits: { title: "Benefits", minutes: 2 },
  policies: { title: "Policies and handbook", minutes: 1 },
};

function blocking(fieldId: string, message: string, example?: string): Issue {
  return { fieldId, message, severity: "blocking", example };
}
function suggestion(fieldId: string, message: string, example?: string): Issue {
  return { fieldId, message, severity: "suggestion", example };
}

export function validatePersonal(f: PersonalFields): Issue[] {
  const issues: Issue[] = [];
  if (!f.legalName.trim()) issues.push(blocking("legalName", "Legal name is required.", "e.g. Jordan Rivera"));
  if (!f.dob.trim()) issues.push(blocking("dob", "Date of birth is required.", "e.g. 04/12/1996"));
  if (!f.street.trim()) issues.push(blocking("street", "Street address is required."));
  if (!f.city.trim()) issues.push(blocking("city", "City is required."));
  if (!f.state.trim()) issues.push(blocking("state", "State is required."));
  if (!/^\d{5}$/.test(f.zip.trim())) issues.push(blocking("zip", "ZIP code needs 5 digits.", "e.g. 78701"));
  if (!f.phone.trim()) issues.push(blocking("phone", "Phone number is required.", "e.g. (512) 555-0100"));
  if (f.emergencyContactName.trim() && !f.emergencyContactPhone.trim()) {
    issues.push(suggestion("emergencyContactPhone", "Your emergency contact has no phone number."));
  }
  return issues;
}

export function validateTax(f: TaxFields): Issue[] {
  const issues: Issue[] = [];
  if (!f.filingStatus) issues.push(blocking("filingStatus", "Choose a filing status."));
  if (!f.multipleJobs) issues.push(blocking("multipleJobs", "Let us know about multiple jobs or a working spouse."));
  if (!f.signatureName.trim()) issues.push(blocking("signatureName", "Type your name to sign."));
  if (!f.confirmed) issues.push(blocking("confirmed", "Confirm this is accurate before continuing."));
  return issues;
}

export function validateDeposit(f: DepositFields): Issue[] {
  const issues: Issue[] = [];
  if (f.noBankAccount) {
    if (!f.altOptionAcknowledged) issues.push(blocking("altOptionAcknowledged", "Pick an alternative option to continue."));
    return issues;
  }
  if (!f.bankName.trim()) issues.push(blocking("bankName", "Bank name is required."));
  if (!/^\d{9}$/.test(f.routingNumber.trim())) {
    issues.push(
      blocking(
        "routingNumber",
        f.routingNumber.trim()
          ? `Routing number needs 9 digits. You entered ${f.routingNumber.trim().length}.`
          : "Routing number is required.",
        "e.g. 071000013"
      )
    );
  }
  if (!f.accountNumber.trim()) issues.push(blocking("accountNumber", "Account number is required.", "e.g. 0001234567"));
  if (!f.accountType) issues.push(blocking("accountType", "Choose checking or savings."));
  return issues;
}

export function validateEligibility(f: EligibilityFields): Issue[] {
  const issues: Issue[] = [];
  if (!f.legalName.trim()) issues.push(blocking("legalName", "Legal name is required."));
  if (!f.street.trim() || !f.city.trim() || !f.state.trim() || !f.zip.trim()) {
    issues.push(blocking("address", "Full address is required."));
  }
  if (!f.dob.trim()) issues.push(blocking("dob", "Date of birth is required."));
  if (!f.citizenshipStatus) issues.push(blocking("citizenshipStatus", "Choose a citizenship status."));
  if (!f.signatureName.trim()) issues.push(blocking("signatureName", "Type your name to sign."));
  if (!f.confirmed) issues.push(blocking("confirmed", "Confirm this is accurate before continuing."));
  return issues;
}

export function validateBenefits(f: BenefitsFields): Issue[] {
  const issues: Issue[] = [];
  if (!f.medical) issues.push(blocking("medical", "Choose medical coverage, waive it, or decide later."));
  if (!f.dentalVision) issues.push(blocking("dentalVision", "Choose dental/vision coverage, waive it, or decide later."));
  if (!f.retirement401k) issues.push(blocking("retirement401k", "Choose 401k enrollment, waive it, or decide later."));
  return issues;
}

export function validatePolicies(f: PoliciesFields, totalDocs: number): Issue[] {
  const issues: Issue[] = [];
  if (f.readIds.length < totalDocs) issues.push(blocking("readIds", "Open and acknowledge each document."));
  if (!f.acknowledged) issues.push(blocking("acknowledged", "Acknowledge the policies to continue."));
  return issues;
}

export function validateStep(stepId: StepId, forms: OnboardingFormData): Issue[] {
  switch (stepId) {
    case "personal":
      return validatePersonal(forms.personal);
    case "tax":
      return validateTax(forms.tax);
    case "deposit":
      return validateDeposit(forms.deposit);
    case "eligibility":
      return validateEligibility(forms.eligibility);
    case "benefits":
      return validateBenefits(forms.benefits);
    case "policies":
      return validatePolicies(forms.policies, 4);
  }
}

function stepTouched(stepId: StepId, forms: OnboardingFormData): { touched: boolean; attempted: boolean } {
  const f = forms[stepId];
  return { touched: f.touched, attempted: f.attempted };
}

// `needs_attention` only fires once the person has tried to move on — simply
// typing into a field with an empty required sibling shouldn't flash an error
// state before they've finished filling it in.
export function computeStatus(issues: Issue[], touched: boolean, attempted: boolean): StepStatus {
  const hasBlocking = issues.some((i) => i.severity === "blocking");
  if (!hasBlocking) return "done";
  if (!touched) return "not_started";
  return attempted ? "needs_attention" : "in_progress";
}

export function buildStep(stepId: StepId, forms: OnboardingFormData): Step {
  const issues = validateStep(stepId, forms);
  const { touched, attempted } = stepTouched(stepId, forms);
  return {
    id: stepId,
    title: STEP_META[stepId].title,
    minutes: STEP_META[stepId].minutes,
    status: computeStatus(issues, touched, attempted),
    issues,
  };
}

export function buildAllSteps(forms: OnboardingFormData): Record<StepId, Step> {
  return STEP_ORDER.reduce(
    (acc, id) => {
      acc[id] = buildStep(id, forms);
      return acc;
    },
    {} as Record<StepId, Step>
  );
}

export function progressCount(steps: Record<StepId, Step>): { done: number; total: number } {
  const total = STEP_ORDER.length;
  const done = STEP_ORDER.filter((id) => steps[id].status === "done").length;
  return { done, total };
}

export function remainingStepTitles(steps: Record<StepId, Step>): string[] {
  return STEP_ORDER.filter((id) => steps[id].status !== "done").map((id) => STEP_META[id].title);
}

export function issueFor(issues: Issue[], fieldId: string): Issue | undefined {
  return issues.find((i) => i.fieldId === fieldId);
}

export function firstIncompleteStep(steps: Record<StepId, Step>): StepId {
  return STEP_ORDER.find((id) => steps[id].status !== "done") ?? STEP_ORDER[0];
}
