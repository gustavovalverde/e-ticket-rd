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

// Step component props
export interface FormStepProps {
  form: AppFormApi;
  onNext: () => void;
  onPrevious: () => void;
}
