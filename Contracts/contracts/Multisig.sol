//SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Multisig {
    address[] public owners;
    uint public numConfirmationsRequired;
    
    mapping(address => bool) public isOwner;
    mapping(uint => mapping(address => bool)) public confirmations;
    mapping(uint => Transaction) public transactions;
    uint public transactionCount;
    
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }
    
    event Deposit(address indexed sender, uint value);
    event SubmitTransaction(address indexed owner, uint indexed txIndex, address to, uint value, bytes data);
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    
    // Constructor
    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "Owners required");
        require(_numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length, "Invalid number of confirmations");
        
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        numConfirmationsRequired = _numConfirmationsRequired;
    }
    
    // Fallback function
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    function submitTransaction(address _to, uint _value, bytes memory _data) public onlyOwner {
        uint txIndex = transactionCount;
        transactions[txIndex] = Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
        });
        transactionCount++;
        
        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }
    
    function confirmTransaction(uint _txIndex) public onlyOwner {
        require(transactions[_txIndex].to != address(0), "Transaction does not exist");
        require(!confirmations[_txIndex][msg.sender], "Transaction already confirmed");
        
        confirmations[_txIndex][msg.sender] = true;
        transactions[_txIndex].numConfirmations++;
        
        emit ConfirmTransaction(msg.sender, _txIndex);
    }
    
    function executeTransaction(uint _txIndex) public onlyOwner {
        require(transactions[_txIndex].to != address(0), "Transaction does not exist");
        require(!transactions[_txIndex].executed, "Transaction already executed");
        require(transactions[_txIndex].numConfirmations >= numConfirmationsRequired, "Transaction requires more confirmations");
        
        Transaction storage transaction = transactions[_txIndex];
        transaction.executed = true;
        
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transaction execution failed");
        
        emit ExecuteTransaction(msg.sender, _txIndex);
    }
    
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }
}
