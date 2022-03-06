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
  - [Snapshot.js](https://docs.snapshot.org/snapshot.js): The official JavaScript client for build Snapshot apps. We create dynamic proposals at midnight
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

### Backend

- [Netfliy](https://www.netlify.com/): We host the website here. Netlify automatically creates feature previews on pullrequests.
  - scheduled functions: Like cron jobs
  - serverless functions
- Node.js

### Other

- Chai/Mocha/Waffle: Test suite for our smart contract tests


## Functionality

- A tweet can only be suggested once
- The voting period on the proposal is 23h
- We use UTC time
- Everybody that holds TTT can vote on a proposal
- I your suggested NFT is chosen as a winner we mint it to you
- If the voting ends in a draw, the tweet that was proposed first wins

## Notes

- you become a DAO member if you hold the TTT in your wallet
- you voting power is dependent of the amount of coins you are holding

- timelock is one week but we removed it for testing purposes

## Website

- responsive
- accessible
- SEO friendly

## Future

- host site on IPFS
- use web3react to connect to metamask

## Features

## Extensions (if too much time)

- host site on IPFS
- use web3react to connect to metamask

## Future

### Dedicated Pinata gateway

- greater speed
- increased rate limits

### ENS Domain

- Receive funds on own domain
- Stop using test mode in snapshot
