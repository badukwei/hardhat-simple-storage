import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", () => {
    let SimpleStorageFactory: SimpleStorage__factory
    let simpleStorage: SimpleStorage;

    beforeEach(async () => {
        SimpleStorageFactory = (await ethers.getContractFactory("SimpleStorage")) as unknown as SimpleStorage__factory;
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
