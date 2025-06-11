"use client";

import { ArrowUpRight } from "lucide-react";

import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Button } from "@/components/ui/button";

const faqItems = [
  {
    question: "Will my form be lost like in the old system?",
    answer:
      "No! Our new system automatically saves your progress every few seconds. You can close your browser and return later to complete your application. We've eliminated the 'lost form' problem completely.",
  },
  {
    question: "Does this work on mobile devices and all browsers?",
    answer:
      "Yes! Our mobile-first design works perfectly on all smartphones, tablets, and computers. Compatible with Chrome, Safari, Firefox, Edge, and all modern browsers. No more browser compatibility issues.",
  },
  {
    question: "How long does it take to complete the e-ticket?",
    answer:
      "The new system takes under 10 minutes to complete (down from 15+ minutes in the old system). Smart forms only ask relevant questions based on your travel purpose, significantly reducing completion time.",
  },
  {
    question: "Will I actually receive my QR code confirmation?",
    answer:
      "Absolutely! You'll receive immediate on-screen confirmation plus email with your QR code within minutes. We've fixed the email delivery issues and provide multiple ways to access your e-ticket.",
  },
  {
    question: "Can I apply for my family/group together?",
    answer:
      "Yes! Our new group application feature lets you apply for multiple travelers at once. Shared information (like address and flight details) only needs to be entered once, saving significant time.",
  },
  {
    question: "Is this the official Dominican Republic e-ticket site?",
    answer:
      "Yes, this is the official government e-ticket system. Beware of third-party scam sites that charge fees - the official e-ticket is completely free. Always verify you're on the official government domain.",
  },
];

export function FaqSection3() {
  return (
    <section
      className="bg-background section-padding-y"
      aria-labelledby="faq-heading"
    >
      <div className="container-padding-x container mx-auto">
        <div className="flex w-full flex-col gap-12 md:gap-16">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            {/* Header Content */}
            <div className="section-title-gap-lg flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
              {/* Category Tag */}
              <Tagline>E-Ticket Help</Tagline>
              {/* Main Title */}
              <h1 id="faq-heading" className="heading-lg text-foreground">
                Frequently asked questions
              </h1>
              {/* Section Description */}
              <p className="text-muted-foreground">
                Common questions about the new Dominican Republic e-ticket
                system. We&apos;ve addressed all the major issues from the
                previous system.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 md:flex-row">
              <Button variant="outline" aria-label="Contact migration support">
                Contact Support
                <ArrowUpRight />
              </Button>
              <Button variant="outline" aria-label="View e-ticket guide">
                View Guide
                <ArrowUpRight />
              </Button>
            </div>
          </div>

          {/* FAQ Grid */}
          <div
            className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2"
            role="list"
          >
            {faqItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-2" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold">
                  {item.question}
                </h3>
                <p className="text-muted-foreground text-base">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
