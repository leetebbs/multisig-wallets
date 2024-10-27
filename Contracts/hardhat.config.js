require("@nomicfoundation/hardhat-toolbox"); // Import Hardhat toolbox for Ethers v6 support
require("dotenv").config();
// Replace these with your actual values
const ALC_API_KEY = process.env.ALC_API_KEY; // Your Infura Project ID
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Your wallet private key (keep this private)

module.exports = {
  solidity: "0.8.27", // Specify the Solidity compiler version
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALC_API_KEY}`, // Infura endpoint for Goerli
      accounts: [`0x${PRIVATE_KEY}`], // Account to deploy from
    },
    shapeSepolia: {
      url: `https://shape-sepolia.g.alchemy.com/v2/${ALC_API_KEY}`, // Infura endpoint for Sepolia
      accounts: [`0x${PRIVATE_KEY}`], // Account to deploy from
    },
    arbSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${ALC_API_KEY}`, // Infura endpoint for Arbitrum Sepolia
      accounts: [`0x${PRIVATE_KEY}`], // Account to deploy from
    },
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${ALC_API_KEY}`, // Infura endpoint for Polygon Mumbai
      accounts: [`0x${PRIVATE_KEY}`], // Account to deploy from
    },
    unichain: {
      url: `https://unichain-sepolia.g.alchemy.com/v2/${ALC_API_KEY}`, // Infura endpoint for Unichain Sepolia
      accounts: [`0x${PRIVATE_KEY}`], // Account to deploy from
    },
    // Add other networks as needed
  },
};
