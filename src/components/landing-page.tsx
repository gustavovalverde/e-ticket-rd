"use client";

import { Upload, FileKey, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { messages } from "../i18n/messages";

export function LandingPage() {
  const router = useRouter();
  const t = useTranslations();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [flightNumber, setFlightNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");

  const handleImportData = async () => {
    if (!selectedFile || !flightNumber.trim() || !passportNumber.trim()) {
      setImportError(t(messages.SYSTEM_MESSAGES.SELECT_TICKET_BACKUP));
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      // Read the file
      const fileText = await selectedFile.text();
      const importData = JSON.parse(fileText);

      // Validate that it's an exported e-ticket file
      if (!importData.exported || !importData.encryptedData) {
        throw new Error(
          "Invalid e-ticket backup file. Please select a file exported from this system."
        );
      }

      // Call decryption API
      const response = await fetch("/api/decrypt-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedData: importData.encryptedData,
          iv: importData.iv,
          salt: importData.salt,
          authTag: importData.authTag,
          flightNumber: flightNumber.trim(),
          passportNumber: passportNumber.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to decrypt data");
      }

      const { data } = await response.json();

      // Encode data in URL parameter (more secure than localStorage)
      const encodedData = btoa(JSON.stringify(data.formData));

      // Navigate to form with encoded data (auto-clears on navigation)
      router.push(`/form?import=${encodeURIComponent(encodedData)}`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setImportError(
          "Invalid file format. Please select a valid e-ticket backup file."
        );
      } else {
        setImportError(
          error instanceof Error ? error.message : "Failed to import data"
        );
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-primary section-padding-y min-h-screen">
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Dominican Republic E-Ticket System"
              width={250}
              height={250}
              priority
              className="object-contain"
            />
          </div>

          {/* Title Section */}
          <div className="section-title-gap-lg flex flex-col">
            <h1 className="heading-xl text-primary-foreground">
              {t(messages.LANDING_PAGE.DOMINICAN_REPUBLIC)}
              <br />
              {t(messages.LANDING_PAGE.E_TICKET_SYSTEM)}
            </h1>
            <p className="text-primary-foreground/90 text-lg font-medium">
              {t(messages.LANDING_PAGE.ELECTRONIC_ENTRY_MIGRATION_CONTROL)}
            </p>
          </div>

          {/* Welcome Section */}
          <div className="section-title-gap-md flex max-w-2xl flex-col">
            <h2 className="heading-md text-primary-foreground">
              {t(messages.LANDING_PAGE.WELCOME)}
            </h2>
            <p className="text-primary-foreground/85 text-lg leading-relaxed">
              {t(messages.LANDING_PAGE.WELCOME_DESCRIPTION)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full max-w-md flex-col gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full py-6 text-lg font-semibold shadow-lg transition-shadow hover:shadow-xl"
              asChild
            >
              <Link href="/form">
                {t(messages.LANDING_PAGE.NEW_ETICKET_APPLICATION)}
              </Link>
            </Button>

            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-accent/10 border-accent/30 text-primary-foreground hover:bg-accent/20 hover:border-accent/50 w-full py-6 text-lg font-semibold shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {t(messages.LANDING_PAGE.IMPORT_PREVIOUS_ETICKET)}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <FileKey className="text-primary h-5 w-5" />
                    Import Previous E-Ticket
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Upload your encrypted e-ticket backup file and enter the
                    same flight number and passport number used when exporting
                    to restore your application data securely.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="import-file">E-Ticket Backup File</Label>
                    <FileInput
                      onFileChange={setSelectedFile}
                      accept=".json"
                      maxSize={5 * 1024 * 1024} // 5MB
                      placeholder="Select your e-ticket backup file"
                      disabled={isImporting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="import-flight">Flight Number</Label>
                    <Input
                      id="import-flight"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder="e.g., AA1234"
                      disabled={isImporting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="import-passport">Passport Number</Label>
                    <Input
                      id="import-passport"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="Enter passport number"
                      disabled={isImporting}
                    />
                  </div>

                  {importError && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{importError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleImportData}
                      disabled={
                        isImporting ||
                        !selectedFile ||
                        !flightNumber.trim() ||
                        !passportNumber.trim()
                      }
                      className="flex-1"
                    >
                      {isImporting ? "Importing..." : "Import & Continue"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsImportOpen(false)}
                      disabled={isImporting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
