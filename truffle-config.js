require("dotenv").config({ path: `${__dirname}/.env` });
const HDWalletProvider = require("@truffle/hdwallet-provider");
const priv = process.env.PRIVATE_KEY;
const rpc = {
    eth: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    axl: "https://api.avax-test.network/ext/bc/C/rpc",
    bnb: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    ftm: "https://rpc.testnet.fantom.network/",
    aurora: "https://testnet.aurora.dev",
    glmr: "https://rpc.api.moonbase.moonbeam.network",
    matic: "https://rpc-mumbai.matic.today",
};

module.exports = {
    networks: {
        eth: {
            provider: () => new HDWalletProvider(priv, rpc["eth"]),
            network_id: 3,
            gas: 5500000,
            gasPrice: 10000000000,
            confirmations: 2,
            skipDryRun: true,
        },
        fuji: {
            provider: () => new HDWalletProvider(priv, rpc["axl"]),
            network_id: 1,
            confirmations: 5,
        },
        binance: {
            provider: () => new HDWalletProvider(priv, rpc["bnb"]),
            network_id: 97,
            confirmations: 10,
            skipDryRun: true,
        },
        fantom: {
            provider: () => new HDWalletProvider(priv, rpc["ftm"]),
            chainId: 4002,
        },
        aurora: {
            provider: () => new HDWalletProvider(priv, rpc["aurora"]),
            network_id: "1313161555",
            gas: 10000000,
            deploymentPollingInterval: 8000,
            confirmations: 10,
        },
        moonbase: {
            provider: () => new HDWalletProvider(priv, rpc["glmr"]),
            network_id: 43,
        },
        mumbai: {
            provider: () => new HDWalletProvider(priv, rpc["matic"]),
            network_id: 80001,
            confirmations: 2,
            skipDryRun: true,
        },
    },

    mocha: {
        timeout: 100000000,
    },

    compilers: {
        solc: {
            version: "0.8.9",
        },
    },
};
