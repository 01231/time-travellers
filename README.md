# time-travellers

## Contracts

- DAO
- Token
- NFT

## Notes

- you become a DAO member if you hold the TT coins in your wallet
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

- React
- ethers.js
- Hardhat
- Polygon / Mumbai network
- Netfliy -> falls noch zeit mit IPFS
  - scheduled functions/cron jobs https://github.com/netlify/labs/blob/main/features/scheduled-functions/documentation/README.md hat runs every day to mint
- Node.js
- Serverless functions
- bootstrap or MUI
- web3react
- snaphshot -> one coin is one vote
  - buy ens domain
  - allow only authors to make proposal
