const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", () => {
    let SimpleStorageFactory, simpleStorage;

    beforeEach(async () => {
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await SimpleStorageFactory.deploy();
    });

    it("Should start with a favorite number of 0", async () => {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";
        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should update the favorite number when store is called", async () => {
        const transactionResponse = await simpleStorage.store("7");
        await transactionResponse.wait(1);
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "7";
        assert.equal(currentValue.toString(), expectedValue);
    });
});
