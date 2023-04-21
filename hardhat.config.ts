import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import '@openzeppelin/hardhat-defender';
import dotenv from "dotenv";
// import * as tdly from "@tenderly/hardhat-tenderly";
// tdly.setup();
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    devnet: {
      url: "https://rpc.tenderly.co/fork/03e762ff-7ee2-4ce2-a3d0-b747e67c31d0",
      chainId: 56,
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY as string],
    }
  },
  defender: {
    apiKey: process.env.DEFENDER_API_KEY as string,
    apiSecret: process.env.DEFENDER_SECRET_KEY as string
  },
  etherscan: {
    apiKey: process.env.API_KEY as string,
  },
};

export default config;
