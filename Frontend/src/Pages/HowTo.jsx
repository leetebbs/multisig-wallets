import React, { useState } from 'react';
import { Wallet, Users, Send, Eye } from 'lucide-react';

const HowToUse = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">How to Use</h1>

      {/* Custom Tabs */}
      <div className="flex flex-col space-y-4">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'create'
                ? 'bg-white shadow-sm text-blue-600'
                : 'hover:bg-gray-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Creating Wallet
          </button>
          <button
            onClick={() => setActiveTab('interact')}
            className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'interact'
                ? 'bg-white shadow-sm text-blue-600'
                : 'hover:bg-gray-200'
            }`}
          >
            <Send className="w-4 h-4" />
            Interacting
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'view'
                ? 'bg-white shadow-sm text-blue-600'
                : 'hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            Viewing
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'create' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Creating a Multisignature Wallet</h3>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    1
                  </span>
                  <div>
                    <strong>Connect Your Wallet:</strong> Click on the "Connect Wallet" button to link your Ethereum wallet. Ensure you are connected to the correct network (e.g., Arbitrum, Sepolia, Polygon, Unichain).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    2
                  </span>
                  <div>
                    <strong>Set Up Owners:</strong> In the "Wallet Configuration" section, add the Ethereum addresses of the owners who will have access to the multisig wallet. You can add multiple owners by clicking the "Add Owner" button.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    3
                  </span>
                  <div>
                    <strong>Define Confirmation Threshold:</strong> Specify the number of confirmations required to execute a transaction. This should be less than or equal to the number of owners.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    4
                  </span>
                  <div>
                    <strong>Deploy the Wallet:</strong> Once you have added the owners and set the confirmation threshold, click the "Deploy Multisig Wallet" button. This will create your multisig wallet on the blockchain.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    5
                  </span>
                  <div>
                    <strong>View Deployed Wallets:</strong> After deployment, you can view your deployed wallets by clicking on the "Deployed Wallets" button. This will take you to a page where you can see all your multisig wallets.
                  </div>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'interact' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Interacting with Your Multisig Wallet</h3>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    1
                  </span>
                  <div>
                    <strong>Access Your Wallet:</strong> Navigate to the "Your Multisigs" page to view all the multisig wallets you have created. Click on a wallet to access its details.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    2
                  </span>
                  <div>
                    <strong>Deposit ETH:</strong> To add funds to your multisig wallet, enter the amount of ETH you wish to deposit and click the "Deposit" button.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    3
                  </span>
                  <div>
                    <strong>Submit Transactions:</strong> To initiate a transaction, fill in the recipient's address, the amount of ETH to send, and any optional data. Click "Submit Transaction" to create the transaction.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    4
                  </span>
                  <div>
                    <strong>Confirm Transactions:</strong> All owners can confirm transactions. Once the required number of confirmations is reached, the transaction can be executed.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    5
                  </span>
                  <div>
                    <strong>Execute Transactions:</strong> If you have the necessary confirmations, you can execute the transaction by clicking the "Execute" button.
                  </div>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'view' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Viewing Transactions</h3>
              <p className="text-gray-600">
                You can view the status of all transactions made from your multisig wallet, including the number of confirmations and whether the transaction has been executed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowToUse;