import { z } from "zod";

// Contact Information Schema
export const contactInfoSchema = z.object({
  preferredName: z.string().optional(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[\d\s\-+()]+$/, {
      message: "Please enter a valid phone number",
    }),
  countryCode: z.string().min(1, { message: "Country code is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  radioOption: z.string().min(1, { message: "Please select an option" }),
});

// Passport Details Schema
export const passportDetailsSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First name must contain only letters",
    }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Last name must contain only letters" }),
  passportNumber: z
    .string()
    .min(6, { message: "Passport number must be at least 6 characters" })
    .max(20, { message: "Passport number must be less than 20 characters" })
    .regex(/^[A-Z0-9]+$/, {
      message:
        "Passport number must contain only uppercase letters and numbers",
    }),
  passportIssueDate: z
    .string()
    .min(1, { message: "Passport issue date is required" }),
  passportExpiryDate: z
    .string()
    .min(1, { message: "Passport expiry date is required" }),
  nationality: z.string().min(1, { message: "Please select your nationality" }),
  countryOfBirth: z
    .string()
    .min(1, { message: "Country of birth is required" }),
  additionalInfo: z.string().optional(),
});

// Combined form schema for both sections
export const eTicketFormSchema = z.object({
  contactInfo: contactInfoSchema,
  passportDetails: passportDetailsSchema,
});

// Types
export type ContactInfoForm = z.infer<typeof contactInfoSchema>;
export type PassportDetailsForm = z.infer<typeof passportDetailsSchema>;
export type ETicketForm = z.infer<typeof eTicketFormSchema>;
