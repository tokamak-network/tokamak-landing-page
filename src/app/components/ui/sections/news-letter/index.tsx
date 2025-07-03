"use client";
import { useFocus } from "@/context/FocusContext";
import { useCallback, useState } from "react";

export default function NewsletterSection() {
  const { isFocused, setIsFocused } = useFocus();
  const [email, setEmail] = useState("");

  const onSubscribe = useCallback(async () => {
    if (!email) return;

    try {
      const response = await fetch("/api/news-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        alert("Successfully subscribed!");
      } else {
        alert("Subscription failed. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
  }, [email]);

  return (
    <div
      className={`w-full h-[300px] ${
        isFocused ? "bg-tokamak-blue" : "bg-[#1C1C1C]"
      } flex justify-center items-center px-[70px]
      min-[500px]:max-[700px]:px-[50px]
      min-[451px]:max-[500px]:px-[30px]
      [@media(max-width:450px)]:px-[15px]`}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <div className="w-full max-w-[1200px] flex justify-center items-center [@media(max-width:800px)]:flex-col gap-y-[30px]">
        {/* Title */}
        <div className="text-left w-full min-w-[390px] [@media(max-width:429px)]:min-w-[310px]">
          <h2 className="text-white text-[24px] md:text-[30px] mb-[9px] font-[100]">
            Newsletter <span className="font-[600]">SUBSCRIPTION</span>
          </h2>
          <p className="text-[15px] text-white font-[100]">
            The quickest way to stay up-to-date with news{" "}
            <br className="min-[429px]:hidden block" /> about
            <br className="min-[430px]:block hidden" /> Tokamak Network
          </p>
        </div>

        {/* Email Input Form */}
        <div className="w-full relative min-w-[330px]">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-6 py-3 h-[65px] rounded-full bg-white text-black outline-none
          placeholder:text-[#1C1C1C] font-[400]
          "
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="absolute right-[6px] top-[6px] w-[157px] h-[53px]  
          bg-black text-white font-[500] rounded-full transition-colors text-[14px]"
            onClick={onSubscribe}
          >
            SUBSCRIBE
          </button>
        </div>
      </div>
    </div>
  );
}
