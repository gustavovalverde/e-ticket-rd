"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingPage() {
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
              Dominican Republic
              <br />
              E-Ticket System
            </h1>
            <p className="text-primary-foreground/80 text-lg font-medium">
              Electronic Entry/Exit Form for Migration Control
            </p>
          </div>

          {/* Welcome Section */}
          <div className="section-title-gap-md flex max-w-2xl flex-col">
            <h2 className="heading-md text-primary-foreground">Welcome</h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              Complete your electronic entry or exit form for the Dominican
              Republic. This digital form replaces the traditional paper-based
              process for a faster and more efficient migration experience.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full max-w-md flex-col gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full py-6 text-lg font-semibold"
              asChild
            >
              <Link href="/form">E-Ticket Application</Link>
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="w-full py-6 text-lg font-semibold"
              asChild
            >
              <Link href="#">Consult E-Ticket</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
