"use client";

import { useId } from "react";
import type { Issue } from "@/lib/onboarding/types";

interface FieldShellProps {
  label: string;
  helper?: string;
  issue?: Issue;
  onNotSure?: () => void;
  children: (describedBy: string | undefined) => React.ReactNode;
}

function FieldShell({ label, helper, issue, onNotSure, children }: FieldShellProps) {
  const baseId = useId();
  const helperId = helper ? `${baseId}-helper` : undefined;
  const errorId = issue ? `${baseId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="text-[13px] font-semibold text-text">{label}</label>
        {onNotSure && (
          <button type="button" onClick={onNotSure} className="shrink-0 text-[12px] font-semibold text-accent-ink hover:underline">
            Not sure?
          </button>
        )}
      </div>
      {children(describedBy)}
      {helper && !issue && (
        <p id={helperId} className="mt-1 text-[12px] text-faint">
          {helper}
        </p>
      )}
      {issue && (
        <p id={errorId} role={issue.severity === "blocking" ? "alert" : undefined} aria-live="polite" className="mt-1 text-[12px] font-medium text-critical">
          {issue.message}
          {issue.example && <span className="font-normal text-faint"> {issue.example}</span>}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-[14px] text-text placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent";

export function TextField({
  label,
  value,
  onChange,
  helper,
  issue,
  onNotSure,
  placeholder,
  type = "text",
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  issue?: Issue;
  onNotSure?: () => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <FieldShell label={label} helper={helper} issue={issue} onNotSure={onNotSure}>
      {(describedBy) => (
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={issue?.severity === "blocking" ? true : undefined}
          className={`${inputBase} ${issue ? "border-critical" : "border-border"} ${readOnly ? "bg-surface-sunken text-muted" : ""}`}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  helper,
  issue,
  onNotSure,
  placeholder = "Select…",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  helper?: string;
  issue?: Issue;
  onNotSure?: () => void;
  placeholder?: string;
}) {
  return (
    <FieldShell label={label} helper={helper} issue={issue} onNotSure={onNotSure}>
      {(describedBy) => (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
          aria-invalid={issue?.severity === "blocking" ? true : undefined}
          className={`${inputBase} ${issue ? "border-critical" : "border-border"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

export function RadioGroupField({
  label,
  value,
  onChange,
  options,
  helper,
  issue,
  onNotSure,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; blurb?: string }[];
  helper?: string;
  issue?: Issue;
  onNotSure?: () => void;
}) {
  const name = useId();
  return (
    <FieldShell label={label} helper={helper} issue={issue} onNotSure={onNotSure}>
      {() => (
        <div className="flex flex-col gap-2">
          {options.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer flex-col rounded-lg border p-2.5 ${
                value === o.value ? "border-accent bg-accent-soft" : "border-border"
              }`}
            >
              <span className="flex items-center gap-2 text-[13px] font-semibold text-text">
                <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
                {o.label}
              </span>
              {o.blurb && <span className="mt-0.5 pl-5 text-[12px] text-muted">{o.blurb}</span>}
            </label>
          ))}
        </div>
      )}
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  issue,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  issue?: Issue;
}) {
  const baseId = useId();
  const errorId = issue ? `${baseId}-error` : undefined;
  return (
    <div className="mb-4">
      <label className="flex items-start gap-2 text-[13px] text-text">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={errorId}
          aria-invalid={issue?.severity === "blocking" ? true : undefined}
          className="mt-0.5 h-[18px] w-[18px] shrink-0"
        />
        <span>{label}</span>
      </label>
      {issue && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 pl-[26px] text-[12px] font-medium text-critical">
          {issue.message}
        </p>
      )}
    </div>
  );
}
