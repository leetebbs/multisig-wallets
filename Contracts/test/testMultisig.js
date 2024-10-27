const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Multisig Contract", function () {
    let Multisig, multisig;
    let owner1, owner2, owner3, nonOwner;
    let requiredConfirmations = 2;
    let transactionValue = ethers.parseEther("1");

    beforeEach(async function () {
        [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
        Multisig = await ethers.getContractFactory("Multisig");
        multisig = await Multisig.deploy([owner1.address, owner2.address, owner3.address], requiredConfirmations);
        await multisig.waitForDeployment();
    });

    it("should deploy the contract with the correct owners and confirmation requirements", async function () {
        expect(await multisig.owners(0)).to.equal(owner1.address);
        expect(await multisig.owners(1)).to.equal(owner2.address);
        expect(await multisig.owners(2)).to.equal(owner3.address);
        expect(await multisig.numConfirmationsRequired()).to.equal(requiredConfirmations);
    });

    it("should allow owners to submit a transaction", async function () {
        const tx = await multisig.connect(owner1).submitTransaction(owner3.address, transactionValue, "0x");
        const receipt = await tx.wait();
        const event = receipt.logs.find((e) => e.fragment.name === "SubmitTransaction");

        expect(event.args.owner).to.equal(owner1.address);
        expect(event.args.to).to.equal(owner3.address);
        expect(event.args.value).to.equal(transactionValue);
    });

    it("should allow owners to confirm a transaction", async function () {
        await multisig.connect(owner1).submitTransaction(owner3.address, transactionValue, "0x");

        await expect(multisig.connect(owner2).confirmTransaction(0))
            .to.emit(multisig, "ConfirmTransaction")
            .withArgs(owner2.address, 0);

        const tx = await multisig.transactions(0);
        expect(tx.numConfirmations).to.equal(1);
    });

    it("should not allow a non-owner to confirm a transaction", async function () {
        await multisig.connect(owner1).submitTransaction(owner3.address, transactionValue, "0x");
        await expect(multisig.connect(nonOwner).confirmTransaction(0)).to.be.revertedWith("Not an owner");
    });

    it("should require minimum confirmations to execute a transaction", async function () {
        // Fund the contract before execution
        await owner1.sendTransaction({ to: multisig.target, value: ethers.parseEther("1.5") });
        
        await multisig.connect(owner1).submitTransaction(owner3.address, transactionValue, "0x");
        await multisig.connect(owner1).confirmTransaction(0);
        await multisig.connect(owner2).confirmTransaction(0);

        const initialBalance = await ethers.provider.getBalance(owner3.address);

        await expect(multisig.connect(owner1).executeTransaction(0))
            .to.emit(multisig, "ExecuteTransaction")
            .withArgs(owner1.address, 0);

        const finalBalance = await ethers.provider.getBalance(owner3.address);
        expect(finalBalance - initialBalance).to.equal(transactionValue);
    });

    it("should fail to execute a transaction if not enough confirmations", async function () {
        await multisig.connect(owner1).submitTransaction(owner3.address, transactionValue, "0x");

        await multisig.connect(owner1).confirmTransaction(0);

        await expect(multisig.connect(owner1).executeTransaction(0)).to.be.revertedWith(
            "Transaction requires more confirmations"
        );
    });

    it("should not allow a transaction to be confirmed twice by the same owner", async function () {
        await multisig.connect(owner1).submitTransaction(owner3.address, transactionValue, "0x");

        await multisig.connect(owner1).confirmTransaction(0);
        await expect(multisig.connect(owner1).confirmTransaction(0)).to.be.revertedWith(
            "Transaction already confirmed"
        );
    });

    it("should not allow a transaction to be executed twice", async function () {
        // Fund the contract before execution
        await owner1.sendTransaction({ to: multisig.target, value: ethers.parseEther("1.5") });

        await multisig.connect(owner1).submitTransaction(owner3.address, transactionValue, "0x");
        await multisig.connect(owner1).confirmTransaction(0);
        await multisig.connect(owner2).confirmTransaction(0);
        
        // First execution
        await multisig.connect(owner1).executeTransaction(0);
        
        // Second execution attempt
        await expect(multisig.connect(owner1).executeTransaction(0)).to.be.revertedWith(
            "Transaction already executed"
        );
    });

    it("should receive deposits", async function () {
        const depositAmount = ethers.parseEther("5");
        await owner1.sendTransaction({ to: multisig.target, value: depositAmount });

        const contractBalance = await ethers.provider.getBalance(multisig.target);
        expect(contractBalance).to.equal(depositAmount);
    });
});
