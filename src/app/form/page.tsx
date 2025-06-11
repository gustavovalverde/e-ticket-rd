import { ApplicationForm } from "@/components/forms/application-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Ticket Application | Dominican Republic",
  description:
    "Complete your electronic ticket application for travel to/from the Dominican Republic",
  keywords: [
    "e-ticket",
    "dominican republic",
    "immigration",
    "travel",
    "application",
  ],
  openGraph: {
    title: "E-Ticket Application | Dominican Republic",
    description:
      "Complete your electronic ticket application for travel to/from the Dominican Republic",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FormPage() {
  return <ApplicationForm />;
}
