import type { AiSuggestion, OnboardingFormData } from "./types";

// --- Field explanations (spec section 6 table) -----------------------------
// Scripted, not model-backed: this is a concept, so "AI" is a lookup table +
// a few consistency checks, not a real call. Kept here so it's obvious at a
// glance exactly what it can and can't say.

interface FieldHelp {
  explain: string;
  example?: string;
}

const FIELD_HELP: Record<string, FieldHelp> = {
  filingStatus: {
    explain: "This tells your employer how much federal tax to hold back from each paycheck.",
    example: "If you're single with no dependents, you'd usually choose Single or Married filing separately.",
  },
  multipleJobs: {
    explain: "Choose yes if you have another job or your spouse works.",
    example: "Two jobs? Select yes. This helps avoid owing tax later.",
  },
  routingNumber: {
    explain: "A 9-digit number that identifies your bank.",
    example: "It's printed at the bottom left of a check. Format: 9 digits.",
  },
  accountType: {
    explain: "Checking is the most common for paychecks.",
  },
  emergencyContactName: {
    explain: "Someone we can reach if there's an emergency.",
    example: "Name, relationship, and a phone number.",
  },
  emergencyContactPhone: {
    explain: "Someone we can reach if there's an emergency.",
    example: "Name, relationship, and a phone number.",
  },
  citizenshipStatus: {
    explain: "This confirms your authorization to work in the US — it doesn't affect your pay or benefits.",
  },
  dependents: {
    explain: "Each dependent you claim reduces the tax withheld from your paycheck.",
  },
  extraWithholding: {
    explain: "An optional flat amount withheld on top of the standard calculation, if you want extra held back.",
  },
};

export function getFieldHelp(fieldId: string): FieldHelp {
  return FIELD_HELP[fieldId] ?? { explain: "I'm not sure about this one. Ask HR." };
}

// --- Review-screen consistency checks ---------------------------------------
// The AI is never given sensitive fields (SSN, routing/account numbers, DOB,
// signature) per spec section 6 — enforced here by only reading a narrow,
// explicitly safe slice of form state rather than the full OnboardingFormData.
interface SafeReviewInput {
  preferredName: string;
  city: string;
  state: string;
  zip: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  benefitsDecidedLater: string[];
}

function toSafeInput(forms: OnboardingFormData): SafeReviewInput {
  const { preferredName, city, state, zip, emergencyContactName, emergencyContactPhone } = forms.personal;
  const benefitsDecidedLater: string[] = [];
  if (forms.benefits.medical === "decide_later") benefitsDecidedLater.push("Medical");
  if (forms.benefits.dentalVision === "decide_later") benefitsDecidedLater.push("Dental/Vision");
  if (forms.benefits.retirement401k === "decide_later") benefitsDecidedLater.push("401k");
  return { preferredName, city, state, zip, emergencyContactName, emergencyContactPhone, benefitsDecidedLater };
}

const TX_ZIP_PREFIXES = ["75", "76", "77", "78", "79", "88"];

export function generateReviewSuggestions(forms: OnboardingFormData): AiSuggestion[] {
  const safe = toSafeInput(forms);
  const suggestions: AiSuggestion[] = [];

  if (safe.emergencyContactName && !safe.emergencyContactPhone) {
    suggestions.push({
      id: "emergency-contact-phone",
      fieldId: "emergencyContactPhone",
      kind: "consistency_check",
      text: `Your emergency contact (${safe.preferredName ? `for ${safe.preferredName}` : "listed"}) has no phone number.`,
      actions: ["edit", "dismiss"],
      sensitive: false,
    });
  }

  if (safe.state === "TX" && TX_ZIP_PREFIXES.includes(safe.zip.slice(0, 2))) {
    suggestions.push({
      id: "zip-state-match",
      fieldId: "zip",
      kind: "consistency_check",
      text: `Your ZIP code (${safe.zip}) matches ${safe.city}, ${safe.state}.`,
      actions: ["dismiss"],
      sensitive: false,
    });
  }

  if (safe.benefitsDecidedLater.length > 0) {
    suggestions.push({
      id: "benefits-decide-later",
      fieldId: "benefits",
      kind: "consistency_check",
      text: `You chose to decide later on ${safe.benefitsDecidedLater.join(", ")}. Remember to choose by Nov 30.`,
      actions: ["dismiss"],
      sensitive: false,
    });
  }

  return suggestions;
}
