require("dotenv").config();

const { schedule } = require("@netlify/functions");
const snapshot = require("@snapshot-labs/snapshot.js");
const { ethers } = require("ethers");
const {
  PRIMARY_PRIVATE_KEY,
  ALCHEMY_API_KEY_RINKEBY,
} = require("./utils/config");

const createProposal = async () => {
  const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
  const client = new snapshot.Client712(hub);

  const provider = new ethers.providers.AlchemyProvider(
    "rinkeby",
    ALCHEMY_API_KEY_RINKEBY
  );
  const wallet = new ethers.Wallet(PRIMARY_PRIVATE_KEY, provider);
  const signer = wallet.connect(provider);

  const blockNumber = (await provider.getBlock()).number;

  const receipt = await client.proposal(signer, signer.address, {
    space: "Time-Travellers-DAO",
    type: "single-choice",
    title: "Test proposal using Snapshot.js",
    body: "",
    choices: ["Alice", "Bob", "Carol"],
    start: 1636984800, // TODO: what's this?
    end: 1637244000,
    snapshot: blockNumber, // TODO: how far back do we want to go?
    network: "4",
    strategies: JSON.stringify({}),
    plugins: JSON.stringify({}),
    metadata: JSON.stringify({}),
  });
};

const handler = async function (event, context) {
  console.log("Received event:", event);

  await createProposal();

  return {
    statusCode: 200,
  };
};

module.exports.handler = schedule("@hourly", handler);
