const fetch = require("node-fetch");
const { PINATA_API_KEY, PINATA_API_SECRET } = require("./utils/config");

const calculateWinner = (res) => {
  const { votes } = res.data;
  const result = {};

  // count votes for each choice
  for (let i = 0; i < votes.length; i++) {
    // if value exists add one, otherwise initalize with zero
    result[votes[i].choice] = (result[votes[i].choice] || 0) + 1;
  }

  const keys = Object.keys(result);
  let winner = keys[0];

  // get choice that was voted the most
  keys.forEach((key) => {
    // TODO: what if it is a draw
    if (result[key] > result[winner]) {
      winner = key;
    }
  });
  console.log(result, result[winner]);
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
      .then((data) => {
        if (!data.votes) {
          throw new Error("This proposal has not votes");
        }
      });
  } catch (err) {
    console.log("Ups, something went wrong:", err); // TODO: remove
    throw new Error(err.message);
  }
};

const getDates = () => {
  let start = new Date();
  start.setDate(start.getDate() - 2);
  start.setUTCHours(0, 0, 0, 0);
  start = start.toISOString();

  let end = new Date();
  end.setDate(end.getDate() - 2);
  end.setUTCHours(23, 59, 59, 999);
  end = end.toISOString();

  return { start, end };
};

const getWinnerAddress = (winnerChoice) => {
  const dates = getDates();
  const { start, end } = dates;

  // search the winning tweet from two days before TODO: filter for env?
  const metadataFilter = `&metadata[keyvalues]={"date":{"value":"${start}","secondValue":"${end}","op":"between"},"choice":{"value":"${winnerChoice}","op":"eq"}}`;

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
        const { rows } = json;
        const { metadata } = rows[0];
        const { keyvalues: keyValues } = metadata;
        return keyValues.walletAddress;
      });
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.handler = async (event) => {
  const { id, event: proposalEvent, space } = JSON.parse(event.body);
  console.log(id, proposalEvent, space, event);
  try {
    if (proposalEvent === "proposal/end" && space === "3.spaceshot.eth") {
      // "proposal/QmZ21uS8tVucpaNq2LZCbZUmHhYYXunC1ZS2gPDNWwPWD9" -> "QmZ21uS8tVucpaNq2LZCbZUmHhYYXunC1ZS2gPDNWwPWD9"
      const proposalHash = id.split("/")[1];
      // const proposalHash = "QmT8RCrHL7Hrvf37P2r22PkfWeV98wY7H6UxTR7XqTZfdA";

      const res = await getVotes(proposalHash);
      const winnerChoice = calculateWinner(res);
      const winnerAddress = await getWinnerAddress(winnerChoice);

      console.log(winnerAddress);
      // TODO: mint to winnerAddress
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
