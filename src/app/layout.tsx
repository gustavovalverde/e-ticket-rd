import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, useLocale } from "next-intl";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeProvider } from "@/components/theme-provider";

import type { Metadata } from "next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Ticket Dominican Republic",
  description: "Dominican Republic E-Ticket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-end p-1.5">
                <LanguageToggle />
              </div>
              {children}
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
