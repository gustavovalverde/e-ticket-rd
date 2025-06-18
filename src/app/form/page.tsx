import { FormContainer } from "@/components/forms/eticket-form-container";

import type { ApplicationData } from "@/lib/schemas/forms";
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

interface FormPageProps {
  searchParams: Promise<{ import?: string }>;
}

export default async function FormPage({ searchParams }: FormPageProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;

  // Decode imported data from URL parameter (server-side)
  let importedData: Partial<ApplicationData> | undefined;

  if (params.import) {
    try {
      const decodedData = atob(decodeURIComponent(params.import));
      importedData = JSON.parse(decodedData);
    } catch (error) {
      // Invalid data in URL - ignore silently
      // eslint-disable-next-line no-console
      console.warn("Invalid import data in URL:", error);
    }
  }

  return (
    <FormContainer
      initialData={importedData}
      config={{
        showApplicationCode: true,
        enableDraftRecovery: !importedData, // Disable draft recovery for imports
      }}
    />
  );
}
