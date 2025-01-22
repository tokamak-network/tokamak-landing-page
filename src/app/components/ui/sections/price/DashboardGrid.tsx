import { DashboardItem } from "./types";
import Image from "next/image";
import sendIcon from "@/assets/icons/common/send.svg";
import questionIcon from "@/assets/icons/common/question.svg";
import Tooltip from "@/app/components/shared/Tooltip";
import { PRICE_LINKS } from "@/app/constants/links";
import { fetchPriceDatas } from "@/app/api/price";
import { formatInteger } from "@/app/lib/utils/format";
import { RefreshButton } from "./client/RefreshButton";
import { AnimatedValue } from "./client/AnimatedValue";

const getGridColsClass = (
  isPrice: boolean,
  isSupply: boolean,
  isLocked: boolean,
  isLiquidity: boolean,
  gridCols: number
) => {
  if (isPrice) {
    return [
      "grid-cols-3",
      "max-[995px]:min-[601px]:grid-cols-2",
      "max-[600px]:grid-cols-1",
    ].join(" ");
  }

  if (isSupply) {
    return [
      "grid-cols-4",
      "max-[995px]:min-[601px]:grid-cols-2",
      "max-[600px]:grid-cols-1",
    ].join(" ");
  }

  if (isLocked) {
    return [
      "grid-cols-3",
      "max-[995px]:min-[601px]:grid-cols-2",
      "max-[600px]:grid-cols-1",
    ].join(" ");
  }

  if (isLiquidity) {
    return [
      "grid-cols-3",
      "max-[995px]:min-[601px]:grid-cols-2",
      "max-[600px]:grid-cols-1",
    ].join(" ");
  }

  // 기본 그리드
  return gridCols;
};

const DashboardGridItem = async (props: DashboardItem) => {
  const { title, subItems, gridCols } = props;

  const isPrice = title === "Price";
  const isSupply = title === "Supply";
  const isLocked = title === "Locked";
  const isLiquidity = title === "Liquidity Measure";

  const gridColsClass = getGridColsClass(
    isPrice,
    isSupply,
    isLocked,
    isLiquidity,
    gridCols
  );

  return (
    <div>
      <div className="flex justify-between">
        <h1>{title}</h1>
        {isPrice && <RefreshButton />}
        {isSupply && (
          <span className="text-[11px]">
            <a
              href={PRICE_LINKS.spreadSheet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tokamak-blue"
            >
              Raw data
            </a>{" "}
            summarizing the history of the TON token
          </span>
        )}
      </div>

      <div
        className={`w-full grid ${gridColsClass} gpax-x-[auto] gap-y-[60px]`}
      >
        {subItems.map((item, index) => (
          <div className="flex flex-col leading-normal gap-y-[3px]" key={index}>
            <div className="flex items-baseline h-[51px] leading-[51px]">
              <h1 className={`${isPrice ? "text-[42px]" : "text-[33px]"}`}>
                <AnimatedValue value={item.value} />
              </h1>
              <span className="text-[15px] ml-[3px]">{item.unit}</span>
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
            <div className="flex gap-x-[3px] h-[16px] leading-[16px]">
              <span className="text-[13px]">
                {" "}
                {item.subText.split("").map((char, index) =>
                  char === "*" ? (
                    <span key={index} className="text-tokamak-blue">
                      *
                    </span>
                  ) : (
                    char
                  )
                )}
              </span>
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

export default async function DashboardGrid() {
  const {
    tonPrice,
    marketCap,
    fullyDilutedValuation,
    totalSupply,
    circulatingSupply,
    circulatingSuupplyUpbitStandard,
    burnedSupply,
    DAOStakedVolume,
    stakedVolume,
    liquidity,
    liquidityUSD,
  } = await fetchPriceDatas();

  const dashboardItemList: DashboardItem[] = [
    {
      title: "Price",
      gridCols: 3,
      subItems: [
        {
          value: `${formatInteger(tonPrice.current.usd)}`,
          unit: `USD / ${formatInteger(tonPrice.current.krw)} KRW`,
          subText: "TON Price",
        },
        {
          value: `${formatInteger(tonPrice.opening.usd)}`,
          unit: `USD / ${formatInteger(tonPrice.opening.krw)} KRW`,
          subText: "24H Opening Price",
        },
        {
          value: `${formatInteger(tonPrice.closing.usd)}`,
          unit: `USD / ${formatInteger(tonPrice.closing.krw)} KRW`,
          subText: "24H Closing Price",
        },
        {
          value: `${formatInteger(marketCap)}`,
          unit: "USD",
          subText: "Market Cap",
          tooltip: (
            <div className="text-center">
              Market Cap = Circulating <br /> Supply * Price Per TON
            </div>
          ),
        },
        {
          value: `${formatInteger(fullyDilutedValuation)}`,
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
          value: `${formatInteger(totalSupply)}`,
          unit: "TON",
          subText: "Total Supply",
          link: "https://etherscan.io/address/0x0b55a0f463b6defb81c6063973763951712d0e5f#readProxyContract#F64",
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
          value: `${formatInteger(circulatingSupply)}`,
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
          value: `${formatInteger(circulatingSuupplyUpbitStandard)}`,
          unit: "TON",
          subText: "Circulating Supply (Upbit)",
          tooltip: (
            <div className="text-center">
              Circulating Supply (Upbit Standard) = <br />
              Total Supply - DAO Vault - Vested <br />
              <br />
              The circulating supply, calculated by following <br />
              Upbit's criteria, factors in staked WTON, <br />
              considering it available rather than locked.
            </div>
          ),
        },
        {
          value: `${formatInteger(burnedSupply)}`,
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
          value: `${formatInteger(DAOStakedVolume)}`,
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
          value: `${formatInteger(stakedVolume)}`,
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
          value: `${formatInteger(liquidity.c1)}`,
          unit: "TON",
          subText: `${formatInteger(liquidityUSD.c1)} USD`,
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
          value: `${formatInteger(liquidity.c2)}`,
          unit: "TON",
          subText: `${formatInteger(liquidityUSD.c2)} USD`,
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
          value: `${formatInteger(liquidity.c3)}`,
          unit: "TON",
          subText: `${formatInteger(liquidityUSD.c3)} USD`,
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

  return (
    <div className="flex flex-col gap-y-[120px]">
      {dashboardItemList.map((item, index) => (
        <DashboardGridItem key={index} {...item} />
      ))}
    </div>
  );
}
