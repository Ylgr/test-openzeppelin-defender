import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import '@openzeppelin/hardhat-defender';
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    devnet: {
      url: "https://rpc.vnet.tenderly.co/devnet/my-first-devnet/6af0eded-2bc0-44af-80f6-6dfc0dcf72f5",
      chainId: 56,
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY || ''],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY || ''],
    }
  },
  defender: {
    apiKey: process.env.DEFENDER_API_KEY || '',
    apiSecret: process.env.DEFENDER_SECRET_KEY || ''
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};

export default config;
