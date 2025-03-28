import { LINKS } from "@/app/constants/links";

export const HeroSection = () => {
  return (
    <div className="relative w-[944px] h-[313px] text-[75px] text-[#1c1c1c] text-center max-md:text-4xl max-md:leading-10 flex flex-col items-center z-[40] px-[20px] [@media(max-width:400px)]:px-[10px] ">
      <div className="w-full flex flex-col text-[75px] [@media(max-width:650px)]:text-[40px] leading-[80px] [@media(max-width:650px)]:leading-[normal] mb-[30px]">
        <span className="font-normal">L2 ON-DEMAND</span>
        <span className="font-thin">TAILORED ETHEREUM</span>
      </div>
      <span className="w-full text-[18px] [@media(max-width:650px)]:text-[13px] mb-[60px] leading-[normal] font-light">
        Tokamak Network offers customized L2 networks & simple way to deploy
        your own L2 based on your needs
      </span>
      <a
        href={LINKS.ROLLUP_HUB}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[205px] h-[53px] bg-tokamak-black hover:bg-tokamak-blue text-white text-[14px] [@media(max-width:650px)]:text-[13px] font-bold rounded-[26px] vertical-center leading-[53px]"
      >
        START BUILDING
      </a>
    </div>
  );
};
