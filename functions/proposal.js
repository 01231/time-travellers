const { schedule } = require("@netlify/functions");
const fetch = require("node-fetch");
const snapshot = require("@snapshot-labs/snapshot.js");
const { ethers } = require("ethers");
const {
  PRIMARY_PRIVATE_KEY,
  ALCHEMY_API_KEY_RINKEBY,
  REACT_APP_PINATA_API_KEY,
  REACT_APP_PINATA_API_SECRET,
  ENV,
} = require("./utils/config");

const addressMap = require("../src/config/contracts/map.json");

const TOKEN_CONTRACT_ADDRESS = addressMap["4"].TimeTravellersToken;

const formatDate = (date) => Math.round(date / 1e3);

const strategies = JSON.stringify([
  {
    name: "erc20-balance-of",
    params: {
      symbol: "TTT",
      address: TOKEN_CONTRACT_ADDRESS,
      decimals: 18,
    },
  },
]);

// TODO: how to make plugin dynamic? or remove plugin? safeSnap unused?
const plugins = JSON.stringify({
  safeSnap: {
    safes: [
      {
        network: "4",
        realityAddress: "0xE2f51aa68B9140F9090e40519Ce1bDcDdBC3e4cA",
        multiSendAddress: "0x8D29bE29923b68abfDD21e541b9374737B49cdAD",
        hash: "0xf144c9428ba6e01472283c186fed8633cc05184164c223a6cc6591e7ec7ae7bd",
        txs: [
          {
            hash: "0xf9262886d443634b361db0a4be05ec619415308880eaac35555cc8e2e8e5ac23",
            nonce: 0,
            mainTransaction: {
              operation: "0",
              nonce: "0",
              token: {
                name: "Ether",
                decimals: 18,
                symbol: "ETH",
                logoUri:
                  "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
                address: "main",
              },
              recipient: "0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f",
              type: "transferFunds",
              data: "0x",
              to: "0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f",
              amount: "10000000000000000",
              value: "10000000000000000",
            },
            transactions: [
              {
                operation: "0",
                nonce: 0,
                token: {
                  name: "Ether",
                  decimals: 18,
                  symbol: "ETH",
                  logoUri:
                    "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
                  address: "main",
                },
                recipient: "0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f",
                type: "transferFunds",
                data: "0x",
                to: "0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f",
                amount: "10000000000000000",
                value: "10000000000000000",
              },
            ],
          },
        ],
      },
    ],
    valid: true,
  },
});

const getDates = () => {
  let start = new Date();
  start.setDate(start.getDate() - 1);
  start.setUTCHours(0, 0, 0, 0);
  start = start.toISOString();

  let end = new Date();
  end.setDate(end.getDate() - 1);
  end.setUTCHours(23, 59, 59, 999);
  end = end.toISOString();

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const month = yesterday.getUTCMonth() + 1; // months from 1-12
  const day = yesterday.getUTCDate();
  const year = yesterday.getUTCFullYear();
  yesterday = `${year}/${month}/${day}`;

  return { start, end, yesterday };
};

const getProposedTweets = async () => {
  const dates = getDates();
  const { start, end, yesterday } = dates;

  // allow only tweets that were created the day before
  const metadataFilter = `&metadata[keyvalues]={"date":{"value":"${start}","secondValue":"${end}","op":"between"},"type":{"value":"tweet","op":"eq"},"env":{"value":"${ENV}","op":"eq"}}`;

  return fetch(
    // fetch pinned tweets that were pinned and created yesterday
    `https://api.pinata.cloud/data/pinList?status=pinned&pinStart=${start}&pinEnd=${end}${metadataFilter}`,
    {
      method: "GET",
      headers: {
        pinata_api_key: REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: REACT_APP_PINATA_API_SECRET,
      },
    }
  )
    .then(async (res) => res.json())
    .then((json) => {
      let markdown = "> Which Tweet represents yesterday the best?";
      const { rows } = json;
      const choices = [];
      const title = `Voting for ${yesterday}`;

      // start from the last array element, which is the first proposed tweet
      for (let i = rows.length; i > 0; i--) {
        const { ipfs_pin_hash: pinHash, metadata } = rows[i - 1];
        const { keyvalues: keyValues } = metadata;
        const { choice, description, twitterURL } = keyValues;

        if (choice !== rows.length - i + 1) {
          throw new Error(
            `Ups something went wrong while creating the proposal! choice: ${choice} element: ${
              rows.length - i + 1
            }`
          );
        }
        markdown += `\n\n## Tweet ${choice}\n\n[![${description}](https://gateway.pinata.cloud/ipfs/${pinHash})](${twitterURL})`;
        choices.push(`Tweet ${choice}`);
      }
      return [markdown, choices, title];
    });
};

const createProposal = async (markdown, choices, title) => {
  const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
  const client = new snapshot.Client712(hub);

  const provider = new ethers.providers.AlchemyProvider(
    "rinkeby",
    ALCHEMY_API_KEY_RINKEBY
  );
  const wallet = new ethers.Wallet(PRIMARY_PRIVATE_KEY, provider);
  const signer = wallet.connect(provider);

  const blockNumber = (await provider.getBlock()).number;

  try {
    if (choices.length <= 0) {
      throw new Error("No recommendations have been proposed");
    }
    await client.proposal(signer, signer.address, {
      space: "3.spaceshot.eth",
      type: "single-choice",
      title: title,
      body: markdown,
      choices: choices,
      start: formatDate(Date.now()),
      end: formatDate(Date.now() + 1000 * 60 * 30), // + 30mins // TODO: make one day or 23 h
      snapshot: blockNumber, // TODO: how far back do we want to go?
      network: "4", // TODO: dynamic?
      strategies: strategies,
      plugins: plugins,
      metadata: JSON.stringify({}),
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const handler = async () => {
  try {
    const dynamicData = await getProposedTweets();
    await createProposal(...dynamicData);

    return {
      statusCode: 200,
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};

module.exports.handler = schedule("@daily", handler);
