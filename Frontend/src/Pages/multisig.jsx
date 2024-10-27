import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useLocation } from 'react-router-dom';
import multisigAbi from '../Utils/multisigAbi';

const MultisigWallet = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const address = queryParams.get("address");
  const owner = queryParams.get("owner");

  const [contract, setContract] = useState(null);
  const [owners, setOwners] = useState([]);
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    to: '',
    value: '',
    data: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (typeof window.ethereum !== 'undefined' && address) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const contractInstance = new ethers.Contract(address, multisigAbi, signer);
          const providerInstance = new ethers.Contract(address, multisigAbi, provider);
          setContract(contractInstance);

          // Load initial data
          const [requiredConfirmations, balance, txCount] = await Promise.all([
            providerInstance.numConfirmationsRequired(),
            provider.getBalance(address),
            providerInstance.transactionCount()
          ]);

          setNumConfirmationsRequired(Number(requiredConfirmations));
          setBalance(ethers.formatEther(balance));

          // Load transactions
          const txs = [];
          for (let i = 0; i < Number(txCount); i++) {
            const tx = await providerInstance.transactions(i);
            txs.push({
              index: i,
              to: tx.to,
              value: ethers.formatEther(tx.value),
              executed: tx.executed,
              numConfirmations: Number(tx.numConfirmations)
            });
          }
          setTransactions(txs);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize contract: ' + err.message);
      }
    };

    initContract();
  }, [address]);

  const handleDeposit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        throw new Error('Please enter a valid deposit amount');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Send ETH directly to the contract
      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.parseEther(depositAmount)
      });
      
      await tx.wait();

      // Update the balance
      const newBalance = await provider.getBalance(address);
      setBalance(ethers.formatEther(newBalance));

      // Clear the input
      setDepositAmount('');
    } catch (err) {
      console.error('Deposit error:', err);
      setError('Failed to deposit: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTransaction = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!newTransaction.to || !newTransaction.value) {
        throw new Error('Please fill in required fields');
      }

      const value = ethers.parseEther(newTransaction.value);
      const tx = await contract.submitTransaction(
        newTransaction.to,
        value,
        ethers.toUtf8Bytes(newTransaction.data || '')
      );
      await tx.wait();

      // Refresh transaction list
      const txCount = await contract.transactionCount();
      const newTx = await contract.transactions(Number(txCount) - 1);
      setTransactions(prev => [...prev, {
        index: Number(txCount) - 1,
        to: newTx.to,
        value: ethers.formatEther(newTx.value),
        executed: newTx.executed,
        numConfirmations: Number(newTx.numConfirmations)
      }]);

      setNewTransaction({ to: '', value: '', data: '' });
    } catch (err) {
      console.error('Submit transaction error:', err);
      setError('Failed to submit transaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransaction = async (txIndex) => {
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.confirmTransaction(txIndex);
      await tx.wait();

      // Update the specific transaction
      const updatedTx = await contract.transactions(txIndex);
      setTransactions(prev => prev.map(tx => 
        tx.index === txIndex 
          ? {
              ...tx,
              numConfirmations: Number(updatedTx.numConfirmations)
            }
          : tx
      ));
    } catch (err) {
      console.error('Confirm transaction error:', err);
      setError('Failed to confirm transaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTransaction = async (txIndex) => {
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.executeTransaction(txIndex);
      await tx.wait();

      // Update the specific transaction
      const updatedTx = await contract.transactions(txIndex);
      setTransactions(prev => prev.map(tx => 
        tx.index === txIndex 
          ? {
              ...tx,
              executed: updatedTx.executed
            }
          : tx
      ));
    } catch (err) {
      console.error('Execute transaction error:', err);
      setError('Failed to execute transaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Multisig Wallet</h1>
        
        <div className="mb-6 space-y-2">
          <p className="text-gray-600">Contract Address: {address}</p>
          <p className="text-gray-600">Connected Owner: {owner}</p>
          <p className="text-gray-600">Balance: {balance} ETH</p>
          <p className="text-gray-600">Required Confirmations: {numConfirmationsRequired}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* New Deposit Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Deposit ETH</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Amount (ETH)"
              className="flex-1 p-2 border rounded"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={handleDeposit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit New Transaction</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="To Address"
              className="w-full p-2 border rounded"
              value={newTransaction.to}
              onChange={(e) => setNewTransaction(prev => ({...prev, to: e.target.value}))}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Value (ETH)"
              className="w-full p-2 border rounded"
              value={newTransaction.value}
              onChange={(e) => setNewTransaction(prev => ({...prev, value: e.target.value}))}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Data (optional)"
              className="w-full p-2 border rounded"
              value={newTransaction.data}
              onChange={(e) => setNewTransaction(prev => ({...prev, data: e.target.value}))}
              disabled={loading}
            />
            <button
              onClick={handleSubmitTransaction}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Transaction'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div key={index} className="border rounded p-4">
                <p className="text-sm text-gray-600">To: {tx.to}</p>
                <p className="text-sm text-gray-600">Value: {tx.value} ETH</p>
                <p className="text-sm text-gray-600">
                  Confirmations: {tx.numConfirmations}/{numConfirmationsRequired}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {tx.executed ? 'Executed' : 'Pending'}
                </p>
                {!tx.executed && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleConfirmTransaction(tx.index)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                      disabled={loading}
                    >
                      Confirm
                    </button>
                    {tx.numConfirmations >= numConfirmationsRequired && (
                      <button
                        onClick={() => handleExecuteTransaction(tx.index)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        disabled={loading}
                      >
                        Execute
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultisigWallet;