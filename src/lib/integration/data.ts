import type { IntegrationState } from "./types";

export const COMPANY = "Northwind Logistics";
export const INTEGRATION_ADMIN = "Maya Okafor";
export const INTEGRATION_ADMIN_EMAIL = "maya@northwind.example";
export const PAYROLL_ADMIN = "Sam Lee";
export const EMPLOYEE_COUNT = 1240;
export const NEXT_PAYROLL = "Fri, Nov 13";
export const SYSTEM_NAME = "Example ERP";

export const initialIntegrationState: IntegrationState = {
  stage: "pilot",
  entities: [
    { id: "us", name: "US", included: true },
    { id: "ca", name: "Canada", included: true },
    { id: "uk", name: "UK", included: true },
  ],
  mappings: [],
  test: {
    checked: 1240,
    issues: [
      { recordId: "E-1042", person: "Daniel Reyes", reason: "State of residence is missing in your system", blocksPayroll: true, retryCount: 0 },
      { recordId: "E-0877", person: "Amara Singh", reason: "Work location is missing", blocksPayroll: true, retryCount: 0 },
      { recordId: "E-1190", person: "Tom Becker", reason: "Pay group is not assigned", blocksPayroll: true, retryCount: 0 },
      { recordId: "E-0412", person: "Lena Fischer", reason: "Phone number format not recognised", blocksPayroll: false, retryCount: 0 },
      { recordId: "E-0653", person: "Marcus Bell", reason: "Job title is longer than 60 characters", blocksPayroll: false, retryCount: 0 },
      { recordId: "E-0990", person: "Sofia Rossi", reason: "Hire date is after today", blocksPayroll: false, retryCount: 0 },
      { recordId: "E-1121", person: "Ken Watanabe", reason: "Manager ID not found", blocksPayroll: false, retryCount: 0 },
      { recordId: "E-0744", person: "Priya Nair", reason: "Email domain doesn't match company domain", blocksPayroll: false, retryCount: 0 },
      { recordId: "E-0528", person: "Chris Park", reason: "Middle name truncated at 20 characters", blocksPayroll: false, retryCount: 0 },
    ],
  },
  pilotSize: 50,
  approver: PAYROLL_ADMIN,
  lastSyncAt: "6 min ago",
  webhooks: [
    { event: "employee.synced", enabled: true, lastDelivery: "ok" },
    { event: "sync.failed", enabled: true, lastDelivery: "ok" },
    { event: "payroll.run.approved", enabled: true, lastDelivery: "retrying" },
  ],
  auditRetentionMonths: 24,
  activity: [
    { id: "a3", when: "Today", text: "Test sync run: 1,240 checked" },
    { id: "a2", when: "Today", text: `Sandbox connected by ${INTEGRATION_ADMIN}` },
    { id: "a1", when: "Today", text: `Pilot started: 50 employees (Austin office), approved by ${PAYROLL_ADMIN}` },
  ],
  duplicateResolved: false,
  recordsSyncedToday: 50,
  failuresToday: 1,
};
