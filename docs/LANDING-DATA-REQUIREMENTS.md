# Landing Page Data Requirements

> Approach A — data audit and remaining work for production deployment

## Current Status

### Live Data (Already Connected)

| Section | Data Source | Method |
|---------|------------|--------|
| EcosystemDashboard — Active Projects | Biweekly report `stats.activeRepos` | RSC filesystem read |
| EcosystemDashboard — Total Staked | `price.api.tokamak.network/staking/current` | RSC fetch, ISR 5min |
| EcosystemDashboard — Code Changes | Biweekly report `stats.linesChanged` | RSC filesystem read |
| RepoShowcase | Biweekly report top 6 repos by code changes | RSC filesystem read |
| LatestFeed — Reports | Biweekly report summaries | RSC filesystem read |
| LatestFeed — Blog | Medium RSS via `/api/medium` | Client-side fetch |

### Static Content (Intentionally Hardcoded)

| Section | Content | Reason |
|---------|---------|--------|
| SimulatorHero | L2 config options, deploy animation steps | Interactive marketing demo |
| UseCases | Gaming / DeFi / Enterprise cards | Product positioning pillars |
| DeveloperCta | Docs / GitHub / Grant CTA cards | Static navigation links |
| Header / Footer | Navigation, brand elements | Static layout |

---

## Data Gaps — How to Fetch

### Priority 1: High Impact, APIs Available

#### TON Price (USD)
- **Where**: EcosystemDashboard or Header ticker
- **How to get**:
  > _TODO: 기존에 가져오는 기능이 있어 확인해서 가져와

#### Market Cap
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 기존에 가져오는 기능이 있어 확인해서 가져와

#### Total Supply / Circulating Supply
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 기존에 가져오는 기능이 있어 확인해서 가져와

---

### Priority 2: High Impact, APIs NOT Available

#### TVL (Total Value Locked)
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 기존코드 참조

#### On-chain Transactions
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 지금 당장 제공하기 어려워 아직 메인넷에 l2가 없어

#### Unique Addresses
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 지금 당장 제공하기 어려워 아직 메인넷에 l2가 없어

#### Validator / Sequencer Count
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 지금 당장 제공하기 어려워 아직 메인넷에 l2가 없어

---

### Priority 3: Nice to Have

#### GitHub Org Stars (total)
- **Where**: EcosystemDashboard or Footer
- **How to get**:
  > _TODO: 굳이 필요없을것 같아 다른 프로젝트들도 이 내용 들어가있어?

#### GitHub Contributors (unique)
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 굳이 필요없을것 같아

#### Grant Program Stats
- **Where**: DeveloperCta or new section
- **How to get**:
  > _TODO: 어떤 내용을 적으면돼?

#### Discord Member Count
- **Where**: Footer or community section
- **How to get**:
  > _TODO: 굳이 필요해?

#### Protocol Count (live)
- **Where**: EcosystemDashboard
- **How to get**:
  > _TODO: 이건 어떤내용이야?

---

## SimulatorHero — Configuration Accuracy

The simulator hero shows 3 configuration axes. Are these accurate?

- **Throughput**: Standard / High / Ultra
  > _TODO: 일단은 이렇게 할게

- **Privacy**: Public / Private / Hybrid
  > _TODO: Private/Hybrid L2 지원 여부?_

- **VM**: EVM / zk-EVM
  > _TODO: zk-EVM 현재 지원 or 로드맵?_

- **Deploy steps** (6단계 애니메이션 메시지)
  > _TODO: 실제 배포 프로세스 반영 필요?_

---

## Recommended Next Steps

1. **Quick wins** — Wire TON price + market cap to dashboard using existing `/api/price`
2. **Verify** — Check DeFi Llama for Tokamak TVL data availability
3. **Research** — Identify Titan L2 explorer API for on-chain metrics
4. **Decide** — Which 3 metrics best represent the ecosystem health for the dashboard cards
5. **Content review** — Have product team validate SimulatorHero config options and UseCases descriptions
