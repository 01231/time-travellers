const fetch = require("node-fetch");

const query = `
  query Votes {
    votes (
      first: 1000
      where: {
        proposal: "QmPvbwguLfcVryzBRrbY4Pb9bCtxURagdv1XjhtFLf3wHj"
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
    // TODO: what if it is a tight
    if (result[key] > result[winner]) {
      winner = key;
    }
  });
  console.log(result, result[winner]);
  return result[winner];
};

const getVotes = () => {
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
    }).then((res) => res.json());
  } catch (err) {
    console.log("hallo", err);
    return {};
  }
};

exports.handler = async (event) => {
  // const { metadata, imageData, tweetURL, chainId } = JSON.parse(event.body);

  const res = await getVotes();
  const winnerAddress = calculateWinner(res);

  return {
    statusCode: 200,
  };
};
