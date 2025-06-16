import type { ApplicationData } from "@/lib/schemas/forms";
import type { AnyFieldApi } from "@tanstack/react-form";

/**
 * Pragmatic TanStack Form Types
 *
 * TanStack Form requires 9-19 generic type parameters for full typing,
 * making it impractical for real-world usage. We use a pragmatic approach
 * that provides type safety where it matters most while maintaining
 * developer productivity.
 */

// Form instance - use any with proper documentation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppFormApi = any;

// Field API - TanStack Form recommends AnyFieldApi for practical usage
export type AppFieldApi = AnyFieldApi;

// Form state selector with proper typing for our data
export type FormStateSelector<T> = (state: { values: ApplicationData }) => T;

// Component prop types
export interface FormComponentProps {
  form: AppFormApi;
  fieldPrefix?: string;
  travelerIndex?: number;
  showResidencyStatus?: boolean;
  showHeader?: boolean;
}

// Step identifiers for consistent ID generation across components
export const FORM_STEP_IDS = {
  CONTACT_INFO: "contact-info",
  FLIGHT_INFO: "flight-info",
  TRAVEL_COMPANIONS: "travel-companions",
  GENERAL_INFO: "general-info",
  ALL_TRAVELERS: "all-travelers",
  CUSTOMS_DECLARATION: "customs-declaration",
  UNKNOWN: "unknown", // Fallback for components without step context
} as const;

export type FormStepId = (typeof FORM_STEP_IDS)[keyof typeof FORM_STEP_IDS];

// Enhanced form step props with step context
export interface FormStepProps {
  form: AppFormApi;
  onNext?: () => void;
  onPrevious?: () => void;
  stepId?: FormStepId; // Step context for unique ID generation
}
