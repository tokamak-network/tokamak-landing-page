import TeamGrid from "./TeamGrid";

export default function About() {
  return (
    <div className="w-full h-full mt-[126px] text-[#1C1C1C]">
      <div className="flex justify-center w-full py-[60px] bg-[#1C1C1C]">
        <div className="flex flex-col justify-between items-center h-[64px]  text-white">
          <span className="text-[30px] leading-[25px]">
            We are networking the
            <span className="font-bold"> Layer 2 networks</span>
          </span>
          <span className="text-[15px]">
            Learn more about who we are and what we are building in Tokamak
            Network
          </span>
        </div>
      </div>
      <TeamGrid />
    </div>
  );
}
