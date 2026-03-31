import { createPublicClient, http, formatUnits } from "viem";
import { mainnet } from "viem/chains";

/* ═══════════════════════════════════════════════
   On-chain data fetching for Governance & Staking
   Uses Alchemy RPC + viem to read Tokamak contracts
   ═══════════════════════════════════════════════ */

const ALCHEMY_RPC = "https://eth-mainnet.g.alchemy.com/v2/PbqCcGx1oHN7yNaFdUJUYqPEN0QSp23S";

const client = createPublicClient({
  chain: mainnet,
  transport: http(ALCHEMY_RPC),
});

/* ── Contract Addresses ── */
const SEIG_MANAGER_PROXY = "0x0b55a0f463b6defb81c6063973763951712d0e5f" as const;
const LAYER2_REGISTRY_PROXY = "0x0b3E174A2170083e770D5d4Cf56774D221b7063e" as const;
const DAO_AGENDA_MANAGER = "0xcD4421d082752f363E1687544a09d5112cD4f484" as const;
const DAO_COMMITTEE_PROXY = "0xDD9f0cCc044B0781289Ee318e5971b0139602C26" as const;

/* ── Minimal ABIs (from dao.tokamak.network contracts) ── */
const seigManagerAbi = [
  { name: "stakeOfTotal", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalSupplyOfTon", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "seigPerBlock", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

const layer2RegistryAbi = [
  { name: "numLayer2s", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

const daoAgendaManagerAbi = [
  { name: "totalAgendas", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    name: "getAgendaStatus",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_agendaID", type: "uint256" }],
    outputs: [{ name: "status", type: "uint256" }],
  },
  {
    name: "getAgendaResult",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_agendaID", type: "uint256" }],
    outputs: [
      { name: "result", type: "uint256" },
      { name: "executed", type: "bool" },
    ],
  },
  {
    name: "getVotingCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_agendaID", type: "uint256" }],
    outputs: [
      { name: "countingYes", type: "uint256" },
      { name: "countingNo", type: "uint256" },
      { name: "countingAbstain", type: "uint256" },
    ],
  },
  {
    name: "agendas",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [
      { name: "createdTimestamp", type: "uint256" },
      { name: "noticeEndTimestamp", type: "uint256" },
      { name: "votingPeriodInSeconds", type: "uint256" },
      { name: "votingStartedTimestamp", type: "uint256" },
      { name: "votingEndTimestamp", type: "uint256" },
      { name: "executableLimitTimestamp", type: "uint256" },
      { name: "executedTimestamp", type: "uint256" },
      { name: "countingYes", type: "uint256" },
      { name: "countingNo", type: "uint256" },
      { name: "countingAbstain", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "result", type: "uint8" },
      { name: "executed", type: "bool" },
    ],
  },
] as const;

const daoCommitteeProxyAbi = [
  { name: "quorum", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "maxMember", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

/* ── Constants ── */
const RAY = 27; // 10^27 decimals
const BLOCKS_PER_YEAR = 2_628_000; // ~12s per block, 365.25 days

/* ── Status / Result labels ── */
const AGENDA_STATUS: Record<number, string> = {
  0: "none",
  1: "notice",
  2: "voting",
  3: "waiting_exec",
  4: "executed",
  5: "ended",
};

const AGENDA_RESULT: Record<number, string> = {
  0: "pending",
  1: "accepted",
  2: "rejected",
  3: "dismissed",
};

/* ── Staking Data ── */
async function fetchStakingData() {
  const [stakeOfTotal, totalSupplyOfTon, seigPerBlock, numLayer2s] =
    await Promise.all([
      client.readContract({
        address: SEIG_MANAGER_PROXY,
        abi: seigManagerAbi,
        functionName: "stakeOfTotal",
      }),
      client.readContract({
        address: SEIG_MANAGER_PROXY,
        abi: seigManagerAbi,
        functionName: "totalSupplyOfTon",
      }),
      client.readContract({
        address: SEIG_MANAGER_PROXY,
        abi: seigManagerAbi,
        functionName: "seigPerBlock",
      }),
      client.readContract({
        address: LAYER2_REGISTRY_PROXY,
        abi: layer2RegistryAbi,
        functionName: "numLayer2s",
      }),
    ]);

  const totalStaked = Number(formatUnits(stakeOfTotal as bigint, RAY));
  const totalSupply = Number(formatUnits(totalSupplyOfTon as bigint, RAY));
  const seigPerBlockNum = Number(formatUnits(seigPerBlock as bigint, RAY));
  const operatorCount = Number(numLayer2s);

  // APR = (seigPerBlock * blocksPerYear * (stakedRatio + 0.4 * (1 - stakedRatio))) / totalStaked
  const stakedRatio = totalStaked / totalSupply;
  const annualSeig = seigPerBlockNum * BLOCKS_PER_YEAR;
  const adjustedReward = annualSeig * (stakedRatio + 0.4 * (1 - stakedRatio));
  const apr = (adjustedReward / totalStaked) * 100;

  return {
    totalStaked: Math.round(totalStaked),
    totalSupply: Math.round(totalSupply),
    apr: Math.round(apr * 100) / 100,
    operatorCount,
  };
}

/* ── Governance Data ── */
async function fetchGovernanceData() {
  const [totalAgendas, quorum, maxMember] = await Promise.all([
    client.readContract({
      address: DAO_AGENDA_MANAGER,
      abi: daoAgendaManagerAbi,
      functionName: "totalAgendas",
    }),
    client.readContract({
      address: DAO_COMMITTEE_PROXY,
      abi: daoCommitteeProxyAbi,
      functionName: "quorum",
    }),
    client.readContract({
      address: DAO_COMMITTEE_PROXY,
      abi: daoCommitteeProxyAbi,
      functionName: "maxMember",
    }),
  ]);

  const total = Number(totalAgendas);
  const quorumNum = Number(quorum);
  const maxMemberNum = Number(maxMember);

  // Fetch last 3 agendas using individual getter functions (safer than struct)
  const agendaCount = Math.min(total, 3);
  const agendaIds = Array.from({ length: agendaCount }, (_, i) => total - 1 - i);

  const agendaData = await Promise.all(
    agendaIds.map(async (id) => {
      const [status, result, votes] = await Promise.all([
        client.readContract({
          address: DAO_AGENDA_MANAGER,
          abi: daoAgendaManagerAbi,
          functionName: "getAgendaStatus",
          args: [BigInt(id)],
        }),
        client.readContract({
          address: DAO_AGENDA_MANAGER,
          abi: daoAgendaManagerAbi,
          functionName: "getAgendaResult",
          args: [BigInt(id)],
        }),
        client.readContract({
          address: DAO_AGENDA_MANAGER,
          abi: daoAgendaManagerAbi,
          functionName: "getVotingCount",
          args: [BigInt(id)],
        }),
      ]);

      const statusNum = Number(status);
      const [resultNum, executed] = result as [bigint, boolean];
      const [yesVotes, noVotes, abstainVotes] = votes as [bigint, bigint, bigint];

      const yes = Number(yesVotes);
      const no = Number(noVotes);
      const abstain = Number(abstainVotes);
      const totalVotes = yes + no + abstain;

      // Determine display status
      let displayStatus: string;
      const resNum = Number(resultNum);
      if (statusNum === 2) {
        displayStatus = "active";
      } else if (resNum === 1 || statusNum === 4) {
        displayStatus = "passed";
      } else if (resNum === 2) {
        displayStatus = "rejected";
      } else if (statusNum === 1) {
        displayStatus = "notice";
      } else {
        displayStatus = AGENDA_STATUS[statusNum] || "ended";
      }

      // Vote percentage: yes / maxMember for committee-based voting
      const votePercent =
        maxMemberNum > 0 ? Math.round((yes / maxMemberNum) * 100) : 0;

      return {
        id: `#${id}`,
        title: `Agenda ${id}`,
        status: displayStatus,
        votes: `${votePercent}%`,
        yesVotes: yes,
        noVotes: no,
        abstainVotes: abstain,
        totalVotes,
        executed: Boolean(executed),
        rawStatus: AGENDA_STATUS[statusNum] || "unknown",
        rawResult: AGENDA_RESULT[resNum] || "unknown",
      };
    })
  );

  // Count active proposals
  const activeCount = agendaData.filter(
    (p) => p.status === "active" || p.status === "notice"
  ).length;

  return {
    proposals: agendaData,
    totalAgendas: total,
    quorum: quorumNum,
    maxMember: maxMemberNum,
    activeProposals: activeCount,
  };
}

/* ── Main Export ── */
export async function fetchGovernanceStakingData() {
  const [staking, governance] = await Promise.all([
    fetchStakingData(),
    fetchGovernanceData(),
  ]);

  return {
    staking,
    governance,
    fetchedAt: Date.now(),
  };
}
