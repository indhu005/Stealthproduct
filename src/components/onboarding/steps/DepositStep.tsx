import type { DepositFields, Issue } from "@/lib/onboarding/types";
import { issueFor } from "@/lib/onboarding/derive";
import { SelectField, TextField, CheckboxField } from "@/components/onboarding/Field";
import { AiCard, Banner } from "@/components/onboarding/ui";

// Sensitive step: routing/account numbers are never read by the AI help
// panel (see ai.ts's SafeReviewInput) — this component's "Not sure?" links
// only ever open the generic field-meaning explanation, never anything
// derived from what the person typed.
export function DepositStep({
  fields,
  issues,
  onChange,
  onNotSure,
}: {
  fields: DepositFields;
  issues: Issue[];
  onChange: (patch: Partial<DepositFields>) => void;
  onNotSure: (fieldId: string) => void;
}) {
  const f = (id: string) => issueFor(issues, id);

  if (fields.noBankAccount) {
    return (
      <>
        <Banner tone="neutral" className="mb-4">
          These are illustrative examples in this concept, not live options.
        </Banner>
        <div className="mb-4 flex flex-col gap-2">
          {["Paper check, mailed to your home address", "Pay card, issued by Acme Studio's payroll provider"].map((opt) => (
            <div key={opt} className="rounded-lg border border-border p-3 text-[13px] text-text">
              {opt}
            </div>
          ))}
        </div>
        <CheckboxField
          label="I understand these are concept examples and will choose a real option with HR."
          checked={fields.altOptionAcknowledged}
          onChange={(v) => onChange({ altOptionAcknowledged: v })}
          issue={f("altOptionAcknowledged")}
        />
        <button
          onClick={() => onChange({ noBankAccount: false })}
          className="text-[12.5px] font-semibold text-accent-ink hover:underline"
        >
          I have a bank account after all
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() =>
          onChange({
            bankName: "Lone Star Credit Union",
            routingNumber: "071000013",
            accountNumber: "0001234567",
            accountType: "checking",
          })
        }
        className="mb-4 self-start rounded-md border border-dashed border-accent-soft-border px-2 py-1 text-[11px] font-semibold text-accent-ink"
      >
        Demo: autofill
      </button>

      <AiCard
        prompt="Need help finding your routing number? I can show where it is on a check. I never see the numbers you type."
        ctaLabel="Show me where"
        caption="I explain and give examples. I never choose for you."
        onClick={() => onNotSure("routingNumber")}
      />

      <TextField label="Account holder name" value={fields.accountHolderName} onChange={() => {}} readOnly />
      <TextField label="Bank name" value={fields.bankName} onChange={(v) => onChange({ bankName: v })} issue={f("bankName")} />
      <TextField
        label="Routing number"
        value={fields.routingNumber}
        onChange={(v) => onChange({ routingNumber: v.replace(/\D/g, "").slice(0, 9) })}
        issue={f("routingNumber")}
        helper="9 digits."
        placeholder="071000013"
        onNotSure={() => onNotSure("routingNumber")}
      />
      <TextField
        label="Account number"
        value={fields.accountNumber}
        onChange={(v) => onChange({ accountNumber: v.replace(/\D/g, "") })}
        issue={f("accountNumber")}
        placeholder="0001234567"
      />
      <SelectField
        label="Account type"
        value={fields.accountType}
        onChange={(v) => onChange({ accountType: v as DepositFields["accountType"] })}
        issue={f("accountType")}
        onNotSure={() => onNotSure("accountType")}
        options={[
          { value: "checking", label: "Checking" },
          { value: "savings", label: "Savings" },
        ]}
      />
      <button
        onClick={() => onChange({ noBankAccount: true })}
        className="text-[12.5px] font-semibold text-accent-ink hover:underline"
      >
        I don&rsquo;t have a bank account
      </button>
    </>
  );
}
