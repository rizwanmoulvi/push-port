import {
  PushUniversalAccountButton,
  usePushChain,
  usePushChainClient,
  usePushWalletContext,
} from "@pushchain/ui-kit";
import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import MockWrappedETHABI from "./abi/MockWrappedETH.json";
import SliderComponent from "./components/SliderComponent";
import { SUPPORTED_CHAINS, PUSH_CHAIN_TOKEN_CONTRACT, PUSH_CHAIN_CONFIG } from "./config/chains";

// Debug environment variables
console.log("🔍 Environment variables:");
console.log("VITE_BASE_SEPOLIA_LOCK_CONTRACT:", import.meta.env.VITE_BASE_SEPOLIA_LOCK_CONTRACT);
console.log("VITE_ETHEREUM_SEPOLIA_LOCK_CONTRACT:", import.meta.env.VITE_ETHEREUM_SEPOLIA_LOCK_CONTRACT);
console.log("VITE_ARBITRUM_SEPOLIA_LOCK_CONTRACT:", import.meta.env.VITE_ARBITRUM_SEPOLIA_LOCK_CONTRACT);
console.log("📋 Supported chains with contracts:", SUPPORTED_CHAINS.map(c => ({ name: c.name, lockContract: c.lockContract })));

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (params: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}
import { getAllChainBalances, formatBalance } from "./utils/chainUtils";
import type { ChainBalances, LockAmounts } from "./config/chains";
import "./App.css";

// Global provider for Push Chain testnet
const pushProvider = new ethers.JsonRpcProvider(PUSH_CHAIN_CONFIG.rpcUrl);

function App() {
  const { connectionStatus } = usePushWalletContext();
  const { pushChainClient } = usePushChainClient();
  const { PushChain } = usePushChain();

  // State for balances and lock amounts
  const [chainBalances, setChainBalances] = useState<ChainBalances>({});
  const [lockAmounts, setLockAmounts] = useState<LockAmounts>({});
  const [pushTokenBalance, setPushTokenBalance] = useState<number>(-1);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [error, setError] = useState<string>("");
  const [txHashes, setTxHashes] = useState<string[]>([]);

  // Initialize lock amounts
  useEffect(() => {
    const initialAmounts: LockAmounts = {};
    SUPPORTED_CHAINS.forEach(chain => {
      initialAmounts[chain.id] = "0";
    });
    setLockAmounts(initialAmounts);
  }, []);

  // Load balances function
  const loadBalances = useCallback(async () => {
    if (connectionStatus === "connected" && pushChainClient) {
      setIsLoadingBalances(true);
      try {
        // Get the actual wallet address from origin
        const actualWalletAddress = pushChainClient.universal.origin?.address || pushChainClient.universal.account;
        
        // Get balances from all chains using the actual wallet address
        const balances = await getAllChainBalances(actualWalletAddress);
        setChainBalances(balances);

        // Get Push Chain token balance
        const contract = new ethers.Contract(
          PUSH_CHAIN_TOKEN_CONTRACT,
          MockWrappedETHABI,
          pushProvider
        );
        const tokenBalance = await contract.balanceOf(pushChainClient.universal.account);
        const formattedBalance = ethers.formatUnits(tokenBalance, 18);
        setPushTokenBalance(Number(formattedBalance));

      } catch (err) {
        console.error("Error loading balances:", err);
        setError("Failed to load balances");
      }
      setIsLoadingBalances(false);
    }
  }, [connectionStatus, pushChainClient]);

  // Load balances when connected
  useEffect(() => {
    if (connectionStatus === "connected" && pushChainClient) {
      loadBalances();
    }

    // Reset state when disconnected
    if (!pushChainClient) {
      setChainBalances({});
      setPushTokenBalance(-1);
      setLockAmounts({});
    }
  }, [connectionStatus, pushChainClient, loadBalances]);

  // Auto-refresh balances every 30 seconds when connected
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (connectionStatus === "connected" && pushChainClient) {
      intervalId = setInterval(() => {
        console.log("🔄 Auto-refreshing balances...");
        loadBalances();
      }, 30000); // 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [connectionStatus, pushChainClient, loadBalances]);

  // Handle slider changes
  const handleAmountChange = (chainId: number, amount: number) => {
    setLockAmounts(prev => ({
      ...prev,
      [chainId]: amount.toString()
    }));
  };

  // Calculate total ETH to lock
  const getTotalETHToLock = () => {
    return Object.values(lockAmounts).reduce((total, amount) => {
      return total + parseFloat(amount || "0");
    }, 0);
  };

  // Teleport function
  const teleportETH = async () => {
    if (connectionStatus !== "connected" || !pushChainClient) {
      setError("Please connect your wallet first");
      return;
    }

    const totalAmount = getTotalETHToLock();
    if (totalAmount === 0) {
      setError("Please select amounts to teleport");
      return;
    }

    setIsLocking(true);
    setError("");
    setTxHashes([]);
    const hashes: string[] = [];

    try {
      // Real locking process on external chains
      console.log("Locking ETH on chains:", lockAmounts);

      // Get the actual wallet signer for external chain transactions
      if (!window.ethereum) {
        throw new Error("No wallet found");
      }

      // Step 1: Lock ETH on each chain where amount > 0
      let lockSuccessCount = 0;
      for (const chain of SUPPORTED_CHAINS) {
        const amount = lockAmounts[chain.id];
        if (parseFloat(amount || "0") > 0) {
          console.log(`🔒 Starting lock of ${amount} ETH on ${chain.name}...`);
          console.log(`🏗️ Lock contract for ${chain.name}:`, chain.lockContract);
          
          if (!chain.lockContract) {
            console.warn(`❌ No lock contract for ${chain.name}, skipping...`);
            continue;
          }

          try {
            // Create provider and signer for this specific chain
            const provider = new ethers.BrowserProvider(window.ethereum!);
            const network = await provider.getNetwork();
            
            console.log(`Current network: ${network.chainId}, target: ${chain.id}`);
            
            // Make sure we're on the right network or switch
            if (Number(network.chainId) !== chain.id) {
              console.log(`🔄 Switching to ${chain.name} (${chain.id})...`);
              await window.ethereum!.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chain.id.toString(16)}` }],
              });
              // Wait for network switch
              await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Recreate provider and signer after potential network switch
            const newProvider = new ethers.BrowserProvider(window.ethereum!);
            const signer = await newProvider.getSigner();
            
            console.log(`💰 Signer address: ${await signer.getAddress()}`);
            console.log(`🏗️ Lock contract: ${chain.lockContract}`);

            const lockContract = new ethers.Contract(
              chain.lockContract,
              [
                {
                  "inputs": [],
                  "name": "lock",
                  "outputs": [],
                  "stateMutability": "payable",
                  "type": "function"
                }
              ],
              signer
            );

            // Send the lock transaction
            console.log(`📤 Sending lock transaction for ${amount} ETH...`);
            const tx = await lockContract.lock({
              value: ethers.parseEther(amount)
            });

            console.log(`✅ Lock transaction sent on ${chain.name}: ${tx.hash}`);
            hashes.push(tx.hash);
            setTxHashes(prev => [...prev, tx.hash]);

            // Wait for transaction confirmation
            console.log(`⏳ Waiting for confirmation...`);
            const receipt = await tx.wait();
            console.log(`🎉 Lock CONFIRMED on ${chain.name}! Gas used: ${receipt.gasUsed}`);
            lockSuccessCount++;

          } catch (error) {
            console.error(`❌ ERROR locking on ${chain.name}:`, error);
            setError(`Failed to lock ETH on ${chain.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            // Don't continue if locks are failing - this is critical
            throw error;
          }
        }
      }

      console.log(`🔒 Completed locking on ${lockSuccessCount} chains`);
      
      // Refresh balances after locks to show updated ETH balances
      console.log("🔄 Refreshing balances after locks...");
      await loadBalances();

      // Switch to Ethereum Sepolia for Universal Transaction
      console.log("🔄 Switching to Ethereum Sepolia for Universal Transaction...");
      try {
        await window.ethereum!.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Ethereum Sepolia (11155111 in hex)
        });
        // Wait for network switch
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("✅ Switched to Ethereum Sepolia successfully");
      } catch (switchError: unknown) {
        console.error("❌ Failed to switch to Ethereum Sepolia:", switchError);
        throw new Error("Please switch to Ethereum Sepolia manually to complete minting");
      }

      // Mint tokens on Push Chain using Universal Transaction from Sepolia
      console.log(`🪙 Executing Universal Transaction: Minting ${totalAmount} wETH on Push Chain from Sepolia...`);
      
      const tx = await pushChainClient.universal.sendTransaction({
        to: PUSH_CHAIN_TOKEN_CONTRACT as `0x${string}`,
        data: PushChain.utils.helpers.encodeTxData({
          abi: MockWrappedETHABI,
          functionName: "publicMint",
          args: [
            pushChainClient.universal.account,
            PushChain.utils.helpers.parseUnits(totalAmount.toString(), 18),
          ],
        }),
        value: BigInt(0),
      });

      hashes.push(tx.hash);
      setTxHashes(prev => [...prev, tx.hash]);

      // Wait for transaction
      await tx.wait();

      // Refresh balances
      await loadBalances();

      // Reset lock amounts
      const resetAmounts: LockAmounts = {};
      SUPPORTED_CHAINS.forEach(chain => {
        resetAmounts[chain.id] = "0";
      });
      setLockAmounts(resetAmounts);

    } catch (err) {
      console.error("Teleport error:", err);
      setError("Failed to teleport ETH");
    }
    
    setIsLocking(false);
  };

  const canTeleport = () => {
    const totalAmount = getTotalETHToLock();
    return totalAmount > 0 && !isLocking && connectionStatus === "connected";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 w-full">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        PUSH-PORT
      </h1>
      
      <p className="text-gray-600 text-sm max-w-2xl text-center mb-8 pb-4 border-b border-gray-200">
        Teleport tokens from various networks to one network with just a few clicks powered by Push Chain Universal Accounts.
      </p>

      <div className="mb-8">
        <PushUniversalAccountButton />
      </div>

      {connectionStatus !== "connected" && (
        <p className="text-sm text-gray-500 text-center -mt-4 mb-8">
          Please connect your wallet to view balances and teleport ETH.
        </p>
      )}

      {connectionStatus === "connected" && pushChainClient && (
        <>
         
          
          {/* Push Chain Token Balance */}
          <div className="text-xl mb-8 text-gray-800 text-center">
            <p>
              Push Chain Balance: {pushTokenBalance === -1 ? "..." : (
                <>
                  {formatBalance(pushTokenBalance.toString())}
                  <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
                    {' wETH'}
                  </span>
                </>
              )}
            </p>
            
          </div>

          {/* Chain Balances and Sliders */}
          <div className="w-full max-w-4xl mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Select ETH amounts to teleport:</h2>
              <button
                onClick={loadBalances}
                disabled={isLoadingBalances}
                className="px-3 py-1 text-sm bg-blue-100 text-white hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 rounded-lg transition-colors flex items-center"
              >
                {isLoadingBalances ? (
                  <>
                    <div className="animate-spin text-white rounded-full h-3 w-3 border-b-2 border-blue-500 mr-1"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    ↻ Refresh
                  </>
                )}
              </button>
            </div>
            
            {isLoadingBalances ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading balances...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUPPORTED_CHAINS.map((chain) => {
                  const balance = parseFloat(chainBalances[chain.id] || "0");
                  const lockAmount = parseFloat(lockAmounts[chain.id] || "0");
                  
                  return (
                    <div key={chain.id} className="bg-gray-50 p-6 rounded-lg border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">{chain.shortName}</h3>
                        <span className="text-sm text-gray-600">
                          {formatBalance(balance.toString())} ETH
                        </span>
                      </div>
                      
                      <SliderComponent
                        value={lockAmount}
                        max={balance}
                        onChange={(value) => handleAmountChange(chain.id, value)}
                        chainName={`Lock on ${chain.shortName}`}
                      />
                      
                      {lockAmount > 0 && (
                        <div className="mt-2 text-sm text-purple-600">
                          Will lock: {formatBalance(lockAmount.toString())} ETH
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total and Teleport Button */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <p className="text-lg">
                Total ETH to teleport: <span className="font-semibold text-purple-600">
                  {formatBalance(getTotalETHToLock().toString())} ETH
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Will mint {formatBalance(getTotalETHToLock().toString())} wETH on Push Chain
              </p>
            </div>

            <button
              onClick={teleportETH}
              disabled={!canTeleport()}
              className={`px-8 py-3 text-lg font-bold rounded-xl transition-all ${
                canTeleport()
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLocking ? (
                <div className="flex items-center">
                  <div className="animate-spin text-white rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Teleporting...
                </div>
              ) : (
                " Teleport ETH"
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-600 text-center mb-4 p-4 bg-red-50 rounded-lg max-w-md">
              {error}
            </div>
          )}

          {/* Transaction Hashes */}
          {txHashes.length > 0 && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg max-w-2xl">
              <h3 className="font-bold text-green-800 mb-3">✅ Teleportation Successful!</h3>
              <div className="space-y-2">
                {txHashes.map((hash, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-gray-600">
                      {index < txHashes.length - 1 ? `Lock ${index + 1}:` : "Push Chain Mint:"}
                    </span>
                    <code className="ml-2 text-xs break-all text-green-700">{hash}</code>
                  </div>
                ))}
              </div>
              {pushChainClient && txHashes.length > 0 && (
                <a
                  href={pushChainClient.explorer.getTransactionUrl(txHashes[txHashes.length - 1])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-purple-600 hover:text-purple-800 text-sm"
                >
                  View Mint Transaction on Explorer →
                </a>
              )}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 mt-10 p-3 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-500 text-center">
          <a
            href="https://github.com/rizwanmoulvi/push-port"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800"
          >
            Source Code
          </a>
          {" | "}
          <a
            href="https://donut.push.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800"
          >
            Push Chain Explorer
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
