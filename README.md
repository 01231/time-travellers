# time-travellers

[![Netlify Status](https://api.netlify.com/api/v1/badges/2a316b63-b3d2-4c70-a903-927b1023f116/deploy-status)](https://app.netlify.com/sites/time-travellers/deploys)
[![Licence](https://img.shields.io/github/license/noahliechti/time-travellers?style=social)](https://github.com/NoahLiechti/time-travellers/blob/main/LICENSE.md)
[![Live Demo](https://img.shields.io/badge/Live Preview-Click Me-green.svg?style=social)](https://time-travellers.netlify.app)

## Contracts

- Token
- NFT
- ~~DAO~~ -> not needed because we us off-chain voting with snapshot

## Notes

- you become a DAO member if you hold the TTT in your wallet
- you voting power is dependent of the amount of coins you are holding
- I your proposed NFT is chosen as a winner you we mint it to you
- TT NFT in you wallet give you extra voting power
- A tweet can only be proposed 1x
- Any tweet can be proposed by anyone, the gets imbedded in the time-travelers branding
- timelock is one week and is for the token, nft
- (metadata and image onchain)
- user pastes link of tweet
- user that vote can get rewarded?
- i propose a tweet today, but people can only vote on the day after -> bundle the proposals

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

## Extensions (if too much time)

- host site on IPFS
- use web3react to connect to metamask
