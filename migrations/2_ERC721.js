const ERC721 = artifacts.require("ERC721Demo");

module.exports = function (deployer) {
    deployer.deploy(ERC721, "Junction", "JC");
};
