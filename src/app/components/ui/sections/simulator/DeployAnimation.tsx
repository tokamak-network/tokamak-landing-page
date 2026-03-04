"use client";

import { useEffect, useState } from "react";

const DEPLOY_STEPS = [
  "Initializing L2 configuration...",
  "Compiling smart contracts...",
  "Generating rollup proofs...",
  "Connecting to Ethereum mainnet...",
  "Deploying sequencer nodes...",
  "Your L2 is ready.",
] as const;

const STEP_DELAY = 600;

export default function DeployAnimation({
  onComplete,
}: {
  readonly onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<readonly number[]>([]);

  useEffect(() => {
    if (currentStep >= DEPLOY_STEPS.length) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, STEP_DELAY);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {DEPLOY_STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = index === currentStep;
        const isFinal = index === DEPLOY_STEPS.length - 1;
        const isVisible = index <= currentStep;

        if (!isVisible) return null;

        return (
          <div
            key={step}
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {isFinal && isCompleted ? (
              <div className="w-5 h-5 rounded-full bg-[#28a745] flex items-center justify-center flex-shrink-0">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : isCompleted ? (
              <div className="w-5 h-5 rounded-full bg-[#0078FF] flex items-center justify-center flex-shrink-0">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : isCurrent ? (
              <div className="w-5 h-5 rounded-full border-2 border-[#0078FF] flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#0078FF] animate-pulse" />
              </div>
            ) : null}
            <span
              className={`text-[14px] font-[400] ${
                isFinal && isCompleted
                  ? "text-[#28a745] font-[600]"
                  : isCompleted
                    ? "text-[#808992]"
                    : "text-white"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
