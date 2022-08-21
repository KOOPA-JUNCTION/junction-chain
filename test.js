const { networks } = require("@axelar-network/axelar-local-dev");
const {
    utils: { defaulAbiEncoder },
} = require("ethers");
const setup = require("./setup");

const ownerof = async (sourceChain, operator, tokenId) => {
    const owner = await operator.ownerOf(tokenId);
    if (owner != sourceChain.nftLinker.address) {
        return { chain: sourceChain.name, address: owner };
    } else {
        const newTokenld = defaulAbiEncoder.encode(["string", "address", "uint256"], [sourceChain.name, operator.address, tokenId]);
        for (let chain of networks) {
            try {
                const address = await chain.nftLinker.ownerof(newTokenId);
                return { chain: sourceChain.name, address: address, newTokenId: newTokenId };
            } catch (e) {}
        }
    }
};

(async () => {
    await setup(5);
    const chain1 = networks[0];
    const [user1] = chain1.userWallets;
    const chain2 = networks[1];
    const [user2] = chain1.userWallets;
    await (await chain1.ERC721.connect(user1), mint(1234));
    console.log(await ownerof(chain1, chain1.nftLinker, 1234));
    await await chain1.ERC721.connect(user1).approve(chain1.nftLinker, 1234);
    await (await chain1.nftLinker.connect(user1).sendNFT(chain1, ERC721, 1234, chain2.name, user2.address)).wait();
    for (let i = 1; i < networks.length; i++) {
        const chain = networks[i];
        const dest = networks[(i + 1) % networks.length];
        const [user] = chain.userWallets;
        const [destUser] = dest.userWallets;
        const owner = await ownerof(chain1, chain1.ERC721, 1234);
        console.log(owner);
        await (await chain.nftLinker.connect(user1).sendNFT(chain1.nftLinker, newTokenId, dest.name, destUser.address)).wait();
    }

    const owner = await ownerof(chain1, chain1.ERC721, 1234);
    console.log(owner);
})();
