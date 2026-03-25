/** Cube grid constants */
export const CELL_SIZE = 1.0;
export const GAP = 0.06;
export const STEP = CELL_SIZE + GAP;

/** Face names matching Three.js boxGeometry material order */
export type FaceName = "right" | "left" | "top" | "bottom" | "front" | "back";

/**
 * Three.js box material index order:
 * 0 = +x (right), 1 = -x (left), 2 = +y (top),
 * 3 = -y (bottom), 4 = +z (front), 5 = -z (back)
 */
export const FACE_ORDER: FaceName[] = [
  "right",
  "left",
  "top",
  "bottom",
  "front",
  "back",
];

export function getTexturePath(
  face: FaceName,
  gx: number,
  gy: number,
  gz: number
): string | null {
  switch (face) {
    case "right":
      if (gx === 2) return `/cube/textures/right-${2 - gy}-${gz}.png`;
      return null;
    case "left":
      if (gx === 0) return `/cube/textures/left-${2 - gy}-${2 - gz}.png`;
      return null;
    case "top":
      if (gy === 2) return `/cube/textures/top-${2 - gz}-${gx}.png`;
      return null;
    case "bottom":
      if (gy === 0) return `/cube/textures/bottom-${gz}-${gx}.png`;
      return null;
    case "front":
      if (gz === 2) return `/cube/textures/front-${2 - gy}-${gx}.png`;
      return null;
    case "back":
      if (gz === 0) return `/cube/textures/back-${2 - gy}-${2 - gx}.png`;
      return null;
    default:
      return null;
  }
}

/** Dark color for internal (non-visible) faces */
export const INNER_COLOR = "#1a1a1d";

/** Background color matching the source image */
export const BG_COLOR = "#C5D5E8";

/** Collect all unique texture paths needed by the cube */
export function getAllTexturePaths(): string[] {
  const paths = new Set<string>();
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        for (const face of FACE_ORDER) {
          const p = getTexturePath(face, x, y, z);
          if (p) paths.add(p);
        }
      }
    }
  }
  return Array.from(paths);
}

/* ------------------------------------------------------------------ */
/*  B+C: Cell → Data Mapping                                          */
/* ------------------------------------------------------------------ */

export type CellCategory = "financial" | "development" | "ecosystem";

export interface CellDataEntry {
  category: CellCategory;
  label: string;
  metricKey: string;
  format: (v: number) => string;
  /** Which cube face the data overlay sits on */
  primaryFace: FaceName;
}

/**
 * Maps "face-row-col" keys to data entries.
 * Only center-column cells per face row are data cells (9 total).
 */
export const CELL_DATA_MAP: Record<string, CellDataEntry> = {
  // ── Top face = Financial ──
  "top-0-1": {
    category: "financial",
    label: "TON PRICE",
    metricKey: "tonPriceUSD",
    format: (v) => `$${v.toFixed(2)}`,
    primaryFace: "top",
  },
  "top-1-1": {
    category: "financial",
    label: "STAKED",
    metricKey: "stakedVolume",
    format: (v) => `${(v / 1e6).toFixed(1)}M`,
    primaryFace: "top",
  },
  "top-2-1": {
    category: "financial",
    label: "MARKET CAP",
    metricKey: "marketCap",
    format: (v) => `$${(v / 1e6).toFixed(1)}M`,
    primaryFace: "top",
  },

  // ── Front face = Development ──
  "front-0-1": {
    category: "development",
    label: "CODE CHANGES",
    metricKey: "codeChanges",
    format: (v) => v.toLocaleString(),
    primaryFace: "front",
  },
  "front-1-1": {
    category: "development",
    label: "NET GROWTH",
    metricKey: "netGrowth",
    format: (v) => `+${v.toLocaleString()}`,
    primaryFace: "front",
  },
  "front-2-1": {
    category: "development",
    label: "ACTIVE PROJECTS",
    metricKey: "activeProjects",
    format: (v) => v.toString(),
    primaryFace: "front",
  },

  // ── Right face = Ecosystem ──
  "right-0-1": {
    category: "ecosystem",
    label: "SUPPLY",
    metricKey: "circulatingSupply",
    format: (v) => `${(v / 1e6).toFixed(1)}M`,
    primaryFace: "right",
  },
  "right-1-1": {
    category: "ecosystem",
    label: "VOLUME 24H",
    metricKey: "tradingVolumeUSD",
    format: (v) => `$${(v / 1e3).toFixed(0)}K`,
    primaryFace: "right",
  },
  "right-2-1": {
    category: "ecosystem",
    label: "FDV",
    metricKey: "fullyDilutedValuation",
    format: (v) => `$${(v / 1e6).toFixed(1)}M`,
    primaryFace: "right",
  },
};

/** Overlay plane offsets per primary face */
export function getOverlayTransform(face: FaceName): {
  position: [number, number, number];
  rotation: [number, number, number];
} {
  switch (face) {
    case "top":
      return { position: [0, 0.505, 0], rotation: [-Math.PI / 2, 0, 0] };
    case "front":
      return { position: [0, 0, 0.505], rotation: [0, 0, 0] };
    case "right":
      return { position: [0.505, 0, 0], rotation: [0, Math.PI / 2, 0] };
    default:
      return { position: [0, 0.505, 0], rotation: [-Math.PI / 2, 0, 0] };
  }
}
