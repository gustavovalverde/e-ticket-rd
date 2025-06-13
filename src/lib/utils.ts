import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to safely extract error message from TanStack Form errors
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  // Handle Zod validation errors
  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as {
      issues: Array<{ message: string; path: string[] }>;
    };
    // Return the first error message for simplicity
    return zodError.issues[0]?.message || "Validation error";
  }

  // Handle standard Error objects
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  return "Validation error";
}
