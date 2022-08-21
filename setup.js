const { createNetwork, networks } = require("@axelar-network/axelar-local-dev");
const { ContractFactory } = require("ethers");

const deployContract = async (wallet, contractJson, args = [], options = {}) => {
    console.log("A");
    const factory = new ContractFactory(contractJson.abi, contractJson.bytecode, wallet);
    console.log(factory);
    const contract = await factory.deploy(...args, { ...options });
    console.c;
    await contract.deployed();
    console.log("4");
    return contract;
};

const NftLinker = require("./build/contracts/NftLinker.json");
const ERC721Demo = require("./build/contracts/Erc721Demo.json");

module.exports = async (numberOfNetworks) => {
    console.log(numberOfNetworks);
    for (let i = 0; i < numberOfNetworks; i++) {
        const chain = await createNetwork({ seed: "network" + i });
        const [, deployer] = chain.userWallets;
        chain.nftLinker = await deployContract(deployer, NftLinker, [chain.name, chain.gateway.address]);
        chain.ERC721 = await deployContract(deployer, ERC721Demo, ["Demo ERC721", "dEMO"]);
    }
    for (let i = 0; i < numberOfNetworks; i++) {
        const chain = networks[i];
        console.log(chain);
        const [, deployer] = chain.userWallets;
        for (let j = 0; j < numberOfNetworks; j++) {
            if (i == j) continue;
            const otherChain = networks[j];
            await (await chain.nftLinker.connect[deployer].addLinker(otherChain.name, otherChain.nftLinker.address)).wait();
        }
    }
};
