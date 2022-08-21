const NftLinker = artifacts.require("NftLinker");

const list = {
    eth: "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71",
    axl: "0xC249632c2D40b9001FE907806902f63038B737Ab",
    bnb: "0x4D147dCb984e6affEEC47e44293DA442580A3Ec0",
    ftm: "0x97837985Ec0494E7b9C71f5D3f9250188477ae14",
    aurora: "0x304acf330bbE08d1e512eefaa92F6a57871fD895",
    glmr: "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    matic: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
};

module.exports = function (deployer) {
    deployer.deploy(NftLinker, "matic", list["matic"], "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6");
};
