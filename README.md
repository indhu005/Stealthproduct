# Bolto — Redesign & Flows

An interactive prototype redesigning Bolto's admin dashboard and building out four end-to-end product flows, created as a design-engineering walkthrough. Built in Next.js, deployed on Vercel, meant to be clicked through rather than just viewed as mockups.

**Live:** https://bolto-prototype.vercel.app

## What this is

Bolto's current dashboard (global payroll / HR / EOR product) packs five equal-weight stat tiles, a duplicated roster across three separate sections (Team Directory, Employees, Contractors), and competing calls to action (a full-width "start an AI chat" bar sitting next to a quick-actions list) above the fold. This prototype redesigns that Overview screen and then proves the redesign holds up by building four real flows on top of it — not just the landing screen.

### Redesign decisions
- One hero metric replaces five equal stat tiles — the dashboard leads with what actually needs attention, not a wall of numbers.
- Team Directory / Employees / Contractors merged into a single "People" list — fixes a duplicate-roster problem where the same person showed up in multiple places.
- "Quick actions" and "Tasks" merged into one severity-coded "Needs attention" list, with Approve/Decline visually separated (filled primary vs. quiet ghost button, not two adjacent icons that invite mis-clicks).
- "Start an AI chat" moved out of a competing full-width bar into a labeled "Search or ask AI" sidebar field (⌘K), with a contextual empty-state nudge in the Needs Attention slot when there's nothing urgent.
- Sidebar group labels made visually distinct from nav items, light/dark theme support throughout.

## The four flows

| Flow | Route | What it demonstrates |
|---|---|---|
| **Payroll Blocker** | `/payroll` | Multi-stage flow (Overview → Draft → Review → Record) for resolving a payroll-blocking issue, with a companion "on the employee's phone" mini-flow showing both sides of the interaction. |
| **Time Off Approval** | `/time-off` | Inbox-style approve/decline flow (pending list → review panel → decision), including a negative-PTO-balance edge case with an escape-hatch dialog and decline-reason capture. |
| **Employee Onboarding** | `/onboarding` | Phone-first new-hire flow — checklist, step-by-step forms, scripted "Not sure?" AI help that's built to never read sensitive fields (SSN, bank routing/account, DOB, signature), AI review step, completion tour. |
| **Enterprise Integration** | `/integration` | Admin-side ERP/HRIS sync tool — connect, map fields, test sync, go live, monitor, and resolve a sync error — including rate-limit, expired-access, and connection-failure edge cases. |

Use the pill nav above the device frame on any page (Dashboard / Payroll / Time off / Onboarding / Integration) to jump between flows, or the ⌘K search field in the sidebar.

## Tech

Next.js 16 (App Router, TypeScript), Tailwind v4, no backend — state is local (`useReducer` / React context) or persisted to `localStorage` where a flow needs to survive navigation (onboarding). Design tokens support light/dark via `data-theme` + `prefers-color-scheme`.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
