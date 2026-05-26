import { base } from "wagmi/chains";

/** Set after deploying Hub.sol on Base */
export const HUB_CONTRACT_ADDRESS: `0x${string}` =
  "0x05238a681d5e077c622524B5ff8BE84F11CF51C4";

/** Hub deploy block on Base mainnet — limits eth_getLogs range for leaderboard */
export const HUB_DEPLOY_FROM_BLOCK = 46519947n;

export const DEPLOY_CHAIN_ID = base.id;

export const POINTS_PER_FREE_GM = 10;
export const POINTS_PER_PAID_GM = 20;
export const FREE_GM_PER_DAY = 3;
export const GM_FEE_WEI = BigInt("100000000000000");

export const POINTS_PER_FREE_DEPLOY = 20;
export const POINTS_PER_PAID_DEPLOY = 40;
export const FREE_DEPLOY_PER_DAY = 1;
export const DEPLOY_FEE_WEI = BigInt("100000000000000");

export const POINTS_PER_REFERRAL = 200;

export const hubAbi = [
  {
    type: "function",
    name: "registerReferrer",
    inputs: [{ name: "referrer", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "gm",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "deployToken",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "initialSupply", type: "uint256" },
    ],
    outputs: [{ name: "token", type: "address" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "gmCount",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deployCount",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "points",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "referredBy",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "referralCount",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "POINTS_PER_REFERRAL",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lastGmAt",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "freeGmsRemaining",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "freeDeployAvailable",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalGms",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalDeploys",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "FREE_GM_PER_DAY",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "GM_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEPLOY_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "POINTS_PER_FREE_GM",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "POINTS_PER_PAID_GM",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "POINTS_PER_FREE_DEPLOY",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "POINTS_PER_PAID_DEPLOY",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MIN_INTERVAL",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ReferrerBound",
    inputs: [
      { name: "referrer", type: "address", indexed: true },
      { name: "referee", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ReferralActivated",
    inputs: [
      { name: "referrer", type: "address", indexed: true },
      { name: "referee", type: "address", indexed: true },
      { name: "referrerReferralCount", type: "uint256", indexed: false },
      { name: "referrerPoints", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "GM",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "gmCount", type: "uint256", indexed: false },
      { name: "points", type: "uint256", indexed: false },
      { name: "paid", type: "bool", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "TokenDeployed",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "symbol", type: "string", indexed: false },
      { name: "initialSupply", type: "uint256", indexed: false },
      { name: "paid", type: "bool", indexed: false },
      { name: "pointsEarned", type: "uint256", indexed: false },
      { name: "totalPoints", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

/** @deprecated use hubAbi */
export const gmAbi = hubAbi;

export const isContractConfigured =
  HUB_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";
