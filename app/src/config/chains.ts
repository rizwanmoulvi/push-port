export interface ChainConfig {
  id: number;
  name: string;
  shortName: string;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer?: string;
  lockContract?: string;
}

export interface ChainBalances {
  [chainId: number]: string;
}

export interface LockAmounts {
  [chainId: number]: string;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: parseInt(import.meta.env.VITE_BASE_SEPOLIA_CHAIN_ID || "84532"),
    name: "Base Sepolia",
    shortName: "Base",
    rpcUrl: import.meta.env.VITE_BASE_SEPOLIA_RPC || "https://sepolia.base.org",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia-explorer.base.org",
    lockContract: import.meta.env.VITE_BASE_SEPOLIA_LOCK_CONTRACT,
  },
  {
    id: parseInt(import.meta.env.VITE_ETHEREUM_SEPOLIA_CHAIN_ID || "11155111"),
    name: "Ethereum Sepolia",
    shortName: "Ethereum",
    rpcUrl: import.meta.env.VITE_ETHEREUM_SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.etherscan.io",
    lockContract: import.meta.env.VITE_ETHEREUM_SEPOLIA_LOCK_CONTRACT,
  },
  {
    id: parseInt(import.meta.env.VITE_ARBITRUM_SEPOLIA_CHAIN_ID || "421614"),
    name: "Arbitrum Sepolia",
    shortName: "Arbitrum",
    rpcUrl: import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia-explorer.arbitrum.io",
    lockContract: import.meta.env.VITE_ARBITRUM_SEPOLIA_LOCK_CONTRACT,
  },
];

export const PUSH_CHAIN_CONFIG: ChainConfig = {
  id: parseInt(import.meta.env.VITE_PUSH_CHAIN_ID || "42101"),
  name: "Push Chain Testnet",
  shortName: "Push",
  rpcUrl: import.meta.env.VITE_PUSH_CHAIN_RPC || "https://evm.rpc-testnet-donut-node1.push.org/",
  nativeCurrency: {
    name: "Push Chain",
    symbol: "PC",
    decimals: 18,
  },
  blockExplorer: "https://donut.push.network",
};

export const PUSH_CHAIN_TOKEN_CONTRACT = import.meta.env.VITE_PUSH_CHAIN_TOKEN_CONTRACT || "0x2bf650ECc51bF419f066fD91B150138789A707Fa";