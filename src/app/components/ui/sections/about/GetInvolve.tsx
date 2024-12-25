import ArrowIcon from "@/assets/icons/common/arrow.svg";
import Image from "next/image";

export default function GetInvolve() {
  return (
    <div className="flex flex-col items-center gap-y-[30px]">
      <div className="flex flex-col items-center gap-y-[6px]">
        <h1 className="text-[30px] h-[37px] leading-[30px]">
          Want to get <span className="font-bold ">involved?</span>
        </h1>{" "}
        <h2 className="text-[#808992] text-[16px] font-normal">
          Work with Tokamak Network team
        </h2>
      </div>
      <div
        role="button"
        tabIndex={0}
        className="flex w-[200px] bg-[#0078FF] h-[53px] font-bold gap-x-[9px] justify-center items-center px-8 text-[14px] text-center text-white whitespace-nowrap rounded-[26.5px] "
      >
        <div className="self-stretch my-auto tracking-[2.8px]">Onboarding</div>
        <Image loading="lazy" src={ArrowIcon} alt="" />
      </div>
    </div>
  );
}
