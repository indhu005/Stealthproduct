import type { BenefitChoice, BenefitsFields, Issue } from "@/lib/onboarding/types";
import { issueFor } from "@/lib/onboarding/derive";
import { DemoAutofillButton } from "@/components/onboarding/ui";

const choiceLabel: Record<BenefitChoice, string> = { enroll: "Enroll", waive: "Waive", decide_later: "Decide later" };

function BenefitCard({
  title,
  blurb,
  value,
  onChange,
  issue,
}: {
  title: string;
  blurb: string;
  value: BenefitChoice | "";
  onChange: (v: BenefitChoice) => void;
  issue?: Issue;
}) {
  return (
    <div className={`mb-3 rounded-xl border p-3 ${issue ? "border-critical" : "border-border"}`}>
      <div className="text-[13.5px] font-semibold text-text">{title}</div>
      <p className="mt-0.5 text-[12px] text-muted">{blurb}</p>
      <div className="mt-2 flex gap-1.5">
        {(["enroll", "waive", "decide_later"] as BenefitChoice[]).map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-[12px] font-semibold ${
              value === c ? "border-accent bg-accent-soft text-accent-ink" : "border-border text-muted"
            }`}
          >
            {choiceLabel[c]}
          </button>
        ))}
      </div>
      {value === "decide_later" && <p className="mt-1.5 text-[11.5px] text-warning">Choose by Nov 30.</p>}
      {issue && <p className="mt-1.5 text-[12px] font-medium text-critical">{issue.message}</p>}
    </div>
  );
}

export function BenefitsStep({
  fields,
  issues,
  onChange,
}: {
  fields: BenefitsFields;
  issues: Issue[];
  onChange: (patch: Partial<BenefitsFields>) => void;
}) {
  const f = (id: string) => issueFor(issues, id);
  return (
    <>
      <DemoAutofillButton onClick={() => onChange({ medical: "enroll", dentalVision: "enroll", retirement401k: "decide_later" })} />

      <BenefitCard
        title="Medical"
        blurb="Covers doctor visits, prescriptions, and hospital care."
        value={fields.medical}
        onChange={(v) => onChange({ medical: v })}
        issue={f("medical")}
      />
      <BenefitCard
        title="Dental / Vision"
        blurb="Covers routine cleanings, eye exams, and glasses or contacts."
        value={fields.dentalVision}
        onChange={(v) => onChange({ dentalVision: v })}
        issue={f("dentalVision")}
      />
      <BenefitCard
        title="401k"
        blurb="Acme Studio matches up to 4% of your contributions."
        value={fields.retirement401k}
        onChange={(v) => onChange({ retirement401k: v })}
        issue={f("retirement401k")}
      />
    </>
  );
}
