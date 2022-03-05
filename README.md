# Time Travellers DAO

[![Netlify Status](https://api.netlify.com/api/v1/badges/2a316b63-b3d2-4c70-a903-927b1023f116/deploy-status)](https://app.netlify.com/sites/time-travellers/deploys)
[![Licence](https://img.shields.io/github/license/noahliechti/time-travellers?style=social)](https://github.com/NoahLiechti/time-travellers/blob/main/LICENSE.md)
[![Live Demo](https://img.shields.io/badge/Live Preview-Click Me-green.svg?style=social)](https://time-travellers.netlify.app)

## TODO

- website shouldn't crack when no metamask
- fix calendar design

- footer design
- update proposal? gnosis safe plugin entfernen?
- add meta descriptions
- proposal auf 23h stellen

- calculate voting power at blocknumber using snapshot.js
- clock wie lange es noch läuft -> error wenn nicht mehr läuft?
- roadmap
- about/team?
- update the token address in snapshot space after deploying a new contract
- start puppeteer in utc
- delete old proposals

## Contracts

- Token
- NFT
- ~~DAO~~ -> not needed because we us off-chain voting with snapshot

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

- timelock is one week and is for the token, nft

## Stack

### Frontend

- React
- ethers.js
- bootstrap

### Backend

- Netfliy: scheduled functions + serverless functions
- Node.js

### Other

- Hardhat
- Snaphshot
- Gnosis safe

## Website

- responsive
- accessible
- SEO friendly

## Future

- host site on IPFS
- use web3react to connect to metamask

### Dedicated Pinata gateway

- greater speed
- increased rate limits

### ENS Domain

- Receive funds on own domain
- Stop using test mode in snapshot
