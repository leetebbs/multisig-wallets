import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../Utils/abi";
import { useLocation, Link } from "react-router-dom";

const FetchContractsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const network = queryParams.get("network");
  const owner = queryParams.get("owner");

  const [deployedAddress, setDeployedAddress] = useState([]);
  const [multisigData, setMultisigData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      const factoryAddresses = {
        sepolia: "0xB612C1622DA64A203de1E8056B78502339b2e2B2",
        shapeSepolia: "0x2615864f73Af1F3937255c9d757f73B21d398daE",
        arbSepolia: "0x5C72C03fDc59fac2814D16c66ec0f2A1293fE846",
        polygon: "0xB2d595ee125645f8e49e8Aa5b9bf4DFCC7fbe5dF",
        unichain: "0x8C81391a6598803Dd47195B90Ee2280635D1de0b",
      };

      const factoryAddress = factoryAddresses[network];
      if (!factoryAddress) {
        setError("Invalid network provided");
        return;
      }

      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const factoryContract = new ethers.Contract(
          factoryAddress,
          abi,
          signer
        );

        // Get all multisigs for the owner
        const contracts = await factoryContract.getOwnerMultisigs(owner);
        setDeployedAddress(contracts);

        // Fetch owners for each multisig from the factory contract
        const ownersPromises = contracts.map(async (multisigAddress) => {
          try {
            // Call getMultisigOwners on the factory contract, passing the multisig address as parameter
            const owners = await factoryContract.getMultisigOwners(
              multisigAddress
            );
            return {
              address: multisigAddress,
              owners: owners,
            };
          } catch (err) {
            console.error(`Error fetching owners for ${multisigAddress}:`, err);
            return {
              address: multisigAddress,
              owners: [],
              error: "Failed to fetch owners",
            };
          }
        });

        const ownersData = await Promise.all(ownersPromises);
        setMultisigData(ownersData);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setError("Failed to fetch multisig contracts");
      } finally {
        setLoading(false);
      }
    };

    if (network && owner) {
      fetchContracts();
    }
  }, [network, owner]);

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-2">Your Multisig Wallets</h1>
        <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </button>
        </Link>
        </div>
        

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-600">
            Network: <span className="font-medium">{network}</span>
          </p>
          <p className="text-gray-600">
            Connected Address:{" "}
            <span className="font-medium">{formatAddress(owner)}</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading multisig data...</div>
      ) : multisigData.length === 0 ? (
        <div className="text-center py-4 text-gray-600">
          No multisigs found for this address
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {multisigData.map((multisig, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white shadow-sm "
            >
              <div className="border-b pb-2 mb-3">
                <h2 className="font-medium">
                  Multisig: {formatAddress(multisig.address)}
                </h2>
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  Owners ({multisig.owners?.length || 0}):
                </h3>
                {multisig.error ? (
                  <p className="text-red-500">{multisig.error}</p>
                ) : (
                  <>
                    <ul className="space-y-1">
                      {multisig.owners.map((owner, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                        >
                          {formatAddress(owner)}
                        </li>
                      ))}
                    </ul>
                    <Link to={`/multisig?address=${encodeURIComponent(multisig.address)}&owner=${encodeURIComponent(owner)}`}>
                    <button className="text-sm mt-8 text-white bg-blue-500 p-2 rounded hover:shadow-md transition-shadow">
                      Go to Multisig
                    </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchContractsPage;
