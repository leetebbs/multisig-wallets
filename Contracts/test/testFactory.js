const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultisigFactory", function () {
  let MultisigFactory;
  let factory;
  let owner1;
  let owner2;
  let owner3;
  let nonOwner;
  let owners;

  beforeEach(async function () {
    // Get signers
    [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
    owners = [owner1.address, owner2.address, owner3.address];

    // Deploy the factory
    MultisigFactory = await ethers.getContractFactory("MultisigFactory");
    factory = await MultisigFactory.deploy();
    await factory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await factory.getAddress()).to.properAddress;
      expect(await factory.getDeployedMultisigsCount()).to.equal(0);
    });
  });

  describe("Creating Multisig Wallets", function () {
    it("Should create a new multisig wallet", async function () {
      const numConfirmationsRequired = 2;
      const tx = await factory.createMultisig(owners, numConfirmationsRequired);
      const receipt = await tx.wait();

      // Find MultisigCreated event
      const event = receipt.logs.find(
        (log) => log.fragment.name === "MultisigCreated"
      );
      expect(event).to.exist;

      // Verify counter increased
      expect(await factory.getDeployedMultisigsCount()).to.equal(1);
    });

    it("Should store correct owner relationships", async function () {
      const numConfirmationsRequired = 2;
      const tx = await factory.createMultisig(owners, numConfirmationsRequired);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log) => log.fragment.name === "MultisigCreated"
      );
      const multisigAddress = event.args[0];

      // Check stored owners
      const storedOwners = await factory.getMultisigOwners(multisigAddress);
      expect(storedOwners).to.deep.equal(owners);

      // Check owner's multisigs
      const owner1Multisigs = await factory.getOwnerMultisigs(owner1.address);
      expect(owner1Multisigs).to.include(multisigAddress);
    });

    it("Should create multiple multisig wallets", async function () {
      const numConfirmationsRequired = 2;
      
      // Create first wallet
      await factory.createMultisig(owners, numConfirmationsRequired);
      
      // Create second wallet with different owners
      const newOwners = [owner1.address, owner2.address];
      await factory.createMultisig(newOwners, numConfirmationsRequired);

      expect(await factory.getDeployedMultisigsCount()).to.equal(2);
      
      // Check owner1's multisigs (should be in both)
      const owner1Multisigs = await factory.getOwnerMultisigs(owner1.address);
      expect(owner1Multisigs.length).to.equal(2);
      
      // Check owner3's multisigs (should only be in first)
      const owner3Multisigs = await factory.getOwnerMultisigs(owner3.address);
      expect(owner3Multisigs.length).to.equal(1);
    });
  });

  describe("Query Functions", function () {
    let multisigAddress;

    beforeEach(async function () {
      // Deploy a multisig for testing queries
      const tx = await factory.createMultisig(owners, 2);
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment.name === "MultisigCreated"
      );
      multisigAddress = event.args[0];
    });

    it("Should return correct owners for a multisig", async function () {
      const storedOwners = await factory.getMultisigOwners(multisigAddress);
      expect(storedOwners).to.deep.equal(owners);
    });

    it("Should return correct multisigs for an owner", async function () {
      const ownerMultisigs = await factory.getOwnerMultisigs(owner1.address);
      expect(ownerMultisigs).to.include(multisigAddress);
    });

    it("Should correctly verify owner status", async function () {
      expect(await factory.isOwnerOfMultisig(multisigAddress, owner1.address)).to.be.true;
      expect(await factory.isOwnerOfMultisig(multisigAddress, nonOwner.address)).to.be.false;
    });

    it("Should return all deployed multisigs", async function () {
      const deployedMultisigs = await factory.getDeployedMultisigs();
      expect(deployedMultisigs.length).to.equal(1);
      expect(deployedMultisigs[0]).to.equal(multisigAddress);
    });
  });

  describe("Edge Cases and Error Handling", function () {
    it("Should handle empty owner array", async function () {
      await expect(
        factory.createMultisig([], 1)
      ).to.be.revertedWith("Owners required");
    });

    it("Should handle invalid confirmation requirement", async function () {
      await expect(
        factory.createMultisig(owners, 0)
      ).to.be.revertedWith("Invalid number of confirmations");

      await expect(
        factory.createMultisig(owners, 4)
      ).to.be.revertedWith("Invalid number of confirmations");
    });

    it("Should handle querying non-existent multisig", async function () {
      const nonExistentAddress = "0x1234567890123456789012345678901234567890";
      const storedOwners = await factory.getMultisigOwners(nonExistentAddress);
      expect(storedOwners.length).to.equal(0);
    });

    it("Should handle duplicate owners", async function () {
      const duplicateOwners = [owner1.address, owner1.address, owner2.address];
      await expect(
        factory.createMultisig(duplicateOwners, 2)
      ).to.be.revertedWith("Owner not unique");
    });
  });

  describe("Interaction with Deployed Multisig", function () {
    let multisigAddress;
    let multisig;

    beforeEach(async function () {
      // Deploy a new multisig
      const tx = await factory.createMultisig(owners, 2);
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment.name === "MultisigCreated"
      );
      multisigAddress = event.args[0];
      
      // Get the Multisig contract instance
      const Multisig = await ethers.getContractFactory("Multisig");
      multisig = Multisig.attach(multisigAddress);
    });

    it("Should have correct initial state", async function () {
      expect(await multisig.numConfirmationsRequired()).to.equal(2);
      expect(await multisig.isOwner(owner1.address)).to.be.true;
      expect(await multisig.isOwner(nonOwner.address)).to.be.false;
    });

    it("Should allow owners to submit and confirm transactions", async function () {
      // Fund the multisig
      await owner1.sendTransaction({
        to: multisigAddress,
        value: ethers.parseEther("1.0")
      });

      // Submit transaction
      await multisig.connect(owner1).submitTransaction(
        nonOwner.address,
        ethers.parseEther("0.5"),
        "0x"
      );

      // Confirm transaction
      await multisig.connect(owner1).confirmTransaction(0);
      await multisig.connect(owner2).confirmTransaction(0);

      const transaction = await multisig.transactions(0);
      expect(transaction.numConfirmations).to.equal(2);
    });
  });
});