import { useState, useEffect } from "react";
import { Shield, Users, KeyRound, Plus, Trash2, Wallet, CircleHelp, SearchX } from "lucide-react";
import { useAppKitAccount, useAppKitState } from "@reown/appkit/react";
import Mint from "./Utils/Mint";
import { Link } from "react-router-dom";

const Home = () => {
  const [owners, setOwners] = useState([""]);
  const [threshold, setThreshold] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState("Connect Wallet");
  const [walletAddress, setWalletAddress] = useState("");
  const [deployedAddress, setDeployedAddress] = useState("");
  const { address, isConnected, status } = useAppKitAccount();
  const { selectedNetworkId } = useAppKitState();
  const [isMinting, setIsMinting] = useState(false);

  function networkName(chainId) {
    if (chainId == 421614) {
      setSelectedNetwork("arbitrum");
    }
    if (chainId == 11155111) {
      setSelectedNetwork("sepolia");
    }
    if (chainId == 80002) {
      setSelectedNetwork("polygon");
    }
    if (chainId == 1301) {
      setSelectedNetwork("unichain");
    }
  }

  useEffect(() => {
    if (isConnected) {
      setWalletAddress(address);
      networkName(selectedNetworkId.slice(7));
    }
  }, [status, address, selectedNetworkId, isConnected]);

  const addOwner = () => {
    const newOwner = ""; // Create a new empty string for the new owner
    setOwners([...owners, newOwner]); // Add the new owner to the owners array
    const ownersString =
      owners.join(", ") + (owners.length > 0 ? ", " : "") + newOwner; // Create a comma-separated string of owners
    console.log(ownersString); // Log the comma-separated string of owners
  };

  const removeOwner = (index) => {
    const newOwners = owners.filter((_, i) => i !== index);
    setOwners(newOwners);
    if (threshold > newOwners.length) {
      setThreshold(newOwners.length);
    }
  };

  const updateOwner = (index, value) => {
    if (value.trim() !== "") {
      // Check if the value is not empty
      const newOwners = [...owners];
      newOwners[index] = value;
      setOwners(newOwners);
    }
  };

  const handleDeploy = async () => {
    setIsMinting(true);
    try {
      const deployedAddress = await Mint(owners, threshold, selectedNetwork); // Pass setIsMinting to Mint
      setDeployedAddress(deployedAddress);
    } catch (error) {
      console.error("Minting failed:", error);
    } finally {
      setIsMinting(false); // Ensure setIsMinting is called to reset the state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Wallet Connection */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              MultiVault
            </h1>
            <p className="text-gray-600">
              Create a new secure multisignature wallet
            </p>
          </div>
          <div>
            <w3m-button />
          </div>
        </div>
        {/* <div className="flex justify-center gap-10 mt-10">
            <Link to="/about">
            <button className="bg-blue-300 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded">About</button>
            </Link>
            <Link to="/howto">
            <button className="bg-blue-300 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded">How to Use</button>
            </Link>
          </div> */}
        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Secure</h3>
                <p className="text-sm text-gray-600">
                  Multi-signature security
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Collaborative</h3>
                <p className="text-sm text-gray-600">Multiple owners</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <KeyRound className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Customizable</h3>
                <p className="text-sm text-gray-600">Flexible thresholds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              to={`/fetch?network=${encodeURIComponent(
                selectedNetwork
              )}&owner=${encodeURIComponent(walletAddress)}`}
            >
              <button className="mt-3 flex items-center px-4 py-2 border rounded hover:bg-gray-100 mb-5">
                <Wallet className="h-8 w-8 text-blue-500 mr-3" />
                Deployed Wallets
              </button>
            </Link>
            <Link
              to={`/howto`}
            >
              <button className="mt-3 flex items-center px-4 py-2 border rounded hover:bg-gray-100 mb-5 w-[200px]">
                <CircleHelp className="h-8 w-8 text-blue-500 mr-3" />
                How To Use
              </button>
            </Link>
            <Link
              to={`/about`}
            >
              <button className="mt-3 flex items-center px-4 py-2 border rounded hover:bg-gray-100 mb-5 w-[200px]">
                <SearchX className="h-8 w-8 text-blue-500 mr-3" />
                About
              </button>
            </Link>
          </div> */}
          <div className="mb-6">
            {/* Network Selector */}
            <h2 className="text-xl font-bold mb-1">Connected Network</h2>
            <div className="text-gray-600 font-bold mt-2">
              {selectedNetwork}
            </div>
            <h2 className="text-xl font-bold mb-2 mt-7">
              Wallet Configuration
            </h2>
            <p className="text-gray-600">
              Set up your multisig wallet parameters
            </p>
          </div>

          <div className="space-y-6">
            {/* Owners Section */}
            <div>
              <label className="text-sm font-medium mb-2 block">Owners</label>
              <div className="space-y-3">
                {owners.map((owner, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Owner ${index + 1} address`}
                      value={owner}
                      onChange={(e) => updateOwner(index, e.target.value)}
                      className="flex-grow font-mono p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {owners.length > 1 && (
                      <button
                        onClick={() => removeOwner(index)}
                        className="p-2 border rounded hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addOwner}
                className="mt-3 flex items-center px-4 py-2 border rounded hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Owner
              </button>
            </div>

            {/* Threshold Section */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Required Confirmations
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={owners.length}
                  value={threshold}
                  onChange={(e) =>
                    setThreshold(
                      Math.min(
                        owners.length,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <span className="text-gray-600">
                  out of {owners.length} owner(s)
                </span>
              </div>
            </div>

            {deployedAddress && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Deployed Address
                </label>
                <div className="text-gray-600 font-bold mt-2">
                  {deployedAddress}
                </div>
              </div>
            )}

            {/* Deploy Button */}
            <button
              onClick={handleDeploy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!walletAddress || owners.length <= 1 || isMinting}
            >
              {!walletAddress
                ? "Connect Wallet to Deploy"
                : "Deploy Multisig Wallet"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
            <Link
              to={`/fetch?network=${encodeURIComponent(
                selectedNetwork
              )}&owner=${encodeURIComponent(walletAddress)}`}
            >
              <button className="mt-3 flex items-center px-4 py-2 border rounded hover:bg-gray-100 mb-5">
                <Wallet className="h-8 w-8 text-blue-500 mr-3" />
                Deployed Wallets
              </button>
            </Link>
            <Link
              to={`/howto`}
            >
              <button className="mt-3 flex items-center px-4 py-2 border rounded hover:bg-gray-100 mb-5 w-[200px]">
                <CircleHelp className="h-8 w-8 text-blue-500 mr-3" />
                How To Use
              </button>
            </Link>
            <Link
              to={`/about`}
            >
              <button className="mt-3 flex items-center px-4 py-2 border rounded hover:bg-gray-100 mb-5 w-[200px]">
                <SearchX className="h-8 w-8 text-blue-500 mr-3" />
                About
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
