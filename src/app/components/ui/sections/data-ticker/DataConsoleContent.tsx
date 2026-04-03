import { getTickerData } from "./index";
import DataConsoleOverlay from "./DataConsoleOverlay";

export default async function DataConsoleContent() {
  const items = await getTickerData();
  return <DataConsoleOverlay items={items} />;
}
