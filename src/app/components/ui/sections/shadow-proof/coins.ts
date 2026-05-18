export interface CoinDef {
  id: string;
  symbol: string;
  logo: string;
  address: string;
  amount: string;
  brandColor: string;
  /** angle on satellite ring (radians). TON center is null. */
  angle: number | null;
}

const TAU = Math.PI * 2;

export const COINS: CoinDef[] = [
  {
    id: "ton",
    symbol: "TON",
    logo: "/tokamak-symbol.svg",
    address: "0x9aB7…4f02",
    amount: "420.18",
    brandColor: "#00e5ff",
    angle: null,
  },
  {
    id: "btc",
    symbol: "BTC",
    logo: "/coins/btc.png",
    address: "bc1q…9k3v",
    amount: "0.842",
    brandColor: "#f7931a",
    angle: (TAU * 0) / 8,
  },
  {
    id: "eth",
    symbol: "ETH",
    logo: "/coins/eth.png",
    address: "0x4A2F…8b3c",
    amount: "12.504",
    brandColor: "#8a92b2",
    angle: (TAU * 1) / 8,
  },
  {
    id: "usdt",
    symbol: "USDT",
    logo: "/coins/usdt.png",
    address: "0x91D7…0aE1",
    amount: "48,200",
    brandColor: "#26a17b",
    angle: (TAU * 2) / 8,
  },
  {
    id: "sol",
    symbol: "SOL",
    logo: "/coins/sol.png",
    address: "9F4z…kPq2",
    amount: "127.3",
    brandColor: "#9945ff",
    angle: (TAU * 3) / 8,
  },
  {
    id: "usdc",
    symbol: "USDC",
    logo: "/coins/usdc.png",
    address: "0x2cD4…e91A",
    amount: "9,150",
    brandColor: "#2775ca",
    angle: (TAU * 4) / 8,
  },
  {
    id: "bnb",
    symbol: "BNB",
    logo: "/coins/bnb.png",
    address: "bnb1…x7s2",
    amount: "42.7",
    brandColor: "#f0b90b",
    angle: (TAU * 5) / 8,
  },
  {
    id: "xrp",
    symbol: "XRP",
    logo: "/coins/xrp.png",
    address: "r4A2…mB1q",
    amount: "8,400",
    brandColor: "#dadada",
    angle: (TAU * 6) / 8,
  },
  {
    id: "doge",
    symbol: "DOGE",
    logo: "/coins/doge.png",
    address: "D8x…vKw9",
    amount: "1.2M",
    brandColor: "#c2a633",
    angle: (TAU * 7) / 8,
  },
];

export const RING_RADIUS = 2.9;
