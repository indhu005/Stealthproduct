import type { Issue, TaxFields } from "@/lib/onboarding/types";
import { issueFor } from "@/lib/onboarding/derive";
import { RadioGroupField, TextField, CheckboxField } from "@/components/onboarding/Field";
import { Banner } from "@/components/onboarding/ui";

export function TaxStep({
  fields,
  issues,
  onChange,
  onNotSure,
}: {
  fields: TaxFields;
  issues: Issue[];
  onChange: (patch: Partial<TaxFields>) => void;
  onNotSure: (fieldId: string) => void;
}) {
  const f = (id: string) => issueFor(issues, id);
  return (
    <>
      <Banner tone="info" className="mb-4">
        Texas doesn&rsquo;t have a state income tax, so there&rsquo;s no state form for you to complete.
      </Banner>

      <RadioGroupField
        label="Filing status"
        value={fields.filingStatus}
        onChange={(v) => onChange({ filingStatus: v as TaxFields["filingStatus"] })}
        issue={f("filingStatus")}
        onNotSure={() => onNotSure("filingStatus")}
        options={[
          { value: "single_or_mfs", label: "Single or Married filing separately" },
          { value: "married_jointly", label: "Married filing jointly" },
          { value: "head_of_household", label: "Head of household" },
        ]}
      />

      <RadioGroupField
        label="Multiple jobs or a working spouse?"
        value={fields.multipleJobs}
        onChange={(v) => onChange({ multipleJobs: v as TaxFields["multipleJobs"] })}
        issue={f("multipleJobs")}
        onNotSure={() => onNotSure("multipleJobs")}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />

      <TextField
        label="Dependents"
        value={fields.dependents}
        onChange={(v) => onChange({ dependents: v })}
        helper="Optional — each dependent reduces withholding."
        onNotSure={() => onNotSure("dependents")}
      />
      <TextField
        label="Extra withholding"
        value={fields.extraWithholding}
        onChange={(v) => onChange({ extraWithholding: v })}
        helper="Optional — a flat extra amount per paycheck."
        placeholder="$0.00"
        onNotSure={() => onNotSure("extraWithholding")}
      />

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
    </>
  );
}
