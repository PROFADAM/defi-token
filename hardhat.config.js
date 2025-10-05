/**
 * Hardhat configuration for DeFi Token project
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    baseMainnet: {
      url: "https://mainnet.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 8453,
      gasPrice: 1000000000, // 1 gwei
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84531,
      gasPrice: 1000000000, // 1 gwei
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84532,
      gasPrice: 1000000000, // 1 gwei
    }
  },
  etherscan: {
    apiKey: {
      baseMainnet: process.env.BASESCAN_API_KEY,
      baseGoerli: process.env.BASESCAN_API_KEY,
      baseSepolia: process.env.BASESCAN_API_KEY
    },
    customChains: [
      {
        network: "baseMainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  }
};