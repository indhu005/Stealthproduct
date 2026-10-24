import type { Issue, PersonalFields } from "@/lib/onboarding/types";
import { issueFor } from "@/lib/onboarding/derive";
import { TextField } from "@/components/onboarding/Field";
import { DemoAutofillButton } from "@/components/onboarding/ui";

export function PersonalStep({
  fields,
  issues,
  onChange,
  onNotSure,
}: {
  fields: PersonalFields;
  issues: Issue[];
  onChange: (patch: Partial<PersonalFields>) => void;
  onNotSure: (fieldId: string) => void;
}) {
  const f = (id: string) => issueFor(issues, id);
  return (
    <>
      <DemoAutofillButton
        onClick={() =>
          onChange({
            legalName: "Jordan Rivera",
            preferredName: "Jordan",
            dob: "04/12/1996",
            street: "214 Congress Ave",
            city: "Austin",
            state: "TX",
            zip: "78701",
            phone: "(512) 555-0142",
            emergencyContactName: "Alex Rivera",
          })
        }
      />

      <TextField label="Legal name" value={fields.legalName} onChange={(v) => onChange({ legalName: v })} issue={f("legalName")} />
      <TextField
        label="Preferred name"
        value={fields.preferredName}
        onChange={(v) => onChange({ preferredName: v })}
        helper="Optional — what we'll call you day to day."
      />
      <TextField label="Date of birth" value={fields.dob} onChange={(v) => onChange({ dob: v })} issue={f("dob")} placeholder="MM/DD/YYYY" />
      <TextField label="Street address" value={fields.street} onChange={(v) => onChange({ street: v })} issue={f("street")} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="City" value={fields.city} onChange={(v) => onChange({ city: v })} issue={f("city")} />
        <TextField label="State" value={fields.state} onChange={(v) => onChange({ state: v.toUpperCase().slice(0, 2) })} issue={f("state")} />
      </div>
      <TextField label="ZIP code" value={fields.zip} onChange={(v) => onChange({ zip: v })} issue={f("zip")} placeholder="78701" />
      <TextField label="Phone" value={fields.phone} onChange={(v) => onChange({ phone: v })} issue={f("phone")} placeholder="(512) 555-0100" />
      <TextField
        label="Emergency contact name"
        value={fields.emergencyContactName}
        onChange={(v) => onChange({ emergencyContactName: v })}
        helper="Optional."
        onNotSure={() => onNotSure("emergencyContactName")}
      />
      <TextField
        label="Emergency contact phone"
        value={fields.emergencyContactPhone}
        onChange={(v) => onChange({ emergencyContactPhone: v })}
        issue={f("emergencyContactPhone")}
        helper={f("emergencyContactPhone") ? undefined : "Optional."}
      />
    </>
  );
}
