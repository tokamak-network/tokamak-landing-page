"use client";

import { useCallback, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const THEME = {
  light: {
    heading: "text-[#1C1C1C]",
    subtext: "text-[#808992]",
    input:
      "bg-[#F5F5F5] text-[#1C1C1C] placeholder:text-[#808992] border-transparent focus:border-[#0078FF]",
    button:
      "bg-[#1C1C1C] text-white hover:bg-[#0078FF] transition-colors",
  },
  dark: {
    heading: "text-white",
    subtext: "text-white/50",
    input:
      "bg-white/[0.06] text-white placeholder:text-white/40 border-white/[0.12] focus:border-[#0078FF]",
    button:
      "bg-[#0078FF] text-white hover:bg-[#005ACC] shadow-[0_0_20px_rgba(0,120,255,0.3)] transition-all",
  },
} as const;

interface InlineNewsletterProps {
  readonly variant?: "light" | "dark";
}

export default function InlineNewsletter({ variant = "light" }: InlineNewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState("");
  const theme = THEME[variant];

  const onSubscribe = useCallback(async () => {
    if (!email) return;

    if (!EMAIL_REGEX.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    setValidationError("");
    setStatus("loading");

    try {
      const response = await fetch("/api/news-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [email]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubscribe();
      }
    },
    [onSubscribe]
  );

  return (
    <div className="w-full max-w-[500px]">
      <h3 className={`font-[600] mb-2 text-[14px] ${theme.heading}`}>Newsletter</h3>
      <p className={`text-[12px] mb-3 font-[300] ${theme.subtext}`}>
        Stay up-to-date with Tokamak Network news
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationError) setValidationError("");
          }}
          onKeyDown={handleKeyDown}
          className={`flex-1 px-4 py-2 h-[40px] rounded-full text-[13px] outline-none font-[400] border ${theme.input} transition-colors`}
          disabled={status === "loading"}
        />
        <button
          onClick={onSubscribe}
          disabled={status === "loading"}
          className={`px-5 h-[40px] text-[12px] font-[500] rounded-full disabled:opacity-50 ${theme.button}`}
        >
          {status === "loading" ? "..." : status === "success" ? "Subscribed!" : "SUBSCRIBE"}
        </button>
      </div>
      {validationError && (
        <p className="text-[11px] text-[#cb2431] mt-1">{validationError}</p>
      )}
      {status === "error" && (
        <p className="text-[11px] text-[#cb2431] mt-1">
          Subscription failed. Please try again.
        </p>
      )}
    </div>
  );
}
