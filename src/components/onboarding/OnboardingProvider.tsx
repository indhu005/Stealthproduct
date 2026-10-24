"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import type { OnboardingFormData, OnboardingState, StepId } from "@/lib/onboarding/types";
import { buildAllSteps } from "@/lib/onboarding/derive";
import { initialFormData } from "@/lib/onboarding/data";

const STORAGE_KEY = "bolto-onboarding-v1";

function makeInitialState(forms: OnboardingFormData): OnboardingState {
  return {
    accountStatus: "active",
    steps: buildAllSteps(forms),
    forms,
    helpOpen: false,
    helpContext: undefined,
    tourSeen: false,
    tourOpen: false,
    savedAt: undefined,
    dismissedSuggestions: [],
  };
}

type Action =
  | { type: "hydrate"; state: OnboardingState }
  | { type: "setAccountStatus"; status: OnboardingState["accountStatus"] }
  | { type: "updateField"; stepId: StepId; patch: Record<string, unknown> }
  | { type: "attemptStep"; stepId: StepId }
  | { type: "openHelp"; context?: { stepId?: StepId; fieldId?: string } }
  | { type: "closeHelp" }
  | { type: "setTourOpen"; open: boolean }
  | { type: "markTourSeen" }
  | { type: "dismissSuggestion"; id: string }
  | { type: "resetDemo" };

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "setAccountStatus":
      return { ...state, accountStatus: action.status };
    case "updateField": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stepForms: any = { ...(state.forms[action.stepId] as any), ...action.patch, touched: true };
      const forms = { ...state.forms, [action.stepId]: stepForms };
      return { ...state, forms, steps: buildAllSteps(forms), savedAt: new Date().toISOString() };
    }
    case "attemptStep": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stepForms: any = { ...(state.forms[action.stepId] as any), touched: true, attempted: true };
      const forms = { ...state.forms, [action.stepId]: stepForms };
      return { ...state, forms, steps: buildAllSteps(forms), savedAt: new Date().toISOString() };
    }
    case "openHelp":
      return { ...state, helpOpen: true, helpContext: action.context };
    case "closeHelp":
      return { ...state, helpOpen: false };
    case "setTourOpen":
      return { ...state, tourOpen: action.open };
    case "markTourSeen":
      return { ...state, tourSeen: true, tourOpen: false };
    case "dismissSuggestion":
      return { ...state, dismissedSuggestions: [...state.dismissedSuggestions, action.id] };
    case "resetDemo":
      return makeInitialState(initialFormData);
    default:
      return state;
  }
}

interface Ctx {
  state: OnboardingState;
  updateField: (stepId: StepId, patch: Record<string, unknown>) => void;
  attemptStep: (stepId: StepId) => void;
  setAccountStatus: (status: OnboardingState["accountStatus"]) => void;
  openHelp: (context?: { stepId?: StepId; fieldId?: string }) => void;
  closeHelp: () => void;
  setTourOpen: (open: boolean) => void;
  markTourSeen: () => void;
  dismissSuggestion: (id: string) => void;
  resetDemo: () => void;
}

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialFormData, makeInitialState);

  // Load any in-progress save on mount — the concept's stand-in for "continue
  // later on another device," per the spec's edge cases (section 7). A real
  // backend would key this by account instead of the browser's storage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) as OnboardingState });
    } catch {
      // Corrupt or unavailable storage — fall back to the fresh initial state.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — the in-memory state still works for this session.
    }
  }, [state]);

  const updateField = useCallback((stepId: StepId, patch: Record<string, unknown>) => {
    dispatch({ type: "updateField", stepId, patch });
  }, []);
  const attemptStep = useCallback((stepId: StepId) => dispatch({ type: "attemptStep", stepId }), []);
  const setAccountStatus = useCallback((status: OnboardingState["accountStatus"]) => dispatch({ type: "setAccountStatus", status }), []);
  const openHelp = useCallback((context?: { stepId?: StepId; fieldId?: string }) => dispatch({ type: "openHelp", context }), []);
  const closeHelp = useCallback(() => dispatch({ type: "closeHelp" }), []);
  const setTourOpen = useCallback((open: boolean) => dispatch({ type: "setTourOpen", open }), []);
  const markTourSeen = useCallback(() => dispatch({ type: "markTourSeen" }), []);
  const dismissSuggestion = useCallback((id: string) => dispatch({ type: "dismissSuggestion", id }), []);
  const resetDemo = useCallback(() => dispatch({ type: "resetDemo" }), []);

  const value = useMemo(
    () => ({ state, updateField, attemptStep, setAccountStatus, openHelp, closeHelp, setTourOpen, markTourSeen, dismissSuggestion, resetDemo }),
    [state, updateField, attemptStep, setAccountStatus, openHelp, closeHelp, setTourOpen, markTourSeen, dismissSuggestion, resetDemo]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
