// Use TanStack Form's natural typing - let it handle the complexity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppFormInstance = any;

// Form component interfaces for each step
export interface TripTypeFormProps {
  form: AppFormInstance;
}

export interface TravellerInfoFormProps {
  form: AppFormInstance;
}

export interface PassportDetailsFormProps {
  form: AppFormInstance;
}

export interface FlightInfoFormProps {
  form: AppFormInstance;
}

export interface ReviewFormProps {
  form: AppFormInstance;
  onSubmit: () => void;
}
