// imports
const { ethers, run, network } = require("hardhat");
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
    if (network.config.chainId === 11155111 && ETHERSCAN_API_KEY) {
        await simpleStorage.deploymentTransaction().wait(6);
        await verify(address, []);
    }
    // Not functionable in version 6^ ethers ----->

    // await simpleStorage.deployed()
    // console.log(`Deployed contract to: ${simpleStorage.address}`)

    //______________________________________________

    // what happens when we deploy to our hardhat network?
    // if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    // 	console.log("Waiting for block confirmations...");

    // 	// Not functionable in version 6^ ethers ----->

    // 	await simpleStorage.deploymentTransaction().wait(6);
    // 	await verify(simpleStorage.target, []);

    // 	//______________________________________________
    // }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current Value is: ${currentValue}`);
	const transactionResponse = await simpleStorage.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const newFavoriteNumber = await simpleStorage.retrieve();
    console.log(`New Favorite Number: ${newFavoriteNumber}`);
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
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
