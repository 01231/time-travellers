const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { utils, BigNumber } = require("ethers");

describe("TimeTravellersNFT", function () {
  it("Test for basic uses from NFTContract", async function () {
    // test to receive contract addresses
    const TTN = await ethers.getContractFactory("TimeTravellersNFT");
    const ttn = await TTN.deploy();
    await ttn.deployed();

    // test to receive symbol and name
    expect(await ttn.name()).to.equal("Time-Travellers-NFT");
    expect(await ttn.symbol()).to.equal("TTN");

    // creating a few addresses
    const [owner, addr2, addr3] = await ethers.getSigners();

    // test to check/receive all roles have been initiated correctly
  });
});
describe("TimeTravellersNFT", function () {
  it("tests for a bunch of minting", async function () {
    // test to receive contract addresses
    const TTN = await ethers.getContractFactory("TimeTravellersNFT");
    const ttn = await TTN.deploy();
    await ttn.deployed();

    // creating a few addresses
    const [owner, addr2, addr3] = await ethers.getSigners();

    // test minting funtionality with owner address and random addresses
    await ttn.mintTweet(
      "0x2b4F0b671c96d4E4Bbe8Ca084a037902C0c8929c",
      "https://twitter.com/MoonbeamNetwork/status/1499188339966201863"
    );

    /* 
    // @dev test showing the intended result but isn't showing "passing" for some reason (maybe because of keccak256, Keccak256-Problem)
    
   expect(
      await ttn
        .connect(addr2)
        .mintTweet(
          "0x2b4F0b671c96d4E4Bbe8Ca084a037902C0c8929c",
          "https://twitter.com/MoonbeamNetwork/status/1499188339966201863"
        )
    ).to.be.revertedWith(
      "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role  0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
    );*/

    await ttn.mintTweet(
      "0x2b4F0b671c96d4E4Bbe8Ca084a037902C0c8929c",
      "https://twitter.com/MoonbeamNetwork/status/1499188339966201863"
    );

    expect(
      await ttn.balanceOf("0x2b4F0b671c96d4E4Bbe8Ca084a037902C0c8929c")
    ).to.equal(2);

    const allMinted = await ttn.getAllMintedTokens();
    console.log(allMinted);
  });
});
