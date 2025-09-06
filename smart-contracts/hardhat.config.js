import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // RPC URL (Alchemy/Infura)
      accounts: [process.env.PRIVATE_KEY], // MetaMask private key
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Add your Etherscan API key here
  },
};
