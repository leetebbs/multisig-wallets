import { ethers } from "ethers";
import abi from "./abi";

const addresses = {
    "sepolia": "0xB612C1622DA64A203de1E8056B78502339b2e2B2",
    "shapeSepolia": "0x2615864f73Af1F3937255c9d757f73B21d398daE",
    "arbitrum": "0x5C72C03fDc59fac2814D16c66ec0f1A293fE846",
    "polygon": "0xB2d595ee125645f8e49e8Aa5b9bf4DFCC7fbe5dF",
    "unichain": "0x8C81391a6598803Dd47195B90Ee2280635D1de0b"
}

async function Mint(owners, threshold, network) {
    try {
        const address = addresses[network];
        
        if (!address) {
            throw new Error(`Invalid network: ${network}. Please provide a valid network key.`);
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);

        // Create multisig wallet
        console.log("Creating multisig with:", { owners, threshold });
        const tx = await contract.createMultisig(owners, threshold);
        console.log("Transaction hash:", tx.hash);

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);
        console.log("Transaction status: ", "0x" + receipt.logs[0].topics[1].slice(26));
        const deployedAddress= "0x" + receipt.logs[0].topics[1].slice(26)
        // 0x000000000000000000000000e21cece4eea52a0a6d2597aee7189e861721cfc

        return deployedAddress;
    } catch (error) {
        console.error("Error creating multisig:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export default Mint;
