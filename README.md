# ETH Cross-Chain Teleporter 🚀

A revolutionary cross-chain ETH teleportation system powered by Push Chain Universal Accounts. Lock ETH on multiple testnets (Base Sepolia, Ethereum Sepolia, Arbitrum Sepolia) and mint equivalent Wrapped ETH (wETH) tokens on Push Chain using Universal Transactions.

## 🌟 What It Does

This project enables seamless cross-chain ETH teleportation:

- **🔍 Multi-Chain Balance Display**: Real-time ETH balances across Base Sepolia, Ethereum Sepolia, and Arbitrum Sepolia
- **🎚️ Interactive Amount Selection**: Use sliders to select exact ETH amounts to teleport from each chain
- **🔒 Cross-Chain Locking**: Lock selected ETH amounts in smart contracts on respective chains
- **🪙 Universal Minting**: Mint equivalent wETH tokens on Push Chain using Universal External Accounts (UEA)
- **🔄 Auto-Refresh Balances**: Balances update automatically every 30 seconds or manually on demand
- **📱 Modern UI**: Beautiful interface with real-time updates and transaction status

## 🎯 Key Features

### Smart Contract Integration
- **ETHLock Contracts**: Deployed on Base Sepolia, Ethereum Sepolia, and Arbitrum Sepolia
- **Mock Wrapped ETH**: ERC-20 token contract on Push Chain for minted wETH
- **Universal Transactions**: Cross-chain operations using Push Chain's UEA system

### Frontend Experience
- **Push Universal Account Button**: One-click wallet connection
- **Real-time Balance Tracking**: Live ETH balances across all chains
- **Interactive Sliders**: Precise amount selection with visual feedback
- **Transaction Monitoring**: Live transaction hashes and confirmation status
- **Auto/Manual Refresh**: Balances update automatically or on-demand
- **Responsive Design**: Works seamlessly on desktop and mobile

### Technical Highlights
- **Multi-Chain Support**: Base Sepolia, Ethereum Sepolia, Arbitrum Sepolia, Push Chain
- **Network Switching**: Automatic MetaMask network switching for transactions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks, context, and state management best practices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MetaMask or compatible Web3 wallet
- Test ETH on Base Sepolia, Ethereum Sepolia, and Arbitrum Sepolia (use faucets)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd universal-erc-20-mint

# Install frontend dependencies
cd app
npm install --legacy-peer-deps
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# RPC URLs
VITE_BASE_SEPOLIA_RPC=https://base-sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_ARBITRUM_SEPOLIA_RPC=https://arbitrum-sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_PUSH_CHAIN_RPC=https://evm.rpc-testnet-donut-node1.push.org/

# Chain IDs
VITE_BASE_SEPOLIA_CHAIN_ID=84532
VITE_ETHEREUM_SEPOLIA_CHAIN_ID=11155111
VITE_ARBITRUM_SEPOLIA_CHAIN_ID=421614
VITE_PUSH_CHAIN_ID=42101

# Contract Addresses (Already Deployed)
VITE_BASE_SEPOLIA_LOCK_CONTRACT=0x2eb839A6C05Dc57E2b662bD6E00E772B381bCB1C
VITE_ETHEREUM_SEPOLIA_LOCK_CONTRACT=0xf66741112BC189E251d59Ab0E6e365f6849f87D3
VITE_ARBITRUM_SEPOLIA_LOCK_CONTRACT=0x8AbC77305f6d9f7383e6518316d620Ff199f912C
VITE_PUSH_CHAIN_TOKEN_CONTRACT=0x2bf650ECc51bF419f066fD91B150138789A707Fa
```

### 3. Start the Application

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### 4. Try the Teleporter!

1. **Connect Wallet**: Click the Universal Account Button
2. **View Balances**: See your ETH balances across all chains
3. **Select Amounts**: Use sliders to choose ETH amounts to teleport
4. **Teleport**: Click "🚀 Teleport ETH" to begin cross-chain transfer
5. **Watch Magic**: ETH gets locked on source chains, wETH minted on Push Chain!

## 📁 Project Structure

```
universal-erc-20-mint/
├── app/                          # React frontend application
│   ├── src/
│   │   ├── App.tsx              # Main teleporter component with cross-chain logic
│   │   ├── components/
│   │   │   └── SliderComponent.tsx  # Interactive amount selection sliders
│   │   ├── config/
│   │   │   └── chains.ts        # Multi-chain configuration
│   │   ├── utils/
│   │   │   └── chainUtils.ts    # Balance fetching utilities
│   │   └── abi/
│   │       └── MockWrappedETH.json  # Contract ABI for wETH token
│   ├── public/                  # Static assets
│   ├── .env                     # Environment configuration
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts           # Vite configuration
│   └── tailwind.config.js       # Tailwind CSS configuration
├── contracts/                   # Smart contract code
│   ├── src/
│   │   ├── ETHLock.sol          # ETH locking contract for external chains
│   │   └── MockWrappedETH.sol   # ERC-20 wETH token contract for Push Chain
│   ├── script/
│   │   └── Deploy.s.sol         # Foundry deployment scripts
│   ├── foundry.toml             # Foundry configuration
│   └── README.md                # Contract documentation
├── README.md                    # This file
└── package.json                 # Root package configuration
```

## 🎨 Key Features

### Smart Contract Features
- **ETHLock.sol**: Payable contract that locks ETH on external chains
- **MockWrappedETH.sol**: ERC-20 token with publicMint function for UEA accounts
- **Cross-Chain Compatibility**: Works across Base Sepolia, Ethereum Sepolia, Arbitrum Sepolia
- **Universal Account Support**: Integrates with Push Chain's Universal External Accounts

### Frontend Features
- **Multi-Chain Balance Display**: Real-time ETH balances from 3+ testnets
- **Interactive Sliders**: Precise amount selection with max balance validation
- **Network Auto-Switching**: Automatic MetaMask network switching for transactions
- **Universal Transactions**: Cross-chain minting using Push Chain's UEA system
- **Auto/Manual Balance Refresh**: Balances update every 30s or on-demand
- **Transaction Monitoring**: Live transaction hashes and explorer links
- **Error Handling**: Comprehensive error messages and loading states
- **Responsive Design**: Mobile-friendly interface with modern UI

### Technical Implementation
- **TypeScript**: Full type safety throughout the application
- **React 18**: Modern React with hooks and concurrent features
- **Ethers.js v6**: Latest Ethereum library for blockchain interactions
- **Push Chain UI Kit**: Universal Account integration
- **Tailwind CSS**: Utility-first styling with custom animations
- **Vite**: Fast development server and optimized builds

## 🔧 Configuration

### Deployed Contract Addresses

**ETH Lock Contracts (External Chains):**
- **Base Sepolia**: `0x2eb839A6C05Dc57E2b662bD6E00E772B381bCB1C`
- **Ethereum Sepolia**: `0xf66741112BC189E251d59Ab0E6e365f6849f87D3`
- **Arbitrum Sepolia**: `0x8AbC77305f6d9f7383e6518316d620Ff199f912C`

**Mock Wrapped ETH Token (Push Chain):**
- **Push Chain Donut**: `0x2bf650ECc51bF419f066fD91B150138789A707Fa`

### Supported Networks
- **Base Sepolia** (Chain ID: 84532)
- **Ethereum Sepolia** (Chain ID: 11155111)
- **Arbitrum Sepolia** (Chain ID: 421614)
- **Push Chain Donut** (Chain ID: 42101)

### Environment Variables Required
```bash
# RPC URLs for each network
VITE_BASE_SEPOLIA_RPC=https://base-sepolia.infura.io/v3/YOUR_KEY
VITE_ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_KEY
VITE_ARBITRUM_SEPOLIA_RPC=https://arbitrum-sepolia.infura.io/v3/YOUR_KEY
VITE_PUSH_CHAIN_RPC=https://evm.rpc-testnet-donut-node1.push.org/

# Contract addresses (already deployed)
VITE_BASE_SEPOLIA_LOCK_CONTRACT=0x2eb839A6C05Dc57E2b662bD6E00E772B381bCB1C
VITE_ETHEREUM_SEPOLIA_LOCK_CONTRACT=0xf66741112BC189E251d59Ab0E6e365f6849f87D3
VITE_ARBITRUM_SEPOLIA_LOCK_CONTRACT=0x8AbC77305f6d9f7383e6518316d620Ff199f912C
VITE_PUSH_CHAIN_TOKEN_CONTRACT=0x2bf650ECc51bF419f066fD91B150138789A707Fa
```

### Add wETH Token to Wallet
To view your wrapped ETH balance in MetaMask:
- **Network**: Push Chain Donut
- **Contract Address**: `0x2bf650ECc51bF419f066fD91B150138789A707Fa`
- **Symbol**: `wETH`
- **Decimals**: `18`

## 🌈 Special Features

### Cross-Chain Teleportation Flow
1. **Balance Aggregation**: Fetches ETH balances from 3+ testnet chains simultaneously
2. **Amount Selection**: Interactive sliders with real-time validation against available balances
3. **Network Switching**: Automatic MetaMask network switching for each chain transaction
4. **ETH Locking**: Real ETH transfers to lock contracts on external chains
5. **Universal Minting**: Cross-chain transaction from Sepolia to mint wETH on Push Chain
6. **Balance Updates**: Automatic refresh after teleportation completion

### Advanced UI Components
- **Rainbow Gradient Animation**: Beautiful animated gradient on wETH balance display
- **Loading States**: Comprehensive loading indicators for all async operations
- **Transaction Tracking**: Live transaction hash display with explorer links
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Responsive Sliders**: Touch-friendly amount selection with visual feedback

### Real-Time Features
- **Auto-Refresh**: Balances update every 30 seconds automatically
- **Manual Refresh**: On-demand balance refresh buttons
- **Live Updates**: Real-time transaction status and confirmation tracking
- **Network Detection**: Automatic network switching and validation

## 🚨 Troubleshooting

### Common Issues & Solutions

1. **"No lock contract for [Chain Name]"**:
   - Check that all contract addresses are correctly set in `.env`
   - Verify the contracts are deployed and accessible on the respective chains

2. **"Failed to switch to [Network]"**:
   - Ensure MetaMask is unlocked and connected
   - Add the required networks to MetaMask if prompted
   - Check that you're using a compatible wallet

3. **"Transaction failed" or "Out of gas"**:
   - Ensure you have sufficient ETH for gas fees on each chain
   - Check gas prices and try again during lower congestion
   - Verify you're on the correct network for each transaction

4. **"Balance not updating"**:
   - Wait for automatic refresh (30 seconds) or click manual refresh
   - Check transaction confirmation on block explorers
   - Refresh the page if balances still don't update

5. **"Universal Transaction failed"**:
   - Ensure you're connected to Push Chain through the Universal Account Button
   - Check that the Push Chain RPC is accessible
   - Verify the wETH contract address is correct

6. **"Network not recognized"**:
   - Push Chain Donut testnet may need to be manually added to MetaMask
   - Use the app's automatic network addition feature
   - Check RPC URL: `https://evm.rpc-testnet-donut-node1.push.org/`

### Getting Test ETH
- **Base Sepolia**: Use [Base Faucet](https://faucet.base.org/)
- **Ethereum Sepolia**: Use [Sepolia Faucet](https://sepoliafaucet.com/)
- **Arbitrum Sepolia**: Use [Arbitrum Faucet](https://faucet.arbitrum.io/)

### Network Information
- **Base Sepolia**: Chain ID 84532
- **Ethereum Sepolia**: Chain ID 11155111
- **Arbitrum Sepolia**: Chain ID 421614
- **Push Chain Donut**: Chain ID 42101

## 📚 Prerequisites

- **Node.js** (v16 or higher)
- **MetaMask** or compatible Web3 wallet
- **Test ETH** on Base Sepolia, Ethereum Sepolia, and Arbitrum Sepolia
- **Basic understanding** of React, TypeScript, and blockchain concepts

### Required Test ETH
Get test ETH from these faucets:
- [Base Sepolia Faucet](https://faucet.base.org/)
- [Ethereum Sepolia Faucet](https://sepoliafaucet.com/)
- [Arbitrum Sepolia Faucet](https://faucet.arbitrum.io/)

## 🔗 Resources

### Push Chain Documentation
- [Push Chain Docs](https://pushchain.github.io/push-chain-website/)
- [Universal Accounts Guide](https://pushchain.github.io/push-chain-website/docs/chain/tutorials/basics/tutorial-mint-erc-20-tokens/)
- [UI Kit Documentation](https://www.npmjs.com/package/@pushchain/ui-kit)

### Blockchain Networks
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Ethereum Sepolia Explorer](https://sepolia.etherscan.io/)
- [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io/)
- [Push Chain Explorer](https://donut.push.network/)

### Development Tools
- [MetaMask](https://metamask.io/) - Web3 wallet
- [Foundry](https://book.getfoundry.sh/) - Smart contract development
- [Vite](https://vitejs.dev/) - Frontend build tool
- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## 🚀 Next Steps

After mastering the ETH Teleporter, you can:

- **Build Advanced Teleporters**: Add support for more tokens (USDC, DAI, etc.)
- **Implement Unlocking**: Add functionality to unlock ETH and burn wETH
- **Create DEX Integration**: Build a cross-chain DEX using the teleporter
- **Add Bridge Validation**: Implement oracle-based cross-chain validation
- **Develop DeFi Protocols**: Create lending, staking, or yield farming on Push Chain
- **Scale to Mainnet**: Deploy production-ready contracts with security audits

### Advanced Features to Add
- **Multi-token Support**: Support for ERC-20 tokens beyond ETH
- **Batch Transactions**: Optimize gas costs with batched operations
- **Bridge Analytics**: Add transaction history and analytics dashboard
- **Mobile App**: Create React Native version for mobile teleportation
- **Cross-chain NFTs**: Extend to NFT teleportation functionality

## 🎉 Congratulations!

You've successfully built and deployed a fully functional cross-chain ETH teleporter! This project demonstrates:

- ✅ **Real cross-chain value transfer** between multiple blockchain networks
- ✅ **Universal Account integration** for seamless user experience
- ✅ **Smart contract deployment** and interaction across testnets
- ✅ **Modern React application** with advanced UI components
- ✅ **Production-ready error handling** and user experience

The ETH Cross-Chain Teleporter showcases the power of Push Chain's Universal External Accounts and provides a solid foundation for building sophisticated cross-chain DeFi applications.

---

**Happy Teleporting! 🚀✨**
