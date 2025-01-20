import { DashboardItem } from "./types";
import Image from "next/image";
import sendIcon from "@/assets/icons/common/send.svg";
import questionIcon from "@/assets/icons/common/question.svg";
import Tooltip from "@/app/components/shared/Tooltip";

const DashboardItemList: DashboardItem[] = [
  {
    title: "Price",
    gridCols: 3,
    subItems: [
      {
        value: "2.27",
        unit: "USD / 3,334 KRW",
        subText: "TON Price",
      },
      {
        value: "1.99",
        unit: "USD / 2,930 KRW",
        subText: "24H Opening Price",
      },
      {
        value: "2.27",
        unit: "USD / 3,334 KRW",
        subText: "24H Closing Price",
      },
      {
        value: "115,628,590",
        unit: "USD",
        subText: "Market Cap",
        tooltip: (
          <span>
            Market Cap = Circulating <br /> Supply * Price Per TON
          </span>
        ),
      },
      {
        value: "204,309,913",
        unit: "USD",
        subText: "Fully Diluted Valuation",
        tooltip: (
          <span>
            Fully Diluted Valuation = Total <br />
            Supply * Price per TON
          </span>
        ),
      },
    ],
  },
  {
    title: "Supply",
    gridCols: 4,
    subItems: [
      {
        value: "89,878,281",
        unit: "TON",
        subText: "Total Supply",
        link: "gogo",
        tooltip: "go",
      },
      {
        value: "50,655,231",
        unit: "TON",
        subText: "Circulating Supply",
        tooltip: "go",
      },
      {
        value: "72,420,369",
        unit: "TON",
        subText: "Circulating Supply (Upbit)",
        tooltip: "go",
      },
      {
        value: "2,078,036",
        unit: "TON",
        subText: "Burned",
        link: "",
        tooltip: "go",
      },
    ],
  },
  {
    title: "Locked",
    gridCols: 3,
    subItems: [
      {
        value: "17,458,010",
        unit: "TON",
        subText: "DAO Vault **",
        link: "",
        tooltip: "go",
      },
      {
        value: "21,748,568",
        unit: "TON",
        subText: "Staked *",
        link: "",
        tooltip: "go",
      },
      {
        value: "0",
        unit: "TON",
        subText: "Vested **",
        link: "",
        tooltip: "go",
      },
    ],
  },
  {
    title: "Liquidity Measure",
    gridCols: 3,
    subItems: [
      {
        value: "50,640,664",
        unit: "TON",
        tooltip: "go",
        subText: "113,841,295 USD",
      },
      {
        value: "70,710,265",
        unit: "TON",
        tooltip: "go",
        subText: "159,299,620 USD",
      },
      {
        value: "70,710,265",
        unit: "TON",
        tooltip: "go",
        subText: "159,299,620 USD",
      },
    ],
  },
];

const DashboardGridItem = (props: DashboardItem) => {
  const { title, subItems, gridCols } = props;
  return (
    <div>
      <h1>{title}</h1>
      <div
        className={`w-full grid ${
          gridCols === 4 ? "grid-cols-4" : "grid-cols-3"
        } gap-y-[60px]`}
      >
        {subItems.map((item, index) => (
          <div className="flex flex-col leading-normal" key={index}>
            <div className="flex items-baseline">
              <h1
                className={`${
                  title !== "Supply" ? "text-[42px]" : "text-[33px]"
                }`}
              >
                {item.value}
              </h1>
              <span className="text-[15px]">{item.unit}</span>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-[3px]"
                >
                  <Image
                    src={sendIcon}
                    alt={"link limage"}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </a>
              )}
            </div>
            <div className="flex gap-x-[3px] items-end">
              <span className="text-[13px]">{item.subText}</span>
              {item.tooltip && (
                <Tooltip content={item.tooltip}>
                  <Image src={questionIcon} alt={"tooltip icon"} />
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardGrid() {
  return (
    <div className="flex flex-col gap-y-[120px]">
      {DashboardItemList.map((item, index) => (
        <DashboardGridItem key={index} {...item} />
      ))}
    </div>
  );
}
