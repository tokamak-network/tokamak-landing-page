import { LINKS } from "@/app/constants/links";
import ArrowIcon from "@/assets/icons/common/arrow.svg";
import Image from "next/image";

export default function GetInvolve() {
  return (
    <div className="flex flex-col items-center gap-y-[30px]">
      <div className="flex flex-col items-center gap-y-[6px]">
        <h1 className="text-[30px] h-[37px] leading-[30px] font-[100]">
          Want to get <span className="font-[600] ">involved?</span>
        </h1>{" "}
        <h2 className="text-[#808992] text-[16px] font-[400]">
          Work with Tokamak Network team
        </h2>
      </div>
      <a
        href={LINKS.ONBOARDING}
        target="_blank"
        rel="noopener noreferrer"
        role="button"
        tabIndex={0}
        className="flex w-[200px] bg-[#0078FF] h-[53px] gap-x-[9px] justify-center items-center px-8 text-[14px] text-center text-white whitespace-nowrap rounded-[26.5px] "
      >
        <div className="self-stretch my-auto tracking-[2.8px] font-[500]">
          Onboarding
        </div>
        <Image loading="lazy" src={ArrowIcon} alt="" />
      </a>
    </div>
  );
}
