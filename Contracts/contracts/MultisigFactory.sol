//SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./Multisig.sol";

contract MultisigFactory {
    // Array to keep track of all deployed Multisig contracts
    address[] public deployedMultisigs;
    
    // Mapping from Multisig address to its owners
    mapping(address => address[]) public multisigToOwners;
    
    // Mapping from owner address to array of Multisig contracts they're part of
    mapping(address => address[]) public ownerToMultisigs;
    
    // Event to notify when a new Multisig is created
    event MultisigCreated(address indexed multisigAddress, address indexed creator, address[] owners, uint numConfirmationsRequired);
    
    /**
     * @dev Creates a new Multisig contract
     * @param _owners Array of owner addresses for the new Multisig
     * @param _numConfirmationsRequired Number of confirmations required for transaction execution
     * @return newMultisig Address of the newly created Multisig contract
     */
    function createMultisig(
        address[] memory _owners,
        uint _numConfirmationsRequired
    ) public returns (address) {
        // Deploy new Multisig contract
        Multisig newMultisig = new Multisig(
            _owners,
            _numConfirmationsRequired
        );
        
        address multisigAddress = address(newMultisig);
        
        // Store the address of the new Multisig
        deployedMultisigs.push(multisigAddress);
        
        // Store the relationship between Multisig and its owners
        multisigToOwners[multisigAddress] = _owners;
        
        // Store the relationship between owners and their Multisigs
        for(uint i = 0; i < _owners.length; i++) {
            ownerToMultisigs[_owners[i]].push(multisigAddress);
        }
        
        // Emit creation event
        emit MultisigCreated(
            multisigAddress,
            msg.sender,
            _owners,
            _numConfirmationsRequired
        );
        
        return multisigAddress;
    }
    
    /**
     * @dev Returns all deployed Multisig contracts
     * @return Array of deployed Multisig addresses
     */
    function getDeployedMultisigs() public view returns (address[] memory) {
        return deployedMultisigs;
    }
    
    /**
     * @dev Returns the number of deployed Multisig contracts
     * @return Number of deployed Multisigs
     */
    function getDeployedMultisigsCount() public view returns (uint) {
        return deployedMultisigs.length;
    }
    
    /**
     * @dev Returns all owners of a specific Multisig contract
     * @param _multisig Address of the Multisig contract
     * @return Array of owner addresses
     */
    function getMultisigOwners(address _multisig) public view returns (address[] memory) {
        require(_multisig != address(0), "Invalid multisig address");
        return multisigToOwners[_multisig];
    }
    
    /**
     * @dev Returns all Multisig contracts that an address is an owner of
     * @param _owner Address to check
     * @return Array of Multisig addresses
     */
    function getOwnerMultisigs(address _owner) public view returns (address[] memory) {
        require(_owner != address(0), "Invalid owner address");
        return ownerToMultisigs[_owner];
    }
    
    /**
     * @dev Checks if an address is an owner of a specific Multisig
     * @param _multisig Address of the Multisig contract
     * @param _owner Address to check
     * @return bool indicating if the address is an owner
     */
    function isOwnerOfMultisig(address _multisig, address _owner) public view returns (bool) {
        address[] memory owners = multisigToOwners[_multisig];
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i] == _owner) {
                return true;
            }
        }
        return false;
    }
}