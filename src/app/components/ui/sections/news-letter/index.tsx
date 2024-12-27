"use client";
import { useFocus } from "@/context/FocusContext";
import { handleSubscribe } from "@/app/api/news-letter";
import { useCallback, useState } from "react";

export default function NewsletterSection() {
  const { isFocused, setIsFocused } = useFocus();
  const [email, setEmail] = useState("");

  const onSubscribe = useCallback(async () => {
    if (!email) return;

    try {
      const result = await handleSubscribe(email);
      console.log("result", result);
      if (result.success) {
        alert("Successfully subscribed!");
      } else {
        alert("Subscriptio    n failed. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
  }, [email]);

  return (
    <div
      className={`w-full h-[300px] ${
        isFocused ? "bg-tokamak-blue" : "bg-[#1C1C1C]"
      } flex justify-center items-center px-[25px] [@media(max-width:1000px)]:px-[15px]`}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <div className="w-full max-w-[1200px] flex justify-center items-center [@media(max-width:800px)]:flex-col gap-y-[30px]">
        {/* Title */}
        <div className="text-left w-full min-w-[390px]">
          <h2 className="text-white text-[24px] md:text-[30px] mb-[9px]">
            Newsletter <span className="font-bold">SUBSCRIPTION</span>
          </h2>
          <p className="text-[15px] text-white">
            The quickest way to stay up-to-date with news about <br /> Tokamak
            Network
          </p>
        </div>

        {/* Email Input Form */}
        <div className="w-full relative min-w-[330px]">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-6 py-3 h-[65px] rounded-full bg-white text-black outline-none
          placeholder:text-[#1C1C1C]
          "
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="absolute right-[6px] top-[6px] w-[157px] h-[53px]  
          bg-black text-white font-bold rounded-full transition-colors text-[14px]"
            onClick={onSubscribe}
          >
            SUBSCRIBE
          </button>
        </div>
      </div>
    </div>
  );
}
