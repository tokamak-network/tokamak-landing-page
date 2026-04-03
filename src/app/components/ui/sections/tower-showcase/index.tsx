import { getEcosystemData } from "@/app/lib/ecosystem-data";
import ShowcaseOverlay from "./ShowcaseOverlay";

export default async function TowerShowcase() {
  const { categories, activeProjects, codeChanges, netGrowth } =
    await getEcosystemData();

  return (
    <ShowcaseOverlay
      categories={categories}
      activeProjects={activeProjects}
      codeChanges={codeChanges}
      netGrowth={netGrowth}
    />
  );
}
