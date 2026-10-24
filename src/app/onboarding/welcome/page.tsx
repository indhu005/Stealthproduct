"use client";

import { useState } from "react";
import Link from "next/link";
import { COMPANY, HR_CONTACT, START_DATE } from "@/lib/onboarding/data";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/onboarding/ui";

export default function WelcomeEmailPage() {
  const [expired, setExpired] = useState(false);

  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-2">
      <div className="mb-4 rounded-full border border-border bg-surface-sunken px-2.5 py-1 text-center text-[10.5px] font-semibold uppercase tracking-wider text-faint">
        Concept &middot; Email preview
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-[11.5px] text-faint">
          From: {COMPANY} &middot; To: jordan.rivera@example.com
        </p>
        <h1 className="mt-2 text-[16px] font-bold leading-snug text-text">Welcome to {COMPANY}: set up your account</h1>

        {expired ? (
          <div className="mt-4">
            <Banner tone="warning">
              <span className="font-semibold">This link has expired.</span> Request a new one and we&rsquo;ll email it to you.
            </Banner>
            <Button className="mt-3 w-full" onClick={() => setExpired(false)}>
              Request a new link
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-3 text-[13.5px] leading-relaxed text-text">
              Hi Jordan, we&rsquo;re excited you&rsquo;re joining on {START_DATE}. Setting up takes about 15 minutes, and you can save and
              come back anytime.
            </p>
            <Link
              href="/onboarding/account"
              className="mt-4 block rounded-xl bg-accent px-4 py-3 text-center text-[13.5px] font-semibold text-white hover:bg-accent-hover"
            >
              Set up my account
            </Link>
            <p className="mt-3 text-[12px] leading-relaxed text-faint">
              Questions? Reply to this email or contact {HR_CONTACT} in HR.
            </p>
          </>
        )}
      </div>

      {!expired && (
        <button onClick={() => setExpired(true)} className="mt-3 self-center text-[11.5px] text-faint underline">
          Demo: show expired-link state
        </button>
      )}
    </div>
  );
}
