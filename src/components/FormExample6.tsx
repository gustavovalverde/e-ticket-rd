"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormExample6() {
  const [agreed, setAgreed] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", { ...data, agreed });
    // Example: alert(`Form submitted with Name: ${data.name}, Email: ${data.email}, Agreed: ${agreed}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Please fill out the form below and we&apos;ll get back to you.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} id="contactFormExample6">
          <CardContent className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Enter your full name" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Input // Using Input as a simple textarea for this example
                id="message"
                name="message"
                placeholder="Your message..."
                className="h-24 resize-none" // Basic styling for a multi-line input
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreed"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                aria-label="Agree to terms and conditions"
              />
              <Label
                htmlFor="agreed"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" form="contactFormExample6">
              Send Message
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
