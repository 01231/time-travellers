const fetch = require("node-fetch");
const ethers = require("ethers");
const timeTravellersNFT = require("../src/config/contracts/TimeTravellersNFT.json");
const timeTravellersToken = require("../src/config/contracts/TimeTravellersToken.json");
const addressMap = require("../src/config/contracts/map.json");

const {
  PINATA_API_KEY,
  PINATA_API_SECRET,
  ALCHEMY_API_KEY_RINKEBY,
  PRIMARY_PRIVATE_KEY,
  ENV,
} = require("./utils/config");

const PROVIDER = new ethers.providers.AlchemyProvider(
  "rinkeby",
  ALCHEMY_API_KEY_RINKEBY
);
const NFT_CONTRACT_ADDRESS = addressMap["4"].TimeTravellersNFT;
const TOKEN_CONTRACT_ADDRESS = addressMap["4"].TimeTravellersToken;

// get token amount of wallet at time lock
const getVotingPower = async (voter) => {
  const TimeTravellersToken = new ethers.Contract(
    TOKEN_CONTRACT_ADDRESS,
    timeTravellersToken.abi,
    PROVIDER
  );
  // TODO: fetch balance at block nr
  const balance = await TimeTravellersToken.balanceOf(voter);
  const wholeTokens = parseInt(ethers.utils.formatEther(balance), 10);
  return wholeTokens;
};

const calculateWinner = async (votes) => {
  const result = {};

  // count votes for each choice
  for (let i = 0; i < votes.length; i++) {
    const { choice, voter } = votes[i];
    // const votingPower = 1;
    // eslint-disable-next-line no-await-in-loop
    const votingPower = await getVotingPower(voter);
    // if value exists add one, otherwise initalize with zero
    result[choice] = (result[choice] || 0) + votingPower;
  }

  const keys = Object.keys(result);
  let winner = keys[0];

  // get choice that was voted the most
  keys.forEach((key) => {
    if (result[key] > result[winner]) {
      winner = key;
    }
  });

  // if it is a draw, the nft that was proposed first wins
  return winner;
};

const getVotes = (proposalHash) => {
  // TODO: how to get all votes?
  const query = `
  query Votes {
    votes (
      first: 1000
      where: {
        proposal: "${proposalHash}"
      }
    ) {
      id
      voter
      created
      choice
      space {
        id
      }
    }
  }
  `;

  try {
    return fetch("https://hub.snapshot.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Accept: "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { votes } = json.data;
        if (votes.length < 0) {
          throw new Error("This proposal has not votes");
        } else {
          return votes;
        }
      });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getDates = () => {
  let start = new Date();
  start.setDate(start.getDate() - 1);
  start.setUTCHours(0, 0, 0, 0);
  start = start.toISOString();

  let end = new Date();
  end.setDate(end.getDate() - 1);
  end.setUTCHours(23, 59, 59, 999);
  end = end.toISOString();

  return { start, end };
};

const getWinnerAddress = (winnerChoice) => {
  const dates = getDates();
  const { start, end } = dates;

  // search the winning tweet from two days before
  const metadataFilter = `&metadata[keyvalues]={"date":{"value":"${start}","secondValue":"${end}","op":"between"},"choice":{"value":"${winnerChoice}","op":"eq"},"env":{"value":"${ENV}","op":"eq"}}`;

  try {
    return fetch(
      // fetch pinned tweets that were pinned and created yesterday
      `https://api.pinata.cloud/data/pinList?status=pinned&pinStart=${start}&pinEnd=${end}${metadataFilter}`,
      {
        method: "GET",
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      }
    )
      .then(async (res) => res.json())
      .then((json) => {
        console.log("pinata", json, winnerChoice, ENV);
        const { rows } = json;
        if (rows.length <= 0) {
          throw new Error("No Tweets have been proposed!");
        }
        let imageIndex = 1;
        let jsonIndex = 0;

        if (rows[0].size > rows[1].size) {
          imageIndex = 0;
          jsonIndex = 1;
        }

        const { metadata } = rows[imageIndex];
        const { keyvalues: keyValues } = metadata;
        const { ipfs_pin_hash: tokenURI } = rows[jsonIndex];
        console.log(
          "test",
          tokenURI,
          keyValues.walletAddress,
          jsonIndex,
          imageIndex
        );

        return { tokenURI: tokenURI, winnerAddress: keyValues.walletAddress };
      });
  } catch (err) {
    throw new Error(err.message);
  }
};

const mintTweet = async (winnerAddress, tokenURI) => {
  console.log("mintdata", winnerAddress, tokenURI);

  const wallet = new ethers.Wallet(PRIMARY_PRIVATE_KEY, PROVIDER);
  const signer = wallet.connect(PROVIDER);
  const TimeTravellersNFT = new ethers.Contract(
    NFT_CONTRACT_ADDRESS,
    timeTravellersNFT.abi,
    signer
  );

  await TimeTravellersNFT.mintTweet(winnerAddress, tokenURI);
};

exports.handler = async (event) => {
  const { id, event: proposalEvent, space } = JSON.parse(event.body);
  console.log(id, proposalEvent, space, event);
  try {
    if (proposalEvent === "proposal/end" && space === "3.spaceshot.eth") {
      // "proposal/0xdc7b2ea2aa18cc9176807e6e25dbf071db111669f7dc4ce4de5d2a7775bf8773" ->
      // "0xdc7b2ea2aa18cc9176807e6e25dbf071db111669f7dc4ce4de5d2a7775bf8773"
      const proposalHash = id.split("/")[1];
      // const proposalHash =
      //   "0x6234e158a82799a8ae459c21f5dc6f436ec24b06bf5030079706c5244e41a34b";

      const votes = await getVotes(proposalHash);
      const winnerChoice = await calculateWinner(votes);
      const mintData = await getWinnerAddress(winnerChoice);
      await mintTweet(mintData.tokenURI, mintData.walletAddress);
    }

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
