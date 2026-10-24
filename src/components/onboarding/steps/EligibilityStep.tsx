import type { EligibilityFields, Issue } from "@/lib/onboarding/types";
import { issueFor } from "@/lib/onboarding/derive";
import { SelectField, TextField, CheckboxField } from "@/components/onboarding/Field";
import { Banner } from "@/components/onboarding/ui";

// Sensitive step: SSN, date of birth, and signature are collected here but
// never read by the AI help panel — this screen offers official links and
// Contact HR instead of AI explanations, per spec ("do not give legal guidance").
export function EligibilityStep({
  fields,
  issues,
  onChange,
  onHelp,
}: {
  fields: EligibilityFields;
  issues: Issue[];
  onChange: (patch: Partial<EligibilityFields>) => void;
  onHelp: () => void;
}) {
  const f = (id: string) => issueFor(issues, id);
  return (
    <>
      <Banner tone="neutral" className="mb-4">
        Federal law requires employers to confirm you&rsquo;re authorized to work in the US. Your employer will review your documents
        within 3 business days of your start date.
      </Banner>

      <TextField label="Legal name" value={fields.legalName} onChange={(v) => onChange({ legalName: v })} issue={f("legalName")} />
      <TextField
        label="Other names used"
        value={fields.otherNamesUsed}
        onChange={(v) => onChange({ otherNamesUsed: v })}
        helper="Optional."
      />
      <TextField label="Street address" value={fields.street} onChange={(v) => onChange({ street: v })} issue={f("address")} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="City" value={fields.city} onChange={(v) => onChange({ city: v })} />
        <TextField label="State" value={fields.state} onChange={(v) => onChange({ state: v.toUpperCase().slice(0, 2) })} />
      </div>
      <TextField label="ZIP code" value={fields.zip} onChange={(v) => onChange({ zip: v })} />
      <TextField label="Date of birth" value={fields.dob} onChange={(v) => onChange({ dob: v })} issue={f("dob")} placeholder="MM/DD/YYYY" />
      <SelectField
        label="Citizenship status"
        value={fields.citizenshipStatus}
        onChange={(v) => onChange({ citizenshipStatus: v as EligibilityFields["citizenshipStatus"] })}
        issue={f("citizenshipStatus")}
        options={[
          { value: "citizen", label: "Citizen of the United States" },
          { value: "noncitizen_national", label: "Noncitizen national of the United States" },
          { value: "permanent_resident", label: "Lawful permanent resident" },
          { value: "authorized_alien", label: "Alien authorized to work" },
        ]}
      />
      <TextField label="Social Security number" value={fields.ssn} onChange={(v) => onChange({ ssn: v })} helper="Optional on this screen." placeholder="000-00-0000" />

      <TextField
        label="Typed signature"
        value={fields.signatureName}
        onChange={(v) => onChange({ signatureName: v })}
        issue={f("signatureName")}
        placeholder="Type your full name"
      />
      <CheckboxField
        label="I confirm this is accurate."
        checked={fields.confirmed}
        onChange={(v) => onChange({ confirmed: v })}
        issue={f("confirmed")}
      />

      <button onClick={onHelp} className="text-[12.5px] font-semibold text-accent-ink hover:underline">
        Official instructions &amp; Contact HR
      </button>
    </>
  );
}
