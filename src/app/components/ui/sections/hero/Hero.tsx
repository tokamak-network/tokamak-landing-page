import { LINKS } from "@/app/constants/links";

export const HeroSection = () => {
  return (
    <div className="relative w-[944px] h-[313px] text-[75px] text-[#1c1c1c] text-center max-md:text-4xl max-md:leading-10 flex flex-col items-center">
      <div className="w-full flex flex-col text-[75px] leading-[80px] mb-[30px]">
        <span className="font-bold">L2 ON-DEMAND</span>
        <span>ETHEREUM PLATFORM</span>
      </div>
      <span className="w-full text-[18px] mb-[60px]">
        Tokamak Network offers customized L2 networks & simple way to deploy
        your own L2 based on your needs
      </span>
      <a
        href={LINKS.ROLLUP_HUB}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[205px] h-[53px] bg-tokamak-blue text-white text-[14px] font-bold rounded-[26px] vertical-center leading-[53px]"
      >
        START BUILDING
      </a>
    </div>
  );
};
