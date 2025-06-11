"use client";

import {
  User,
  Truck,
  CreditCard,
  ListChecks,
  ChevronRight,
  Check,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

type Step = {
  icon: React.ElementType;
  label: string;
};

interface StepsProps {
  steps: Step[];
  activeStep: number;
  onStepChange: (step: number) => void;
}

export function Steps({ steps, activeStep, onStepChange }: StepsProps) {
  return (
    <div className="mx-auto my-10 w-fit">
      <div className="bg-muted flex items-center gap-1 rounded-lg p-0.5">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-1">
            <Button
              variant={index === activeStep ? "outline" : "ghost"}
              size={index === activeStep ? "default" : "icon"}
              className={`flex items-center gap-2 ${
                index === activeStep
                  ? "hover:bg-background hover:text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onStepChange(index)}
            >
              {index < activeStep ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                React.createElement(step.icon, { className: "w-4 h-4" })
              )}
              {index === activeStep && `${index + 1}. ${step.label}`}
            </Button>
            {index < steps.length - 1 && (
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Button9() {
  const steps: Step[] = [
    { icon: User, label: "Details" },
    { icon: Truck, label: "Delivery" },
    { icon: CreditCard, label: "Payment" },
    { icon: ListChecks, label: "Overview" },
  ];

  const [activeStep, setActiveStep] = React.useState(1);

  return (
    <Steps steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
  );
}
