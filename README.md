# Time Travellers DAO

[![Netlify Status](https://api.netlify.com/api/v1/badges/2a316b63-b3d2-4c70-a903-927b1023f116/deploy-status)](https://app.netlify.com/sites/time-travellers/deploys)
[![Licence](https://img.shields.io/github/license/noahliechti/time-travellers?style=social)](https://github.com/NoahLiechti/time-travellers/blob/main/LICENSE.md)
[![Live Demo](https://img.shields.io/badge/Live Preview-Click Me-green.svg?style=social)](https://time-travellers.netlify.app)

## Checklist

- [ ] video demo your project for at most 3 minutes
- [ ] fill out from
  - [ ] You must provide a link to the public repository for your project
  - [ ] You must provide a link to your live project
  - [ ] You must designate one member of your team as the lead to act as the main point of contact should we need to reach out

- [ ] The name and summary of the project
- [ ] How the project uses to IPFS and/or Filecoin and/or decentralized storage services that build on top of either with example links to where in code those technologies are used.
- [ ] Names/pseudonyms of team members and contact info (e.g., GitHub handle, email address, or other)
- [ ] Provide comprehensive README, incl. a clear description of the work and mention of how our tech is used in the Technologies Used section of README.
- [ ] 2-3 minute video that presents the idea, including a brief demo that demonstrates the use of IPFS and/or Filecoin or anything that builds on top of them.
- [ ] Include a link to the working demo or provide a testing guide

## Problem statement

Tweets on average last for about [15 minutes](https://the-refinery.io/blog/how-long-does-a-social-media-post-last). Afterwards they are gone. Forever. But how can we preserve good Tweets and how can we choose this Tweet so that everybody agrees?

## Our solution

Time Travellers DAO provides a user interface that allows every person with a MetaMask account to suggest their favourite Tweet of that day. During the day the Tweets are collected and a the of a day (UTC) a proposal is created on Snapshot. All DAO members now can vote for the Tweet that they like the most. After the voting period has ended we mint the "winner" Tweet to the person that suggested it.

## Implementation

Our project is fully functional and deployed [here](https://time-travellers.netlify.app/). We have chosen a fully automated approach to eliminate human errors and make the project more decentralized.

### Blockchain Technology

We run on Rinkeby.

- [Snapshot](https://snapshot.org/#/3.spaceshot.eth/about): An off-chain gasless multi-governance client with easy to verify and hard to contest results
  - [Snapshot.js](https://docs.snapshot.org/snapshot.js): The official JavaScript client for build Snapshot apps. We create dynamic proposals at midnight with it
  - [Webhooks](https://docs.snapshot.org/webhooks): Receive event notifications with webhooks. We used it to trigger the minting of the winner Tweet after a proposal has ended
  - [GraphQL API](https://docs.snapshot.org/graphql-api): Create flexible queries for the data you need to integrate with Snapshot. We used it to calculate the Tweet that has received to most votes
- [Gnosis Safe](https://gnosis-safe.io/app/rin:0x1104Eed7b5A9d1338a5b4822dFB0d66fF4AC216D/balances): Multi-signature wallet to manage the DAO's assets
- Hardhat
- [Pinata](https://www.pinata.cloud/): NFT media management. We collect all suggested NFTs here.
- Token Contract (ERC20) TODO: LINK
- NFT Contract (ERC721) TODO: LINK

### Frontend

- React
- ethers.js
- [MUI](https://mui.com/): React UI Library

#### Features

- responsive
- accessible
- SEO friendly TODO: screenshot of lighthouse

### Backend

- [Netfliy](https://www.netlify.com/): We host the website here. Netlify automatically creates feature previews on pullrequests.
  - scheduled functions: Like cron jobs
  - serverless functions
- Node.js

### Other

- Chai/Mocha/Waffle: Test suite for our smart contract tests

## Q&A

### How can I get the governance tokens (TTT)?

The easiest way is to buy some of our tokens on [Uniswap](https://app.uniswap.org/#/swap?chain=rinkeby). We created a liquidity pool with 80% of the total governance tokens. All you need is some Rinkeby test Ether. Add this Token TODO: `0x6C74aDc0D6dB2Ca6A9758EE28BD86a66c922A5AB` to the token list on Uniswap.

### How can I become part of Time Travellers DAO?

To be part of our community you need to hold TTT, which is our own governance tokens

### How can I vote on proposals?

All DAO members are allowed to vote on proposals. Your voting power is dependant on how many tokens you hold. Go to [Snapshot](https://snapshot.org/#/3.spaceshot.eth) and look for the most recent active Proposal.

### What happens to the NFT that received the most votes?

The NFT will be minted to the address from which the NFT was suggested.

### Why can't I vote on the proposal even though I hold TTT in my wallet?

You need to hold the tokens for at least one week. With this method the DAO can ensure the quality of the votes. (This feature is turned off for demonstration purposes)

### What happens when two or more Tweet receive the same amount of votes?

The Tweet that was proposed first wins.

### What is the voting period of the proposals?

The voting period on the proposal is 23h.

### How much voting power do I have?

Your voting power is dependent of the amount of tokens you are holding.

## Production checklist

- [ ] Dedicated Pinata gateway
   - greater speed
   - increased rate limits
- [ ] ENS Domain
  - Receive funds on own domain
  - Stop using test mode in snapshot
