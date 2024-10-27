# Multisig Wallet Project

This project is a simple implementation of a Multisig Wallet using Solidity and Hardhat. It allows multiple owners to manage funds and requires a certain number of confirmations before executing transactions.

## Features

- **Multisig Wallet**: A contract that allows multiple owners to manage funds.
- **Transaction Management**: Owners can submit and confirm transactions.
- **Event Logging**: Events are emitted for deposits, transaction submissions, confirmations, and executions.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- Hardhat

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/multisig-wallet.git
   cd multisig-wallet
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Alchemy API key and wallet private key:

   ```plaintext
   ALC_API_KEY=your_alchemy_api_key
   PRIVATE_KEY=your_private_key
   ```

### Running the Project

1. To compile the contracts, run:

   ```bash
   npx hardhat compile
   ```

2. To run tests, execute:

   ```bash
   npx hardhat test
   ```

3. To deploy the contracts, use:

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Usage

- After deploying the `MultisigFactory`, you can create new multisig wallets by calling the `createMultisig` function with the owners' addresses and the required number of confirmations.
- Owners can submit transactions, confirm them, and execute them once the required confirmations are met.

### Testing

The project includes tests for the `Multisig` and `MultisigFactory` contracts. You can run the tests using:
