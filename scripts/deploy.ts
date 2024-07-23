// imports
import { ethers, run, network } from "hardhat";
require("dotenv").config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
// async main
async function main() {
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage");
    
    console.log("Deploying contract...");

    const simpleStorage = await SimpleStorageFactory.deploy();
    const address = await simpleStorage.getAddress();

    console.log(`Deployed contract to ${address}`);
    console.log(network.config);

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        const deploymentTransaction = await simpleStorage.deployTransaction();
        if (deploymentTransaction) {
            await deploymentTransaction.wait(6); 
            await verify(address, []);
        } else {
            console.error("Deployment transaction is null or undefined.");
        }
    }

    const currentValue = await simpleStorage.retrieve();

    console.log(`Current Value is: ${currentValue}`);

	const transactionResponse = await simpleStorage.store("7");
    await transactionResponse.wait(1);
    const newFavoriteNumber = await simpleStorage.retrieve();
    
    console.log(`New Favorite Number: ${newFavoriteNumber}`);
}

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
