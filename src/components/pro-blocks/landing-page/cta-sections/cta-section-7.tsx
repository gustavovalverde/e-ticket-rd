"use client";

import { ArrowRight } from "lucide-react";

import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Button } from "@/components/ui/button";

export function CtaSection7() {
  return (
    <section className="bg-background" aria-labelledby="cta-heading">
      <div className="container mx-auto">
        <div className="bg-primary px-6 py-16 sm:rounded-xl md:p-16">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 text-center">
            {/* Section Header */}
            <div className="section-title-gap-lg flex flex-col items-center text-center">
              {/* Category Tag */}
              <Tagline className="text-primary-foreground/80">
                Required for Entry
              </Tagline>
              {/* Main Title */}
              <h2
                id="cta-heading"
                className="text-primary-foreground heading-lg"
              >
                Ready to travel to the Dominican Republic?
              </h2>
            </div>
            {/* CTA Button */}
            <Button
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/80"
              aria-label="Start your e-ticket application now"
            >
              Start Your E-Ticket Now
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
