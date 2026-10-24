"use client";

import { useState } from "react";
import type { Issue, PoliciesFields } from "@/lib/onboarding/types";
import { POLICY_DOCS } from "@/lib/onboarding/data";
import { issueFor } from "@/lib/onboarding/derive";
import { CheckboxField } from "@/components/onboarding/Field";
import { DemoAutofillButton } from "@/components/onboarding/ui";

export function PoliciesStep({
  fields,
  issues,
  onChange,
}: {
  fields: PoliciesFields;
  issues: Issue[];
  onChange: (patch: Partial<PoliciesFields>) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const readIssue = issueFor(issues, "readIds");

  function toggleRead(id: string) {
    const readIds = fields.readIds.includes(id) ? fields.readIds.filter((x) => x !== id) : [...fields.readIds, id];
    onChange({ readIds });
  }

  return (
    <>
      <DemoAutofillButton
        onClick={() => onChange({ readIds: POLICY_DOCS.map((d) => d.id), acknowledged: true })}
      />

      <div className="mb-4 flex flex-col gap-2">
        {POLICY_DOCS.map((doc) => {
          const read = fields.readIds.includes(doc.id);
          const open = openId === doc.id;
          return (
            <div key={doc.id} className={`rounded-xl border p-3 ${readIssue && !read ? "border-critical" : "border-border"}`}>
              <button onClick={() => setOpenId(open ? null : doc.id)} className="flex w-full items-center justify-between text-left">
                <span className="text-[13.5px] font-semibold text-text">{doc.title}</span>
                <span className="text-[11.5px] font-semibold text-accent-ink">{open ? "Close" : "Open"}</span>
              </button>
              {open && (
                <p className="mt-2 text-[12px] leading-relaxed text-muted">
                  This is a concept placeholder for the {doc.title.toLowerCase()}. In a real product this would open the full document
                  text for review.
                </p>
              )}
              <label className="mt-2 flex items-center gap-2 text-[12px] text-text">
                <input type="checkbox" checked={read} onChange={() => toggleRead(doc.id)} className="h-[16px] w-[16px]" />
                I&rsquo;ve read this
              </label>
            </div>
          );
        })}
      </div>
      {readIssue && <p className="mb-3 text-[12px] font-medium text-critical">{readIssue.message}</p>}

      <CheckboxField
        label="I acknowledge I have read and agree to the policies above."
        checked={fields.acknowledged}
        onChange={(v) => onChange({ acknowledged: v })}
        issue={issueFor(issues, "acknowledged")}
      />
    </>
  );
}
