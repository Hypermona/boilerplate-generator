"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10" />
      <ol className="relative z-0 flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "border-primary",
                  !isCompleted && !isCurrent && "border-muted bg-background"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isCurrent && "text-primary",
                      !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm font-medium",
                  (isCompleted || isCurrent) && "text-primary",
                  !isCompleted && !isCurrent && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}