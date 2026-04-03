# Tower Concept Design Reference

## Reference Image
`/Downloads/Recreate_this_exact_202603221640.png`

## Core Concept
The landing page is structured as a **vertical tower** viewed from a slight low-angle perspective. Each floor represents a layer in the Tokamak Network stack. Lower floors = lower-level infrastructure. Upper floors = higher-level services and applications built on top.

The tower has a **pyramid silhouette** — wider and heavier at the base, narrowing toward the top. This visually communicates that lower layers are the foundation supporting everything above.

## Visual Language
- **Color palette**: Deep black/dark navy background, cyan (#00e5ff) neon edge lines, blue (#2A72E5) accents
- **Materials**: Dark glass/metal panels, translucent structures, holographic displays
- **Lighting**: Cyan neon outlines on every structural edge, volumetric light from the torus at top
- **Atmosphere**: Deep space / starfield background, cyberpunk-industrial aesthetic
- **Structure**: Each floor is separated by visible horizontal platforms with glowing edge trim

---

## Tower Structure (Top to Bottom)

### Torus Crown (Hero)
- **Visual**: Floating cyan torus ring above the tower, emitting volumetric light rays downward
- **Represents**: Tokamak Network brand symbol
- **Current implementation**: `TorusScene.tsx` (R3F 3D torus) + `VolumetricLight.tsx`
- **Position**: Topmost element, hovers above Floor 1

### Floor 1 — Ecosystem Showcase (Top Floor)
- **Visual**: Glass cube structure containing a grid of small project icons/panels. Narrow width, sits directly under the torus crown.
- **Represents**: The application/service layer — all ecosystem projects (10 categories: DeFi, Gaming, AI/ML, Privacy, etc.)
- **Concept**: The highest layer where end-user services live. These services are powered by everything below.
- **Current implementation**: `TowerShowcase` + `ShowcaseOverlay.tsx` (10 category pedestals with clickable modal)
- **Key interaction**: Click category -> fullscreen modal showing repos in that category

### Floor 2 — Live Data Console (Middle Floor)
- **Visual**: Wider than Floor 1. Features monitor/display panels showing data charts, graphs, and project logos on the facade.
- **Represents**: The data/activity layer — real-time network metrics, price data, development activity
- **Concept**: The "nervous system" of the tower — data flows through this layer, showing the health and activity of the ecosystem above.
- **Current implementation**: `DataConsoleFloor.tsx` (HolographicSphere + FloatingMetrics + TickerClient)
- **Key data**: TON price, market cap, TVL, active repos, code changes, net growth

### Floor 3 — Thanos L2 Infrastructure
- **Visual**: Wider than Floor 2. Features arch-shaped structural elements, FUI panels, security/infrastructure icons on left and right sides. More industrial and heavy-looking.
- **Represents**: The L2 infrastructure layer — Thanos, Tokamak's OP Stack-based rollup solution
- **Concept**: The engine room. This layer processes transactions, runs the sequencer, manages the bridge to L1. Everything above depends on this.
- **Key content**:
  - Thanos L2 introduction (OP Stack-based, modular, production-ready)
  - Architecture visualization (Sequencer -> Batcher -> Proposer -> L1)
  - Key specs: Bridge time <3min, gas reduction, on-demand deployment
  - CTA: "Launch Your L2" -> Rollup Hub (https://rolluphub.tokamak.network/)
- **Current implementation**: `EcosystemMetrics` (to be replaced)
- **Design direction**: Industrial engine room aesthetic, pipes/energy flowing upward to support upper floors

### Floor 4 — Staking & DAO (L1 Ecosystem)
- **Visual**: Wider than Floor 3. Heavy structural frame with governance/staking iconography. Vault-like or council-chamber aesthetic. Glowing panels displaying staking stats and DAO governance status.
- **Represents**: The on-chain governance and economic security layer — TON staking, seigniorage, and DAO operations built on Ethereum L1
- **Concept**: The "treasury vault" and "council chamber" of the tower. This is where the economic engine lives — stakers secure the network, seigniorage rewards flow, and governance decisions shape the protocol. Positioned between Thanos L2 (above) and Ethereum L1 (below) because staking/DAO operates on L1 but directly enables L2 operation.
- **Key content**:
  - TON Staking: total staked amount (42M+ TON), staking APY, validator count
  - Seigniorage mechanism: how staking powers L2 deployment
  - DAO governance: proposal count, voter participation, recent decisions
  - TON token utility: staking, governance voting, L2 seigniorage
  - CTA: "Stake TON" -> staking interface
- **Current implementation**: Not yet implemented
- **Design direction**: Vault/chamber aesthetic — heavy reinforced walls, glowing staking meters, governance panels. Feels like the economic heart of the tower. Energy (staking rewards) flows both upward (powering L2) and downward (anchored to L1).
- **Key data sources**:
  - Staking data: existing `fetchPriceDatas()` provides `stakedVolume`
  - Price data: existing TON price, market cap from API
  - DAO data: may need new API endpoint or static content

### Floor 5 — Ethereum L1 Base (Foundation)
- **Visual**: The widest and heaviest floor. Ethereum diamond logo prominently centered. Massive structural supports, buttress-like elements on sides. Most industrial/mechanical appearance.
- **Represents**: Ethereum L1 — the ultimate settlement layer and security anchor
- **Concept**: The bedrock. The immovable foundation the entire tower rests on. Thanos L2 posts proofs here, staking contracts live here, and the DAO operates here.
- **Key content**:
  - Ethereum L1 as settlement/security layer
  - Visual connection upward: proof submission to L2, staking contract anchor
  - Ethereum network status (block height, gas price — optional)
- **Current implementation**: Not yet implemented (below current tower)
- **Design direction**: Heavy, monumental, anchored. Ethereum logo as keystone. The widest part of the pyramid.

---

## Layer Relationship (Bottom-Up Data Flow)

```
[Torus Crown] .............. Brand / Vision
      ^
[Floor 1: Ecosystem] ....... Applications & Services
      ^
[Floor 2: Data Console] .... Network Activity & Metrics
      ^
[Floor 3: Thanos L2] ....... L2 Execution & Bridge
      ^
[Floor 4: Staking & DAO] ... Economic Security & Governance
      ^
[Floor 5: Ethereum L1] ..... Settlement & Security
```

Energy/data flows **upward**:
Ethereum settles -> Staking secures & governs -> Thanos executes -> Data reflects -> Services thrive -> Torus radiates.

Each floor's visual weight increases downward (narrow top, wide base) to reinforce this hierarchy.

### Why Staking & DAO sits between L2 and L1
- Staking contracts and DAO governance are **deployed on Ethereum L1**
- But their purpose is to **enable and secure L2 operations** (seigniorage funds L2 deployment)
- This makes them the bridge between raw L1 infrastructure and L2 execution
- Visually: the "economic engine" that converts L1 security into L2 capability

---

## Floor Transition Design
- Each floor is separated by a **horizontal platform** with glowing cyan edge trim
- `FloorIndicator` component marks transitions between floors
- The connector between floors should suggest energy/data flowing upward (particles, light pipes, glowing conduits)

## Scroll Behavior
- User scrolls **downward** through the page = moving **down** through the tower layers
- This creates an "exploring deeper into the infrastructure" feeling
- Hero (torus) is seen first, then progressively deeper layers are revealed

---

## Implementation Status

| Floor | Content | Status |
|-------|---------|--------|
| Torus Crown | 3D Torus + Volumetric Light | Done |
| Floor 1 | Ecosystem Showcase (10 categories) | Done |
| Floor 2 | Live Data Console | Done (needs visual upgrade) |
| Floor 3 | Thanos L2 | TODO (currently EcosystemMetrics) |
| Floor 4 | Staking & DAO | TODO (not yet in page) |
| Floor 5 | Ethereum L1 Base | TODO (not yet in page) |

## Reference Files
- Concept image: `/Downloads/Recreate_this_exact_202603221640.png`
- Tower floor component: `src/app/components/ui/sections/tower-floor/index.tsx`
- Page layout: `src/app/page.tsx`
- Thanos references: `src/app/components/ui/sections/tower-explorer/floors.ts`
