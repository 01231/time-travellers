const { schedule } = require("@netlify/functions");
const fetch = require("node-fetch");
const snapshot = require("@snapshot-labs/snapshot.js");
const { ethers } = require("ethers");
const {
  PRIMARY_PRIVATE_KEY,
  REACT_APP_ALCHEMY_API_KEY_RINKEBY,
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

        // eslint-disable-next-line eqeqeq
        if (choice != rows.length - i + 1) {
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
    REACT_APP_ALCHEMY_API_KEY_RINKEBY
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
      end: formatDate(Date.now() + 1000 * 60 * 60 * 23), // + 23 hours
      snapshot: blockNumber, // TODO: how far back do we want to go?
      network: "4",
      strategies: strategies,
      plugins: JSON.stringify({}),
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
