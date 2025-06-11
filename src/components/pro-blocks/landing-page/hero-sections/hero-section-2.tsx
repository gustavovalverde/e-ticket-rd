"use client";

import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";

import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

export function HeroSection2() {
  return (
    <section
      className="bg-background section-padding-y"
      aria-labelledby="hero-heading"
    >
      <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          {/* Section Title */}
          <div className="section-title-gap-xl flex flex-col">
            {/* Tagline */}
            <Tagline>Dominican Republic Migration Control</Tagline>
            {/* Main Heading */}
            <h1 id="hero-heading" className="heading-xl">
              Complete your E-Ticket in under 10 minutes
            </h1>
            {/* Description */}
            <p className="text-muted-foreground text-base lg:text-lg">
              Modern, secure digital migration form for entry and exit to the
              Dominican Republic. Mobile-optimized experience with real-time
              validation - no more lost forms or browser issues.
            </p>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                Mobile-first design works on any device
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                Automatic form saving - never lose progress
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                Available in multiple languages
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Start E-Ticket Application</Button>
            <Button variant="ghost">
              Check Application Status
              <ArrowRight />
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full flex-1">
          <AspectRatio ratio={1}>
            <Image
              src="/home-ilustration.svg"
              alt="Modern digital e-ticket system illustration"
              fill
              priority
              className="h-full w-full rounded-xl object-contain p-8"
            />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
}
