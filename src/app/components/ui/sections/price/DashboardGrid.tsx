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
          <div className="text-center">
            Market Cap = Circulating <br /> Supply * Price Per TON
          </div>
        ),
      },
      {
        value: "204,309,913",
        unit: "USD",
        subText: "Fully Diluted Valuation",
        tooltip: (
          <div className="text-center">
            Fully Diluted Valuation = Total <br />
            Supply * Price per TON
          </div>
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
        tooltip: (
          <div className="text-center">
            The cumulative TON generated until the present <br />
            Ethereum block, factoring in both burnt TON and <br />
            unminted TON due to a seigniorage adjustment. <br /> Each block
            produces 3.92 TON as seigniorage.
            <br /> The number shown represents the upper limit.
            <br /> To obtain the real-time precise total supply, you
            <br /> may refer to the code available on this{" "}
            <a
              href="https://github.com/tokamak-network/ton-contracts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tokamak-blue"
            >
              repository.
            </a>
          </div>
        ),
      },
      {
        value: "50,655,231",
        unit: "TON",
        subText: "Circulating Supply",
        tooltip: (
          <div className="text-center">
            Circulating Supply = Total <br />
            Supply - DAO Vault - Staked - Vested
            <br />
            <br /> The amount of circulating TON in the market
          </div>
        ),
      },
      {
        value: "72,420,369",
        unit: "TON",
        subText: "Circulating Supply (Upbit)",
        tooltip: (
          <div className="text-center">
            Circulating Supply (Upbit Standard) = <br />
            Total Supply - DAO Vault - Vested <br />
            <br />
            The circulating supply, calculated by following <br />
            Upbit’s criteria, factors in staked WTON, <br />
            considering it available rather than locked.
          </div>
        ),
      },
      {
        value: "2,078,036",
        unit: "TON",
        subText: "Burned",
        link: "",
        tooltip: (
          <div className="text-center">
            The total TON that has been <br /> burned to date.
          </div>
        ),
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
        tooltip: (
          <div className="text-center">
            TON securely held within the DAO <br /> vault for an indefinite
            period.
          </div>
        ),
      },
      {
        value: "21,748,568",
        unit: "TON",
        subText: "Staked *",
        link: "",
        tooltip: (
          <div className="text-center">
            The total TON currently staked <br /> in staking contracts.
          </div>
        ),
      },
      {
        value: "0",
        unit: "TON",
        subText: "Vested **",
        link: "",
        tooltip: (
          <div className="text-center">
            The number indicates the amount of TON <br /> undergoing vesting.
            For more specifics on <br />
            allocations among different entities, refer to the <br /> raw data
            sheet. All vesting concluded on
            <br /> December 26, 2023, at 5:00:00 AM GMT+09:00.
          </div>
        ),
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
        subText: "113,841,295 USD",
        tooltip: (
          <div className="text-center">
            C1 = Total Supply - DAO Vault - Staked - Vested <br />
            <br />A supply metric representing the TON that is <br />
            immediately available for conversion to cash. <br />
            Please note that TON from TONStarter mining
            <br /> (which has ended), TON in vesting (now complete),
            <br /> and TON locked indefinitely in the DAO Vault are
            <br /> excluded from the C1 calculation.
          </div>
        ),
      },
      {
        value: "70,710,265",
        unit: "TON",
        subText: "159,299,620 USD",
        tooltip: (
          <div className="text-center">
            C2 = C1 + Staked TON <br />
            <br /> A supply metric focused on TON locked <br />
            for the short term (less than 3 months),
            <br /> which considers staked TON.
          </div>
        ),
      },
      {
        value: "70,710,265",
        unit: "TON",
        subText: "159,299,620 USD",
        tooltip: (
          <div className="text-center">
            C3 = C2 <br />
            <br />A supply measure considering a relatively <br />
            long term (greater than 1 year) locked TON.
          </div>
        ),
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
