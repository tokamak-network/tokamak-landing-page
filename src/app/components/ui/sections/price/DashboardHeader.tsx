import Image from "next/image";
import Send from "@/assets/icons/common/send.svg";
import { LINKS } from "@/app/constants/links";
import CircleAnimation from "./CircleAnimation";

const DashboardItemList: {
  Icon: React.ComponentType;
  content: string;
}[] = [
  {
    Icon: () => <Image src={Send} alt="send" className="translate-y-[3px]" />,
    content:
      "Verify this value on Etherscan. In case of discrepancies, Etherscan's value is considered accurate.",
  },
  {
    Icon: () => <span className="text-tokamak-blue translate-y-[2px]">*</span>,
    content:
      "Contract values need to be divided by 10^27 to get correct decimal place.",
  },
  {
    Icon: () => <span className="text-tokamak-blue translate-y-[2px]">*</span>,
    content:
      "Contract values need to be divided by 10^18 to get correct decimal place.",
  },
];
const DashboardItem = (props: {
  Icon: React.ComponentType;
  content: string;
}) => {
  const { Icon, content } = props;
  return (
    <div
      className={`flex gap-x-[6px] text-[12px] text-[#252525] items-baseline`}
    >
      <Icon />
      <p>{content}</p>
    </div>
  );
};

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-y-[120px]">
      <div className="flex items-center justify-center gap-x-[25px]">
        <section className="flex flex-col items-center justify-center gap-y-[30px] max-w-[495px]">
          <div className="flex flex-col gap-y-[24px] text-left">
            <h1 className="text-[30px]">
              Real-Time TON(Tokamak) <br /> Market Insights
            </h1>
            <p className="text-[15px]">
              This dashboard integrates multiple data sources to provide
              reliable information. Price data is updated in real-time and is
              linked to market data from major exchanges to ensure accuracy. Use
              it as the best tool to comprehensively monitor Tokamak
              Network&apos;s ecosystem and performance.
            </p>
          </div>
          <div className="flex w-full gap-x-[15px]">
            <button className="w-[200px] h-[40px] rounded-[20px] bg-tokamak-black text-white text-[14px] font-normal">
              <a href={LINKS.GET_TON} target="_blank" rel="noopener noreferrer">
                Buy TON(Tokamak)
              </a>
            </button>
            <button className="w-[200px] h-[40px] rounded-[20px] bg-white text-tokamak-black text-[14px] font-normal border border-tokamak-black">
              <a
                href={LINKS.DUNE_DASHBOARD}
                target="_blank"
                rel="noopener noreferrer"
              >
                Dune Dashboard
              </a>
            </button>
          </div>
        </section>
        <CircleAnimation />
      </div>
      <div className="flex gap-x-[60px]">
        {DashboardItemList.map((item) => (
          <DashboardItem {...item} key={item.Icon.displayName} />
        ))}
      </div>
    </div>
  );
}
