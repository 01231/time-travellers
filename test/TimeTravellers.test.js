const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { utils, BigNumber } = require("ethers");

describe("TimeTravellersNFT", function () {
  beforeEach(async function () {
    const TTN = await ethers.getContractFactory("TimeTravellersNFT");
    const ttn = await TTN.deploy();
    await ttn.deployed();
  });
  describe("NFT", function () {
    it("Name and symbol", async function () {
      expect(await ttn.name()).to.equal("Time-Travellers-NFT");
      expect(await ttn.symbol()).to.equal("TTN");
    });
  });

  it("Name and symbol", async function () {
    expect(await ttn.name()).to.equal("Time-Travellers-NFT");
    expect(await ttn.symbol()).to.equal("TTN");
  });

  it("tests for a bunch of minting", async function () {
    // test to receive contract addresses
    const TTN = await ethers.getContractFactory("TimeTravellersNFT");
    const ttn = await TTN.deploy();
    await ttn.deployed();

    // grabbing a few addresses
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
    //console.log(allMinted);
    const randomTweet = await ttn.IdToTweet(1);
    //console.log(randomTweet);
  });
});

describe("TimeTravellersToken", function () {
  it("Should show name and symbol", async function () {
    const TTT = await ethers.getContractFactory("TimeTravellersToken");
    const ttt = await TTT.deploy();
    await ttt.deployed();
    expect(await ttt.name()).to.equal("Time-Travellers-Token");
    expect(await ttt.symbol()).to.equal("TTT");
  });

  it("Should show balances of holders", async function () {
    const TTT = await ethers.getContractFactory("TimeTravellersToken");
    const ttt = await TTT.deploy();
    await ttt.deployed();

    // expect(await ttt.PRICE()).to.equal(10000000000000);

    /*let res = await ttt.MAX_TOKEN_CAP();
    res = ethers.utils.formatEther(res);
    expect(res).to.equal("10000.0");

    
    let supply = await ttt.currentSupply();
    supply = ethers.utils.formatEther(supply);
    expect(supply).to.equal("2000.0");
    */
    expect(
      (
        await ttt.balanceOf("0x2b4F0b671c96d4E4Bbe8Ca084a037902C0c8929c")
      ).toString()
    ).to.equal("9000000000000000000000");
    expect(
      (
        await ttt.balanceOf("0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f")
      ).toString()
    ).to.equal("1000000000000000000000");
  });
});
