import { ethers } from "ethers";
import { SUPPORTED_CHAINS } from "../config/chains";
import type { ChainConfig } from "../config/chains";
import ETHLockABI from "../abi/ETHLock.json";

export const getProvider = (chainConfig: ChainConfig) => {
  return new ethers.JsonRpcProvider(chainConfig.rpcUrl);
};

export const getETHBalance = async (address: string, chainConfig: ChainConfig): Promise<string> => {
  try {
    const provider = getProvider(chainConfig);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error(`Error getting balance for ${chainConfig.name}:`, error);
    return "0";
  }
};

export const getAllChainBalances = async (address: string) => {
  const balances: { [chainId: number]: string } = {};
  
  const balancePromises = SUPPORTED_CHAINS.map(async (chain) => {
    const balance = await getETHBalance(address, chain);
    return { chainId: chain.id, balance };
  });

  const results = await Promise.all(balancePromises);
  
  results.forEach(({ chainId, balance }) => {
    balances[chainId] = balance;
  });

  return balances;
};

export const lockETHOnChain = async (
  chainConfig: ChainConfig,
  amount: string,
  signer: ethers.Signer
) => {
  if (!chainConfig.lockContract) {
    throw new Error(`No lock contract configured for ${chainConfig.name}`);
  }

  const contract = new ethers.Contract(chainConfig.lockContract, ETHLockABI, signer);
  const amountWei = ethers.parseEther(amount);

  const tx = await contract.lockETH({ value: amountWei });
  return tx;
};

export const formatBalance = (balance: string, decimals: number = 4): string => {
  const num = parseFloat(balance);
  if (num === 0) return "0";
  if (num < 0.0001) return "< 0.0001";
  return num.toFixed(decimals);
};

export const validateAmount = (amount: string, maxBalance: string): boolean => {
  try {
    const amountNum = parseFloat(amount);
    const maxNum = parseFloat(maxBalance);
    return amountNum > 0 && amountNum <= maxNum;
  } catch {
    return false;
  }
};