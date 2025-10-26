/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_SEPOLIA_RPC: string
  readonly VITE_ETHEREUM_SEPOLIA_RPC: string
  readonly VITE_ARBITRUM_SEPOLIA_RPC: string
  readonly VITE_PUSH_CHAIN_RPC: string
  readonly VITE_BASE_SEPOLIA_CHAIN_ID: string
  readonly VITE_ETHEREUM_SEPOLIA_CHAIN_ID: string
  readonly VITE_ARBITRUM_SEPOLIA_CHAIN_ID: string
  readonly VITE_PUSH_CHAIN_ID: string
  readonly VITE_BASE_SEPOLIA_LOCK_CONTRACT: string
  readonly VITE_ETHEREUM_SEPOLIA_LOCK_CONTRACT: string
  readonly VITE_ARBITRUM_SEPOLIA_LOCK_CONTRACT: string
  readonly VITE_PUSH_CHAIN_TOKEN_CONTRACT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Ethereum wallet types
interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, handler: (...args: unknown[]) => void): void;
  removeListener(event: string, handler: (...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}